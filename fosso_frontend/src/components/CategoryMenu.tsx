import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { ChevronRight, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { type Category } from "../types/category";
import { listHierarchicalCategories } from "../api/Category";
import { useToast } from "../hooks/useToast";

// Example hierarchical category data
interface CategoryMenuProps {
  selectedGender?: "men" | "women" | null;
  onClick?: () => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  selectedGender = null,
  onClick,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const data = await listHierarchicalCategories();
        setCategories(data);
      } catch (error) {
        toast({
          title: t("error.fetchCategories"),
          description: t("error.tryAgain"),
          variant: "destructive",
        });
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on selected gender and search query
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      children: category.children
        ?.filter(
          (subcat) =>
            searchQuery === "" ||
            subcat.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((subcat) => ({
          ...subcat,
          children: subcat.children?.filter(
            (subsubcat) =>
              searchQuery === "" ||
              subsubcat.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        })),
    }))
    .filter(
      (category) =>
        searchQuery === "" ||
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.children && category.children.length > 0)
    );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveCategory(null);
        setActiveSubcategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle category hover/click
  const handleCategoryHover = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
  };

  // Handle category click
  const handleCategoryClick = (category: Category) => {
    const genderPath = selectedGender ? `/${selectedGender}` : "";
    navigate(`${genderPath}/category/${category.categoryId}`);
    setIsOpen(false);
  };

  // Handle subcategory hover/click
  const handleSubcategoryHover = (subcategoryId: string) => {
    setActiveSubcategory(subcategoryId);
  };

  // Handle subcategory click
  const handleSubcategoryClick = (
    category: Category,
    subcategory: Category
  ) => {
    const genderPath = selectedGender ? `/${selectedGender}` : "";
    navigate(`${genderPath}/category/${subcategory.categoryId}`);
    setIsOpen(false);
  };

  // Handle sub-subcategory click
  const handleSubSubcategoryClick = (subsubcategory: Category) => {
    const genderPath = selectedGender ? `/${selectedGender}` : "";
    navigate(`${genderPath}/category/${subsubcategory.categoryId}`);
    setIsOpen(false);
  };

  // Get current active category data
  const activeMainCategory = filteredCategories.find(
    (cat) => cat.categoryId === activeCategory
  );

  // Get current active subcategory data
  const activeSecondaryCategory = activeMainCategory?.children?.find(
    (subcat) => subcat.categoryId === activeSubcategory
  );

  // Function to split list into columns if too long
  const renderInColumns = (items: Category[], maxPerColumn: number = 8) => {
    if (!items || items.length === 0) return null;

    const columns = [];
    const columnCount = Math.ceil(items.length / maxPerColumn);

    for (let i = 0; i < columnCount; i++) {
      const startIndex = i * maxPerColumn;
      const endIndex = startIndex + maxPerColumn;
      const columnItems = items.slice(startIndex, endIndex);

      columns.push(
        <div key={i} className="min-w-[12rem]">
          {columnItems.map((item) => (
            <button
              key={item.categoryId}
              className="block py-2 px-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md w-full text-left"
              onClick={() => handleSubSubcategoryClick(item)}
            >
              {item.name}
            </button>
          ))}
        </div>
      );
    }

    return <div className="flex gap-4 overflow-hidden">{columns}</div>;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Trigger Button */}
      <button
        className="flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        onClick={() => {
          setIsOpen(!isOpen);
          onClick();
        }}
        onMouseEnter={() => setIsOpen(true)}
      >
        <span>{t("nav.categories")}</span>
        <ChevronRight
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 z-50 mt-1 bg-white dark:bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 w-screen max-w-screen-lg overflow-hidden max-h-[70vh]"
          onMouseLeave={() => {
            setIsOpen(false);
          }}
        >
          {/* Search box */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("nav.searchCategories")}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex">
            {/* First Column - Main Categories */}
            <div className="bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-w-[200px] max-h-[70vh] overflow-y-auto">
              {filteredCategories.map((category) => (
                <button
                  key={category.categoryId}
                  className={`flex items-center justify-between w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    activeCategory === category.categoryId
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }`}
                  onMouseEnter={() => handleCategoryHover(category.categoryId)}
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {category.name}
                  </span>
                  {category.children && category.children.length > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Second Column - Subcategories */}
            {activeMainCategory &&
              activeMainCategory.children &&
              activeMainCategory.children.length > 0 && (
                <div className="bg-white dark:bg-gray-900 min-w-[200px] max-h-[70vh] overflow-y-auto">
                  {activeMainCategory.children.map((subcategory) => (
                    <button
                      key={subcategory.categoryId}
                      className={`flex items-center justify-between w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        activeSubcategory === subcategory.categoryId
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }`}
                      onMouseEnter={() =>
                        handleSubcategoryHover(subcategory.categoryId)
                      }
                      onClick={() =>
                        handleSubcategoryClick(activeMainCategory, subcategory)
                      }
                    >
                      <span className="text-gray-800 dark:text-gray-200">
                        {subcategory.name}
                      </span>
                      {subcategory.children &&
                        subcategory.children.length > 0 && (
                          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                    </button>
                  ))}
                </div>
              )}

            {/* Third Column - Sub-subcategories */}
            {activeSecondaryCategory &&
              activeSecondaryCategory.children &&
              activeSecondaryCategory.children.length > 0 && (
                <div className="bg-white dark:bg-gray-900 p-4 min-w-[250px] max-h-[70vh] overflow-y-auto">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {activeSecondaryCategory.name}
                  </h3>
                  {renderInColumns(activeSecondaryCategory.children)}
                </div>
              )}

            {/* Show direct links if the active category has no children */}
            {activeMainCategory &&
              (!activeMainCategory.children ||
                activeMainCategory.children.length === 0) && (
                <div className="bg-white dark:bg-gray-900 p-4 min-w-[250px]">
                  <Link
                    to={
                      selectedGender
                        ? `/${selectedGender}/category/${activeMainCategory.categoryId}`
                        : `/category/${activeMainCategory.categoryId}`
                    }
                    className="block py-2 px-3 text-sm text-blue-600 hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav.viewAll")} {activeMainCategory.name}
                  </Link>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
