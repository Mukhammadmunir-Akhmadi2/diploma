import React, { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import {
  Card,
  CardContent,
  CardDescription,
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
  Search,
  Edit,
  Plus,
  Image,
  CheckCircle,
  ShieldBan,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import EditBrandModal from "./EditBrandModal";
import {
  updateBrandEnabledStatus,
  listBrandsByPage,
} from "../../api/admin/AdminBrand";
import type { BrandDTO } from "../../types/brand";
import { useToast } from "../../hooks/useToast";
import type { PaginatedResponse } from "../../types/paginatedResponse";
import { Spin } from "antd";
import AddBrandDialog from "../../components/AddBrandDialog";
import { useDebounce } from "../../hooks/useDebounce";
import EntityImage from "../../components/EntityImage";

const BrandsManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [pageBrands, setPageBrands] = useState<PaginatedResponse<BrandDTO>>();
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<BrandDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        const response = await listBrandsByPage(
          searchQuery,
          page,
          itemsPerPage
        );

        setPageBrands(response);
      } catch (error: any) {
        console.error("Error fetching brands:", error);
        toast({
          title: t("admin.errorFetchingBrands"),
          description: error.message || t("admin.tryAgainLater"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [page, debouncedSearchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleEditBrand = (brand: any) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
  };

  const handleCreateBrand = (newBrand: BrandDTO) => {
    setPageBrands((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        products: [newBrand, ...prev.products],
      };
    });

    toast({
      title: t("admin.brandAdded"),
      description: t("admin.brandAddedDesc"),
    });
  };

  const handleStatusChange = async (brandId: string, status: boolean) => {
    try {
      const newStatus = !status;
      await updateBrandEnabledStatus(brandId, newStatus);
      toast({
        title: t("admin.statusUpdated"),
        description: t(
          newStatus ? "admin.brandEnabled" : "admin.brandDisabled"
        ),
      });

      setPageBrands((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.map((b) =>
            b.brandId === brandId ? { ...b, enabled: newStatus } : b
          ),
        };
      });
    } catch (error: any) {
      console.error("Error updating brand status:", error);
      toast({
        title: t("admin.errorUpdatingStatus"),
        description: error.message || t("admin.tryAgainLater"),
        variant: "destructive",
      });
    }
  };

  const totalPages = pageBrands?.totalPages || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (isLoading) {
    // Show Ant Design's Spin component while loading
    return (
      <div className="flex items-center justify-center h-full w-full">
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {t("admin.brands")}
              </CardTitle>
              <CardDescription>
                {t("admin.manageBrandsDetails", {
                  defaultValue: "Manage brands and their details.",
                })}
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={18} className="mr-1" />
              {t("admin.addBrand")}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.searchBrands")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                  disabled={isLoading}
                />
              </div>
            </div>

            {pageBrands?.products && pageBrands?.products?.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead>{t("product.brand")}</TableHead>
                        <TableHead>{t("admin.brandDescription")}</TableHead>
                        <TableHead>{t("admin.brandStatus")}</TableHead>
                        <TableHead className="w-[100px]">
                          {t("common.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageBrands.products.map((brand: BrandDTO) => (
                        <TableRow key={brand.brandId}>
                          <TableCell className="w-[80px]">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                              {brand.logoImageId ? (
                                <EntityImage
                                  imageId={brand.logoImageId}
                                  imageType="BRAND_IMAGE"
                                  name={brand.name}
                                  className="w-10 h-10 object-contain"
                                />
                              ) : (
                                <Image
                                  size={20}
                                  className="text-muted-foreground"
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {brand.name}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {brand.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {/* Toggle Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(
                                    brand.brandId,
                                    brand.enabled
                                  )
                                }
                                className={
                                  brand.enabled
                                    ? "ml-2 text-green-500"
                                    : "ml-2 text-red-500"
                                }
                              >
                                {brand.enabled ? (
                                  <CheckCircle size={16} className="mr-1" />
                                ) : (
                                  <ShieldBan size={16} className="mr-1" />
                                )}
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    brand.enabled
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  }`}
                                >
                                  {brand.enabled
                                    ? t("common.enabled")
                                    : t("common.disabled")}
                                </span>
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBrand(brand)}
                            >
                              <Edit size={16} className="mr-1" />
                              {t("common.edit")}
                            </Button>
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
                <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {t("admin.noBrands")}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No brands match your search criteria."
                    : "No brands found in the system."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Brand Dialog */}
      <AddBrandDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateBrand}
      />
      {/* Edit Brand Modal */}
      {isModalOpen && selectedBrand && (
        <EditBrandModal
          brand={selectedBrand}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={(updatedBrand) => {
            setPageBrands((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                products: prev.products.map((brand) =>
                  brand.brandId === updatedBrand.brandId ? updatedBrand : brand
                ),
              };
            });

            toast({
              title: t("admin.brandUpdated"),
              description: t("admin.brandUpdatedDesc"),
            });
            closeModal();
          }}
        />
      )}
    </>
  );
};

export default BrandsManagement;
