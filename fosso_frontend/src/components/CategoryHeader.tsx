import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../types/category";
import { listSubcategories, getCategoryById } from "../api/Category";
import { useLanguage } from "../hooks/useLanguage";

interface CategoryHeaderProps {
  categoryId?: string;
  keyword?: string;
  selectedBrand?: string | null;
}
const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  categoryId,
  keyword,
  selectedBrand,
}) => {
  const { t } = useLanguage();

  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [siblingCategories, setSiblingCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoreis = async () => {
      try {
        let subcategories;
        if (categoryId) {
          subcategories = await listSubcategories(categoryId);
          const selectedCategory = await getCategoryById(categoryId);
          setCurrentCategory(selectedCategory || null);
        } else {
          subcategories = await listSubcategories("root");
        }
        setSiblingCategories(subcategories);
      } catch (err) {
        console.error("Error fetching filter data:", err);
      }
    };
    fetchCategoreis();
  }, [categoryId]);

  return (
    <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white capitalize">
          {currentCategory?.name ||
            selectedBrand ||
            keyword ||
            t("products.all")}
        </h1>

        {/* Sibling categories */}
        {siblingCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {siblingCategories.map((category) => (
              <Link
                key={category.categoryId}
                to={`/category/${category.categoryId}`}
                className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryHeader;
