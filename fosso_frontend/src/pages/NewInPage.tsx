import React, { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { ProductBriefDTO, ProductFilterCriteria } from "../types/product";
import { getAllProducts } from "../api/Product";
import type { PaginatedResponse } from "../types/paginatedResponse";
import { useToast } from "../hooks/useToast";
import { Spin } from "antd";
import type { ErrorResponse } from "../types/error";
import ProductPagination from "../components/product/ProductsPagination";

const NewInPage: React.FC = () => {
  const { t } = useLanguage();
  const [page, setPage] = useState<number>(1);
  const [paginatedProduct, setPaginatedProduct] =
    useState<PaginatedResponse<ProductBriefDTO> | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(
          { isNewIn: true } as ProductFilterCriteria,
          page,
          8
        );

        setPaginatedProduct(data);
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        if (errorResponse.status === 404) {
          console.error("Error fetching products:", errorResponse);
          toast({
            title: t("products.noProductsTitle"),
            description: t("products.noProductsMessage"),
          });
        } else {
          toast({
            title: t("error.fetchProduct"),
            description: t("error.tryAgain"),
            variant: "destructive",
          });
          console.error("Error fetching categories:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

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
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            {t("newIn.title", { defaultValue: "New In" })}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {t("newIn.subtitle", {
              defaultValue: "Latest arrivals from the past week",
            })}
          </p>
          {paginatedProduct && paginatedProduct.products.length > 0 ? (
            <ProductPagination
              paginatedProduct={paginatedProduct}
              page={page}
              setPage={setPage}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                {t("newIn.noProducts", {
                  defaultValue: "No new arrivals found.",
                })}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default NewInPage;
