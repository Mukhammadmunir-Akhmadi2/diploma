import React, { useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";
import ProductCard from "./ProductCard";
import { useGetAllProductsQuery } from "../api/ProductApiSlice";
import { useToast } from "../hooks/useToast";
import type { ErrorResponse } from "../types/error";
import type { Gender } from "../types/enums";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
export interface FeaturedProductsProps {
  gender?: Gender;
  hideTitle?: boolean;
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
  actionLabel,
  actionUrl,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const queryParams: Record<string, unknown> = {};
  if (isNewIn) queryParams.isNewIn = true;
  if (gender) queryParams.gender = gender;

  const {
    data: products = {
      products: [],
      totalItems: 0,
      currentPage: 1,
      totalPages: 0,
    },
    isError,
    error,
  } = useGetAllProductsQuery({
    filterCriteria: queryParams,
    page: 1,
    size: 8,
    sort: isPopular ? "rating,desc" : undefined,
  });

  useEffect(() => {
    if (isError) {
      const errorResponse = error.data as ErrorResponse;

      if (error.status === 404) {
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
  }, [isError, error]);

  return (
    <div className="w-full py-8 md:py-12">
      <div className="container px-4 md:px-6 mx-auto">
        {!hideTitle && (
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
              {isNewIn ? t("main.newArrivals") : t("main.trendingNow")}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">
              {isNewIn ? t("main.newArrivalsDesc") : t("main.trendingNowDesc")}
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

        {products && products.products.length > 0 ? (
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full h-auto"
          >
            <CarouselContent>
              {products.products.map((product) => (
                <CarouselItem
                  key={product.productId}
                  className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 left-3 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute top-1/2 right-3 -translate-y-1/2 z-10" />
          </Carousel>
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
  );
};

export default FeaturedProducts;
