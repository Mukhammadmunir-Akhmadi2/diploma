import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { useGetAllProductsQuery } from "../../api/ProductApiSlice";
import type { Gender } from "../../types/enums";
import { useToast } from "../../hooks/useToast";
import type { BrandDTO } from "../../types/brand";
import { listAllBrands } from "../../api/Brand";
import { Spin } from "antd";
import type { ErrorResponse } from "../../types/error";
import ProductPagination from "../../components/ProductsPagination";
import type { FilterOptions } from "../../types/filter";
import FiltersSidebar from "../../components/FiltersSidebar";
import CategoryHeader from "../../components/CategoryHeader";

interface ProductFilterPageProps {
  gender?: Gender | null;
  isPopular?: boolean;
}

const ProductFilterPage: React.FC<ProductFilterPageProps> = ({
  gender: preSelectedGender,
  isPopular,
}) => {
  const { t } = useLanguage();
  const { categoryId, brandId, keyword } = useParams();

  const [pendingFilters, setPendingFilters] = useState<FilterOptions>({
    priceRange: [undefined, undefined],
    selectedColor: null,
    selectedBrand: brandId || null,
    selectedGender: preSelectedGender || null,
  });

  const [appliedFilters, setAppliedFilters] =
    useState<FilterOptions>(pendingFilters);

  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [page, setPage] = useState<number>(1);
  const { toast } = useToast();

  const {
    currentData = {
      products: [],
      totalItems: 0,
      currentPage: 1,
      totalPages: 0,
    },
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllProductsQuery({
    filterCriteria: {
      categoryId: categoryId || undefined,
      brandId: brandId || appliedFilters.selectedBrand || undefined,
      gender: appliedFilters.selectedGender || undefined,
      keyword: keyword || undefined,
      color: appliedFilters.selectedColor || undefined,
      minPrice: appliedFilters.priceRange[0],
      maxPrice: appliedFilters.priceRange[1],
    },
    page,
    size: 4,
    sort: isPopular ? "rating,desc" : undefined,
  });

  const pageProducts = currentData;

  useEffect(() => {
    if (isError && error) {
      const errorResponse = error.data as ErrorResponse;

      if (error.status === 404) {
        toast({
          title: t("products.no_results"),
          description: t("products.no_results_description", {
            defaultValue: "No products found for this criteria.",
          }),
        });
      } else {
        console.error("Error fetching products:", errorResponse);
        toast({
          title: t("products.error"),
          description: t("products.error_description"),
          variant: "destructive",
        });
      }
    }
  }, [isError, error]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const allBrands = await listAllBrands();
        setBrands(allBrands);

        if (brandId) {
          const selectedBrand = allBrands.find(
            (brand) => brand.brandId === brandId
          );
          setPendingFilters((prev) => ({
            ...prev,
            selectedBrand: selectedBrand?.brandId || null,
          }));
        }
        setPage(1);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };
    fetchBrands();
  }, [brandId]);

  if (isLoading || isFetching) {
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
        <CategoryHeader
          categoryId={categoryId}
          keyword={keyword}
          selectedBrand={
            brands.find(
              (brand) => brand.brandId === pendingFilters.selectedBrand
            )?.name || null
          }
        />

        <div className="max-w-screen-2xl mx-auto px-4 py-6 md:px-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar */}
            <FiltersSidebar
              brands={brands}
              pendingFilters={pendingFilters}
              setPendingFilters={setPendingFilters}
              setAppliedFilters={setAppliedFilters}
              setPage={setPage}
            />
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
                <ProductPagination
                  paginatedProduct={pageProducts}
                  page={page}
                  setPage={setPage}
                />
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

export default ProductFilterPage;
