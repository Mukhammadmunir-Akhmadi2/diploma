import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import type { Category } from "../../types/category";
import {
  listSubcategories,
  getAboveCategories,
  listRootCategories,
  getCategoryById
} from "../../api/Category";
import { useToast } from "../ui/use-toast";
import AddCategoryDialog from "../AddCategoryDialog";

interface CategorySelectProps {
  categoryId: string | null;
  onChange: (categoryId: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categoryId,
  onChange,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [categoryPath, setCategoryPath] = useState<Category[]>([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState<
    Record<string, Category[]>
  >({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    const loadInitialCategoryPath = async () => {
      try {
        setIsLoading(true);

        if (categoryId) {
          const path = await getAboveCategories(categoryId);
          setCategoryPath(path);

          if (path && path.length > 0) {
            const category = path[path.length - 1];
            setSelectedCategory(category);
          } else {
            const category = await getCategoryById(categoryId);
            if (category) {
              setSelectedCategory(category);
              setCategoryPath([category]);
            }
          }

          const newSubMap: Record<string, Category[]> = {};
          for (let i = 0; i < path.length; i++) {
            const parentId = i === 0 ? "root" : path[i - 1].categoryId;
            const subcats = await listSubcategories(parentId);
            newSubMap[parentId] = subcats;
          }

          if (path.length > 0) {
            const last = path[path.length - 1];
            const lastSubcats = await listSubcategories(last.categoryId);
            newSubMap[last.categoryId] = lastSubcats;
          }

          setSubcategoriesMap(newSubMap);
        } else {
          const rootCategories = await listRootCategories();
          setSubcategoriesMap({ root: rootCategories });
        }
      } catch (err) {
        console.error("Error initializing category path:", err);
        toast({
          title: t("error.fetchCategory", {
            defaultValue: "Error fetching categories",
          }),
          description: t("error.tryAgain", {
            defaultValue: "Please try again later",
          }),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialCategoryPath();
  }, []);

  const handleCategoryChange = async (
    levelIndex: number,
    selectedId: string
  ) => {
    const currentCategoryList =
      levelIndex === 0
        ? subcategoriesMap["root"]
        : subcategoriesMap[categoryPath[levelIndex - 1]?.categoryId || ""];
    const selectedCategory = currentCategoryList?.find(
      (cat) => cat.categoryId === selectedId
    );
    if (!selectedCategory) return;

    const newPath = [...categoryPath.slice(0, levelIndex), selectedCategory];
    setCategoryPath(newPath);

    setSelectedCategory(selectedCategory);

    onChange(selectedCategory.categoryId);

    try {
      const children = await listSubcategories(selectedCategory.categoryId);
      if (children?.length > 0) {
        setSubcategoriesMap((prev) => ({
          ...prev,
          [selectedCategory.categoryId]: children,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
    }
  };

  const currentLevelCategories = (levelIndex: number): Category[] => {
    if (levelIndex === 0) return subcategoriesMap["root"] || [];
    const parentId = categoryPath[levelIndex - 1]?.categoryId;
    return subcategoriesMap[parentId] || [];
  };

  const openCreateDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCreateCategory = (newCategory: Category) => {
    const parentId = newCategory.parentId || "root";
    setSubcategoriesMap((prev) => ({
      ...prev,
      [parentId]: [...(prev[parentId] || []), newCategory],
    }));

    setCategoryPath((prev) => [...prev, newCategory]);
    onChange(newCategory.categoryId);
  };

  return (
    <div className="space-y-4">
      {categoryPath.map((category, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Select
            key={`select-${category.categoryId}`}
            value={category.categoryId}
            onValueChange={(val) => handleCategoryChange(index, val)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("merchant.selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {currentLevelCategories(index).map((cat) => (
                <SelectItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <div className="flex gap-2 items-center">
        <Select
          onValueChange={(val) =>
            handleCategoryChange(categoryPath.length, val)
          }
          value={categoryId}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("merchant.selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            {currentLevelCategories(categoryPath.length).map((cat) => (
              <SelectItem key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={openCreateDialog}
          type="button"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add Category Dialog */}
      <AddCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateCategory}
        parentCategoryId={
          categoryPath[categoryPath.length - 1]?.categoryId || null
        }
      />
    </div>
  );
};

export default CategorySelect;
