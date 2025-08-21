import React, { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { ProductBriefDTO, ProductFilterCriteria } from "../types/product";
import { getAllProducts } from "../api/Product";
import ProductCard from "../components/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import type { PaginatedResponse } from "../types/paginatedResponse";
import { useToast } from "../hooks/useToast";
import { Spin } from "antd";

const NewInPage: React.FC = () => {
  const { t } = useLanguage();
  const [page, setPage] = useState<number>(1);
  const [paginatedProduct, setPaginatedProduct] =
    useState<PaginatedResponse<ProductBriefDTO>>();
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
        toast({
          title: t("error.fetchProduct"),
          description: t("error.tryAgain"),
          variant: "destructive",
        });
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const totalPages = paginatedProduct?.totalPages || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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

          {paginatedProduct?.products &&
          paginatedProduct?.products?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedProduct.products.map((product) => (
                  <div key={product.productId}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className={
                          page === 1 ? "pointer-events-none opacity-50" : ""
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
                          setPage((prev) => Math.min(prev + 1, totalPages))
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
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                {t("newIn.noProducts", {
                  defaultValue:
                    "No new products have been added in the past week.",
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
