import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import type { Category } from "../../types/category";
import { updateCategory, mergeCategories } from "../../api/admin/AdminCategory";
import { useToast } from "../ui/use-toast";

interface EditCategoryModalProps {
  category: Category;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  category,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const { t } = useLanguage();
  const [editedCategory, setEditedCategory] = useState<Category>({
    ...category,
  });
  const [activeTab, setActiveTab] = useState("edit");
  const [mergeTargetId, setMergeTargetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedCategory((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleParentChange = (value: string) => {
    setEditedCategory((prev) => ({
      ...prev,
      parentId: value === "none" ? null : value,
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updatedCategory = await updateCategory(editedCategory); 
      onSave(updatedCategory); 
      toast({
        title: t("admin.categoryUpdated"),
        description: t("admin.categoryUpdatedDesc"),
      });
      onClose();
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast({
        title: t("admin.errorUpdatingCategory"),
        description: error.message || t("admin.tryAgainLater"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  
  const handleMergeCategory = async () => {
    if (!mergeTargetId) return;

    setIsSaving(true);
    try {
      const result = await mergeCategories(category.categoryId, mergeTargetId); 
      toast({
        title: t("admin.categoriesMerged"),
        description: result,
      });
      onClose();
    } catch (error: any) {
      console.error("Error merging categories:", error);
      toast({
        title: t("admin.errorMergingCategories"),
        description: error.message || t("admin.tryAgainLater"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getMergeTargetOptions = () => {
    return categories.filter(
      (cat) =>
        cat.categoryId !== category.categoryId &&
        !category.subCategoriesId?.includes(cat.categoryId)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.editCategory")}</DialogTitle>
          <DialogDescription>
            Update category details or merge with another category.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="edit">{t("common.edit")}</TabsTrigger>
            <TabsTrigger value="merge">
              {t("admin.mergeCategories")}
            </TabsTrigger>
          </TabsList>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="categoryName">{t("product.category")}</Label>
                <Input
                  id="categoryName"
                  value={editedCategory.name}
                  onChange={handleNameChange}
                />
              </div>

              <div>
                <Label htmlFor="parentCategory">
                  {t("admin.parentCategory")}
                </Label>
                <Select
                  value={editedCategory.parentId || "none"}
                  onValueChange={handleParentChange}
                >
                  <SelectTrigger id="parentCategory">
                    <SelectValue placeholder="Select a parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      None (Top Level Category)
                    </SelectItem>
                    {categories.map((parent) => (
                      <SelectItem
                        key={parent.categoryId}
                        value={parent.categoryId}
                      >
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t("admin.subCategories")}</Label>
                <div className="mt-2">
                  {category.subCategoriesId &&
                  category.subCategoriesId.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {category.subCategoriesId.map((subCategoryId) => {
                        const subCategory = categories.find(
                          (c) => c.categoryId === subCategoryId
                        );
                        return subCategory ? (
                          <div
                            key={subCategoryId}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                          >
                            {subCategory.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      This category has no subcategories.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Merge Tab */}
          <TabsContent value="merge" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Merging will move all products from this category to the selected
              category and then delete this category.
            </p>

            <div>
              <Label htmlFor="mergeTarget">Merge with Category</Label>
              <Select
                value={mergeTargetId || ""}
                onValueChange={setMergeTargetId}
              >
                <SelectTrigger id="mergeTarget">
                  <SelectValue placeholder="Select a category to merge with" />
                </SelectTrigger>
                <SelectContent>
                  {getMergeTargetOptions().map((cat) => (
                    <SelectItem key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                variant="destructive"
                disabled={!mergeTargetId}
                onClick={handleMergeCategory}
              >
                Merge Categories
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSaveChanges}>{t("common.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
