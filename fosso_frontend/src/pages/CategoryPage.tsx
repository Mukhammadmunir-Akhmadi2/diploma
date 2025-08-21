import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Separator } from "../components/ui/separator";
import type { ProductBriefDTO } from "../types/product";
import { listSubcategories, getCategoryById } from "../api/Category";
import { getAllProducts } from "../api/Product";
import type { PaginatedResponse } from "../types/paginatedResponse";
import type { Gender } from "../types/enums";
import { useToast } from "../hooks/useToast";
import type { Category } from "../types/category";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import ProductCard from "../components/ProductCard";
import type { BrandDTO } from "../types/brand";
import { listAllBrands } from "../api/Brand";
import { Spin } from "antd";
import type { ErrorResponse } from "../types/error";

const colors = [
  { id: "1", name: "Black", hex: "#000000" },
  { id: "2", name: "White", hex: "#FFFFFF" },
  { id: "3", name: "Red", hex: "#FF0000" },
  { id: "4", name: "Blue", hex: "#0000FF" },
  { id: "5", name: "Green", hex: "#00FF00" },
  { id: "6", name: "Yellow", hex: "#FFFF00" },
  { id: "7", name: "Brown", hex: "#A52A2A" },
  { id: "8", name: "Deep Ice", hex: "#A2C6E4" },
  { id: "9", name: "Marine", hex: "#3B9C9C" },
  { id: "10", name: "Marsh", hex: "#6B8E23" },
  { id: "11", name: "Dark Marsh", hex: "#556B2F" },
  { id: "12", name: "Vanilla", hex: "#F3E5AB" },
  { id: "13", name: "Lavender", hex: "#E6E6FA" },
  { id: "14", name: "Coral", hex: "#FF7F50" },
  { id: "15", name: "Peach", hex: "#FFE5B4" },
  { id: "16", name: "Charcoal", hex: "#36454F" },
  { id: "17", name: "Mint", hex: "#98FF98" },
  { id: "18", name: "Teal", hex: "#008080" },
  { id: "19", name: "Rose", hex: "#FFC0CB" },
  { id: "20", name: "Olive", hex: "#808000" },
  { id: "21", name: "Slate", hex: "#708090" },
  { id: "22", name: "Ivory", hex: "#FFFFF0" },
  { id: "23", name: "Plum", hex: "#8E4585" },
  { id: "24", name: "Copper", hex: "#B87333" },
  { id: "25", name: "Taupe", hex: "#483C32" },
  { id: "26", name: "Ecru", hex: "#C2B280" },
];

interface CategoryPageProps {
  gender?: Gender | null;
  isPopular?: boolean;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  gender: preSelectedGender,
  isPopular,
}) => {
  const { t } = useLanguage();
  const { categoryId, brandId, keyword } = useParams();

  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandId || null
  );

  const [selectedGender, setSelectedGender] = useState<Gender | null>(
    preSelectedGender || null
  );
  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [siblingCategories, setSiblingCategories] = useState<Category[]>([]);
  const [pageProducts, setPageProducts] =
    useState<PaginatedResponse<ProductBriefDTO>>();
  const [page, setPage] = useState<number>(1);
  const { toast } = useToast();
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [applyFilters, setApplyFilters] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(
          {
            categoryId: categoryId || undefined,
            brandId: selectedBrand || undefined,
            gender: selectedGender || undefined,
            keyword: keyword || undefined,
            color: selectedColor || undefined,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
          },
          page,
          12,
          isPopular ? "rating,desc" : undefined
        );

        let subcategories;
        if (categoryId) {
          subcategories = await listSubcategories(categoryId);
          const selectedCategory = await getCategoryById(categoryId);
          setCurrentCategory(selectedCategory || null);
        } else {
          subcategories = await listSubcategories("root");
        }

        const allBrands = await listAllBrands();

        if (brandId) {
          const selectedBrand = allBrands.find(
            (brand) => brand.brandId === brandId
          );
          setSelectedBrand(selectedBrand?.brandId || null);
        }
        setBrands(allBrands);

        setSiblingCategories(subcategories);

        setPageProducts(response);
      } catch (error) {
        const response = error as ErrorResponse;
        if (response.status === 404) {
          toast({
            title: t("products.no_results"),
            description: t("products.no_results_description", {
              defaultValue: "No products found for this criteria.",
            }),
          });
        } else {
          console.error("Error fetching products:", response);
          toast({
            title: t("products.error"),
            description: t("products.error_description"),
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
        setApplyFilters(false);
      }
    };
    fetchProducts();
  }, [applyFilters, categoryId, brandId, keyword]);

  const totalPages = pageProducts?.totalPages || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePriceChange = (value: number[]) => {
    if (!value[0]) {
      value[0] = 0;
    }
    setPriceRange([value[0], value[1]]);
  };

  const handleGenderChange = (gender: Gender | null) => {
    setSelectedGender(gender);
  };

  const clearFilters = () => {
    setPriceRange([null, null]);
    setSelectedColor(null);
    setSelectedBrand(null);
    setSelectedGender(preSelectedGender || null);
  };

  if (isLoading) {
    // Show Ant Design's Spin component while loading
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin
          size="large"
          tip={t("profile.loading", { defaultValue: "Loading..." })}
        />
      </div>
    );
  }
  return (
    <>
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Category header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="max-w-screen-2xl mx-auto px-4 py-8 md:px-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white capitalize">
              {currentCategory?.name ||
                brands.find((brand) => brand.brandId === selectedBrand)?.name ||
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

        <div className="max-w-screen-2xl mx-auto px-4 py-6 md:px-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar */}
            <div className="md:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t("products.filter")}
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {t("products.clear")}
                  </button>
                </div>

                {/* Gender filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Gender
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        selectedGender === "FEMALE" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleGenderChange(
                          selectedGender === "FEMALE" ? null : "FEMALE"
                        )
                      }
                    >
                      Women
                    </Button>
                    <Button
                      variant={
                        selectedGender === "MALE" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleGenderChange(
                          selectedGender === "MALE" ? null : "MALE"
                        )
                      }
                    >
                      Men
                    </Button>
                  </div>
                </div>

                {/* Price range filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t("products.price")}
                  </h3>
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    min={0}
                    max={2000}
                    step={25}
                    onValueChange={handlePriceChange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Brand filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t("products.brand")}
                  </h3>
                  <div className="relative">
                    <select
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
                      value={selectedBrand || ""}
                      onChange={(e) => setSelectedBrand(e.target.value || null)}
                    >
                      <option value="">{t("products.allBrands")}</option>
                      {brands.map((brand) => (
                        <option key={brand.brandId} value={brand.brandId}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Color filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t("products.color")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          selectedColor === color.id
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 dark:border-gray-600"
                        }`}
                        style={{
                          backgroundColor: color.hex,
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <span className="text-white text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setApplyFilters(true)}
                >
                  {t("products.apply")}
                </Button>
              </div>
            </div>

            {/* Product listing */}
            <div className="flex-grow">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {pageProducts?.totalItems} {t("products.items")}
                </p>

                <div className="hidden flex items-center gap-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    {t("products.sort")}
                  </label>
                  <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm">
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              {pageProducts?.products && pageProducts?.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {pageProducts?.products.map((product) => (
                    <>
                      <div key={product.productId} className="w-full">
                        <ProductCard product={product} />
                      </div>
                      {totalPages > 1 && (
                        <Pagination className="mt-8">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() =>
                                  setPage((prev) => Math.max(prev - 1, 1))
                                }
                                className={
                                  page === 1
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }
                              />
                            </PaginationItem>

                            {pageNumbers.map((number) => (
                              <PaginationItem key={number}>
                                <PaginationLink
                                  onClick={() => setPage(number)}
                                  isActive={page === number}
                                >
                                  {number}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext
                                onClick={() =>
                                  setPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                  )
                                }
                                className={
                                  page === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                  <p className="text-gray-700 dark:text-gray-300">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CategoryPage;
