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
import { Search, Edit, Plus, CheckCircle, ShieldBan } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import EditCategoryModal from "../../components/admin/EditCategoryModal";
import {
  listCategoriesByPage,
  updateCategoryEnabledStatus,
} from "../../api/admin/AdminCategory";
import type { Category } from "../../types/category";
import { useToast } from "../../hooks/useToast";
import { Spin } from "antd";
import type { PaginatedResponse } from "../../types/paginatedResponse";
import AddCategoryDialog from "../../components/AddCategoryDialog";
import { useDebounce } from "../../hooks/useDebounce";

const CategoriesManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [pageCategories, setPageCategories] =
    useState<PaginatedResponse<Category>>();
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await listCategoriesByPage(
          searchQuery,
          page,
          itemsPerPage
        );
        setPageCategories(response);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast({
          title: t("admin.errorFetchingCategories"),
          description: error.message || t("admin.tryAgainLater"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [debouncedSearchQuery, page, isEdit]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCreateCategory = (newCategory: Category) => {
    setPageCategories((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        products: [newCategory, ...prev.products],
      };
    });

    toast({
      title: t("admin.categoryAdded"),
      description: t("admin.categoryAddedDesc"),
    });
  };

  const toggleCategoryStatus = async (
    categoryId: string,
    currentStatus: boolean
  ) => {
    try {
      const newStatus = !currentStatus;
      await updateCategoryEnabledStatus(categoryId, newStatus);

      setPageCategories((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.map((category) =>
            category.categoryId === categoryId
              ? { ...category, enabled: newStatus }
              : category
          ),
        };
      });

      toast({
        title: t("admin.statusUpdated"),
        description: newStatus
          ? t("admin.categoryEnabled")
          : t("admin.categoryDisabled"),
      });
    } catch (error: any) {
      console.error("Error updating category status:", error);
      toast({
        title: t("admin.errorUpdatingStatus"),
        description: error.message || t("admin.tryAgainLater"),
        variant: "destructive",
      });
    }
  };

  const getParentCategoryName = (parentId: string | null) => {
    if (!parentId) return "-";
    const parentCategory = pageCategories?.products.find(
      (category) => category.categoryId === parentId
    );
    return parentCategory ? parentCategory.name : "-";
  };

  const getSubCategoriesText = (subCategoryIds: string[]) => {
    if (!subCategoryIds.length) return "-";

    const subCategoryNames = subCategoryIds
      .map((id) => {
        const subCategory = pageCategories?.products.find(
          (category) => category.categoryId === id
        );
        return subCategory ? subCategory.name : "";
      })
      .filter(Boolean);

    return subCategoryNames.join(", ");
  };

  const totalPages = pageCategories?.totalPages || 0;
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
                {t("admin.categories")}
              </CardTitle>
              <CardDescription>
                {t("admin.manageCategoriesDetails")}
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={18} className="mr-1" />
              {t("admin.addCategory")}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.searchCategories")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                  disabled={isLoading}
                />
              </div>
            </div>

            {pageCategories?.products && pageCategories?.products.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("product.category")}</TableHead>
                        <TableHead>{t("admin.parentCategory")}</TableHead>
                        <TableHead>{t("admin.subCategories")}</TableHead>
                        <TableHead>{t("admin.categoryStatus")}</TableHead>
                        <TableHead className="w-[100px]">
                          {t("common.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageCategories.products.map((category) => (
                        <TableRow key={category.categoryId}>
                          <TableCell className="font-medium">
                            {category.name}
                          </TableCell>
                          <TableCell>
                            {getParentCategoryName(category.parentId || "-")}
                          </TableCell>
                          <TableCell>
                            {getSubCategoriesText(
                              category.subCategoriesId || []
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className={
                                category.enabled
                                  ? "ml-2 text-green-500"
                                  : "ml-2 text-red-500"
                              }
                              onClick={() =>
                                toggleCategoryStatus(
                                  category.categoryId,
                                  category.enabled
                                )
                              }
                            >
                              {category.enabled ? (
                                <CheckCircle size={16} className="mr-1" />
                              ) : (
                                <ShieldBan size={16} className="mr-1" />
                              )}
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  category.enabled
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                {category.enabled
                                  ? t("common.enabled")
                                  : t("common.disabled")}
                              </span>
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit size={16} className="mr-1" />
                              {t("common.edit")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                </div>
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
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {t("admin.noCategories")}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No categories match your search criteria."
                    : "No categories found in the system."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Category Dialog */}
      <AddCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateCategory}
      />

      {/* Edit Category Modal */}
      {isModalOpen && selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          categories={pageCategories?.products}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={(updatedCategory) => {
            // Handle saving updated category logic here
            console.log("Updated category:", updatedCategory);
            setIsEdit(!isEdit);
            toast({
              title: t("admin.categoryUpdated"),
              description: t("admin.categoryUpdatedDesc"),
            });
            closeModal();
          }}
        />
      )}
    </>
  );
};

export default CategoriesManagement;
