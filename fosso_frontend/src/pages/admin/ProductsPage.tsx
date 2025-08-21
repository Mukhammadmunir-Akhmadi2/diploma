import React, { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Search,
  Edit,
  CheckCircle,
  Calendar,
  Package,
  Trash2,
  RotateCw,
  ShieldBan,
} from "lucide-react";
import {
  getAllProducts,
  updateProductEnabledStatus,
  deleteProduct,
  restoreProduct,
} from "../../api/admin/AdminProduct";
import type { AdminProductBriefDTO } from "../../types/admin/adminProduct";
import type { PaginatedResponse } from "../../types/paginatedResponse";
import { getImageById } from "../../api/Image";
import { getCategoryById } from "../../api/Category";
import { getBrandById } from "../../api/Brand";
import { getUserById } from "../../api/User";
import { Spin } from "antd";
import { useDebounce } from "../../hooks/useDebounce";

const ProductsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [pageProducts, setPageProducts] =
    useState<PaginatedResponse<AdminProductBriefDTO>>();
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const itemsPerPage = 10;

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  useEffect(() => {
    setIsLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(searchQuery, page, itemsPerPage);

        const productsWithDetails = await Promise.all(
          response.products.map(async (product) => {
            const [brand, category, merchant, image] = await Promise.all([
              product.brandId ? getBrandById(product.brandId) : undefined,
              product.categoryId
                ? getCategoryById(product.categoryId)
                : undefined,
              product.merchantId ? getUserById(product.merchantId) : undefined,
              product.mainImagesId[0]
                ? getImageById(product.mainImagesId[0], "PRODUCT_IMAGE_MAIN")
                : undefined,
            ]);

            return {
              ...product,
              image,
              brand,
              category,
              merchant,
            };
          })
        );

        setPageProducts({
          ...response,
          products: productsWithDetails,
        });
      } catch (error: any) {
        console.error("Error fetching products:", error);
        toast({
          title: t("admin.errorFetchingProducts"),
          description: error.message || t("admin.tryAgainLater"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchQuery, page]);

  const totalPages = pageProducts?.totalPages || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleEnableProduct = async (productId: string, status: boolean) => {
    const newStatus = !status;
    try {
      await updateProductEnabledStatus(productId, newStatus);
      setPageProducts((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.map((product) =>
            product.productId === productId
              ? { ...product, enabled: newStatus }
              : product
          ),
        };
      });
      toast({
        title: t("admin.productEnabled"),
        description: t("admin.productEnabledDesc"),
      });
    } catch (error: any) {
      console.error("Error enabling product:", error);
      toast({
        title: t("admin.errorEnablingProduct"),
        description: error.message || t("admin.tryAgainLater"),
        variant: "destructive",
      });
    }
  };

  const handleRestoreProduct = async (productId: string) => {
    try {
      await restoreProduct(productId);
      setPageProducts((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.map((product) =>
            product.productId === productId
              ? { ...product, deleted: false }
              : product
          ),
        };
      });
      toast({
        title: t("admin.productRestored"),
        description: t("admin.productRestoredDesc"),
      });
    } catch (error: any) {
      console.error("Error restoring product:", error);
      toast({
        title: t("admin.errorRestoringProduct"),
        description: error.message || t("admin.tryAgainLater"),
        variant: "destructive",
      });
    }
  };

  const handleHardDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setPageProducts((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.filter(
            (product) => product.productId !== productId
          ),
        };
      });
      toast({
        title: t("admin.productDeleted"),
        description: t("admin.productDeletedDesc"),
      });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: t("admin.errorDeletingProduct"),
        description: error.message || t("admin.tryAgainLater"),
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
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
      <div className="w-full md:w-3/4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("admin.products")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.searchDisabledProducts")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                  disabled={isLoading}
                />
              </div>
            </div>

            {pageProducts?.products && pageProducts?.products.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("product.product")}</TableHead>
                        <TableHead>{t("product.brand")}</TableHead>
                        <TableHead>{t("product.category")}</TableHead>
                        <TableHead>{t("product.price")}</TableHead>
                        <TableHead>{t("product.merchant")}</TableHead>
                        <TableHead>{t("product.createdDate")}</TableHead>
                        <TableHead>{t("admin.productStatus")}</TableHead>
                        <TableHead>{t("admin.isDeleted")}</TableHead>
                        <TableHead>{t("common.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageProducts?.products.map((product) => (
                        <TableRow key={product.productId}>
                          <TableCell className="flex items-center gap-3">
                            <div className="w-18 h-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                              {product.image ? (
                                <img
                                  src={`data:${product.image.contentType};base64,${product.image.base64Data}`}
                                  alt={product.productName}
                                  className="w-14 h-14 rounded object-cover"
                                />
                              ) : (
                                <Package size={16} />
                              )}
                            </div>
                            <span className="font-medium">
                              {product.productName}
                            </span>
                          </TableCell>
                          <TableCell>{product.brand?.name}</TableCell>
                          <TableCell>{product.category?.name}</TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>{`${product.merchant?.firstName} ${product.merchant?.lastName}`}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar
                                size={14}
                                className="mr-1 text-muted-foreground"
                              />
                              {formatDate(product.createdDateTime)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleEnableProduct(
                                  product.productId,
                                  product.enabled
                                )
                              }
                              className={
                                product.enabled
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {product.enabled ? (
                                <CheckCircle size={16} className="mr-1" />
                              ) : (
                                <ShieldBan size={16} className="mr-1" />
                              )}
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  product.enabled
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                {product.enabled
                                  ? t("common.enabled")
                                  : t("common.disabled")}
                              </span>
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleRestoreProduct(product.productId)
                                }
                                className="text-green-500"
                                disabled={!product.deleted}
                              >
                                <RotateCw size={16} className="mr-1" />
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    product.deleted
                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  }`}
                                >
                                  {product.deleted
                                    ? t("admin.deleted")
                                    : t("admin.notDeleted")}
                                </span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleHardDeleteProduct(product.productId)
                                }
                                className="text-red-500"
                              >
                                <Trash2 size={16} className="mr-1" />
                                {t("admin.hardDelete")}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleEditProduct(product.productId)
                                }
                              >
                                <Edit size={16} className="mr-1" />
                                {t("common.edit")}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
              <div className="text-center py-12">
                <Package
                  size={64}
                  className="mx-auto text-muted-foreground mb-4"
                />
                <h3 className="text-lg font-medium mb-2">
                  {t("admin.noDisabledProducts")}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? t("admin.noProductsMatchSearch")
                    : t("admin.noDisabledProductsDesc")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductsPage;
