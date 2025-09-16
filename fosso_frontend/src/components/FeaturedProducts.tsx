import React, { useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";
import ProductCard from "./ProductCard";
import { useGetAllProductsQuery } from "../api/ProductApiSlice";
import { useToast } from "../hooks/useToast";
import type { ErrorResponse } from "../types/error";
import type { Gender } from "../types/enums";
export interface FeaturedProductsProps {
  gender?: Gender;
  hideTitle?: boolean;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  actionUrl?: string;
  isNewIn?: boolean;
  isPopular?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  isNewIn,
  gender,
  isPopular,
  hideTitle = false,
  title,
  subtitle,
  actionLabel,
  actionUrl,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const queryParams: Record<string, unknown> = {};
  if (isNewIn) queryParams.isNewIn = true;
  if (gender) queryParams.gender = gender;

  const {
    data: products,
    isError,
    error,
  } = useGetAllProductsQuery({
    filterCriteria: queryParams,
    page: 1,
    size: 4,
    sort: isPopular ? "rating,desc" : undefined,
  });

  useEffect(() => {
    if (isError) {
      const errorResponse = error.data as ErrorResponse;

      if (errorResponse.status === 404) {
        console.error("Error fetching products:", errorResponse);
        toast({
          title: t("products.noProductsTitle"),
          description: t("products.noProductsMessage"),
        });
      } else {
        console.error("Error fetching products:", errorResponse);
        toast({
          title: t("new.error"),
          description: t("new.errorFetchingProducts"),
          variant: "destructive",
        });
      }
    }
  }, [isError, error, toast, t]);

  return (
    <div className="w-full py-8 md:py-12">
      <div className="container px-4 md:px-6 mx-auto">
        {!hideTitle && (
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
              {title || t("featuredProducts")}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">
              {subtitle || t("featuredProductsDesc")}
            </p>

            {actionLabel && actionUrl && (
              <a
                href={actionUrl}
                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                {actionLabel}
                <span className="ml-1">→</span>
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
          {products && products.products.length > 0 ? (
            products.products.map((product, index) => (
              <div key={index} className="w-full">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {isNewIn
                ? t("products.noNewInProducts", {
                    defaultValue: "No new arrivals found.",
                  })
                : t("products.noPopularProducts", {
                    defaultValue: "No trending products found.",
                  })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
