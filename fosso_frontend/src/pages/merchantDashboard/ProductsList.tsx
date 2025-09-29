import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import type { PaginatedResponse } from "../../types/paginatedResponse";
import type { ProductMerchantDTO } from "../../types/product";
import {
  updateProduct,
  updateProductEnabledStatus,
} from "../../api/merchant/MerchantProduct";
import ProductRow from "./ProductRow";
import { useToast } from "../../components/ui/use-toast";

const ProductsList: React.FC<{
  paginatedProducts: PaginatedResponse<ProductMerchantDTO>;
  setPaginatedProducts: React.Dispatch<
    React.SetStateAction<PaginatedResponse<ProductMerchantDTO> | undefined>
  >;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}> = ({ paginatedProducts, setPaginatedProducts, page, setPage }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleUpdateStock = async (
    id: string,
    variantIndex: number,
    change: number
  ) => {
    try {
      // Find the product before updating it
      const productToUpdate = paginatedProducts.products.find(
        (product) => product.productId === id
      );

      if (!productToUpdate) return;

      // Create a deep copy of the product to update
      const updatedProduct = JSON.parse(JSON.stringify(productToUpdate));

      // Calculate the new stock value
      const variant = updatedProduct.productVariants[variantIndex];
      if (!variant) return;

      const newStock = Math.max(0, variant.stockQuantity + change);
      updatedProduct.productVariants[variantIndex].stockQuantity = newStock;

      // Update UI state with new value
      setPaginatedProducts((prevProducts) =>
        prevProducts
          ? {
              ...prevProducts,
              products: prevProducts.products.map((product) =>
                product.productId === id ? updatedProduct : product
              ),
            }
          : prevProducts
      );

      // Send the updated product to the backend
      const response = await updateProduct(
        updatedProduct.productId,
        updatedProduct
      );

      console.log(response);
      toast({
        title: t("merchant.stockUpdated", { defaultValue: "Stock Updated" }),
        description: t("merchant.stockUpdatedDesc", {
          defaultValue: `Stock updated successfully.`,
        }),
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: t("error.updateFailed", { defaultValue: "Update Failed" }),
        description: t("error.tryAgain", {
          defaultValue: "Failed to update stock. Please try again later.",
        }),
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      // Find the product and toggle its status locally
      setPaginatedProducts((prevProducts) =>
        prevProducts
          ? {
              ...prevProducts,
              products: prevProducts.products.map((product) =>
                product.productId === id
                  ? { ...product, enabled: !product.enabled }
                  : product
              ),
            }
          : prevProducts
      );

      const productToUpdate = paginatedProducts.products.find(
        (product) => product.productId === id
      );
      if (productToUpdate) {
        const response = await updateProductEnabledStatus(
          id,
          !productToUpdate.enabled
        );
        console.log(response);
        toast({
          title: productToUpdate.enabled
            ? t("merchant.productDisabled", {
                defaultValue: "Product Disabled",
              })
            : t("merchant.productEnabled", { defaultValue: "Product Enabled" }),
          description: `${productToUpdate.productName} ${
            productToUpdate.enabled
              ? t("merchant.isNowDisabled", {
                  defaultValue: "is now disabled.",
                })
              : t("merchant.isNowEnabled", { defaultValue: "is now enabled." })
          }`,
        });
      }
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast({
        title: t("error.updateFailed", { defaultValue: "Update Failed" }),
        description: t("error.tryAgain", {
          defaultValue:
            "Failed to update product status. Please try again later.",
        }),
        variant: "destructive",
      });
    }
  };

  const totalPages = paginatedProducts?.totalPages || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">{t("merchant.myProducts")}</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableCaption>{t("merchant.productsListCaption")}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40"></TableHead>
              <TableHead>{t("merchant.productName")}</TableHead>
              <TableHead>{t("merchant.category")}</TableHead>
              <TableHead>{t("merchant.price")}</TableHead>
              <TableHead>{t("merchant.stock")}</TableHead>
              <TableHead>{t("merchant.status")}</TableHead>
              <TableHead>{t("merchant.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.products &&
              paginatedProducts.products.map((product) => (
                <>
                  <ProductRow
                    product={product}
                    handleUpdateStock={handleUpdateStock}
                    handleToggleStatus={handleToggleStatus}
                  />
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setPage((prev) => Math.max(prev - 1, 1))
                            }
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
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsList;
