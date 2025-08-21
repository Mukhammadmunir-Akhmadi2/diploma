import React, { useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";
import ProductCard from "./ProductCard";
import { getAllProducts } from "../api/Product";
import type { PaginatedResponse } from "../types/paginatedResponse";
import type { ProductBriefDTO } from "../types/product";
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
  const [products, setProducts] =
    React.useState<PaginatedResponse<ProductBriefDTO>>();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response: PaginatedResponse<ProductBriefDTO> = {
          products: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
        };

        if (isNewIn) {
          response = await getAllProducts({ isNewIn: true, gender }, 1, 4);
        } else if (isPopular) {
          response = await getAllProducts({ gender }, 1, 4, "rating,desc");
        }

        setProducts(response);
      } catch (error) {
        const errorResponse = error as ErrorResponse;
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
    };

    fetchProducts();
  }, [gender]);
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
