import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
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
import { Search, User, Edit } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import AdminSidebar from "../../components/admin/AdminSidebar";
import type { AdminUserBriefDTO } from "../../types/admin/adminUser";
import { getAllUsersByPage, searchUsers } from "../../api/admin/AdminUser";
import type { PaginatedResponse } from "../../types/paginatedResponse";
import { Spin } from "antd";
import { useToast } from "../../hooks/use-toast";
import { useDebounce } from "../../hooks/useDebounce";

const UsersManagement = () => {
  const { t } = useLanguage();
  const [paginatedUsers, setPaginatedUsers] =
    useState<PaginatedResponse<AdminUserBriefDTO>>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { toast } = useToast();

  const navigate = useNavigate();

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  
  useEffect(() => {
    setIsLoading(true);
    const fetchUsers = async () => {
      try {
        if (searchQuery.trim() === "") {
          // Fetch all users when no search query is provided
          const users = await getAllUsersByPage(page, 10);
          setPaginatedUsers(users);
        } else {
          // Search users when a search query is provided
          const users = await searchUsers(searchQuery, page, 10);
          setPaginatedUsers(users);
        }
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast({
          title: t("admin.errorFetchingUsers"),
          description: error.message || t("admin.somethingWentWrong"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearchQuery, page]);

  const totalPages = paginatedUsers?.totalPages || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/admin/users/${userId}`);
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
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Admin Sidebar */}
          <AdminSidebar />

          {/* Main Content */}
          <div className="w-full md:w-3/4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {t("admin.usersManagement")}
                </CardTitle>
                <CardDescription>
                  View and manage user accounts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("admin.searchUsers")}
                      className="pl-8"
                      value={searchQuery}
                      onChange={handleSearch}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {paginatedUsers && paginatedUsers?.products?.length > 0 ? (
                  <>
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("profile.personalInfo")}</TableHead>
                            <TableHead>{t("admin.userRole")}</TableHead>
                            <TableHead>{t("admin.accountCreated")}</TableHead>
                            <TableHead>{t("admin.orderCount")}</TableHead>
                            <TableHead>{t("admin.totalSpent")}</TableHead>
                            <TableHead>{t("admin.isBanned")}</TableHead>{" "}
                            <TableHead>{t("admin.isDeleted")}</TableHead>
                            <TableHead>{t("common.actions")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedUsers?.products.map((user) => (
                            <TableRow
                              key={user.userId}
                              onClick={() => handleUserClick(user.userId)}
                              className="cursor-pointer hover:bg-muted/50"
                            >
                              <TableCell className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                  {user.image ? (
                                    <img
                                      src={`data:${user.image.contentType};base64,${user.image.base64Data}`}
                                      alt={user.firstName}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <User size={16} />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    user.roles.includes("ADMIN")
                                      ? "bg-purple-100 text-purple-800"
                                      : user.roles.includes("MERCHANT")
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {user.roles.includes("ADMIN")
                                    ? t("admin.admin").toUpperCase()
                                    : user.roles.includes("MERCHANT")
                                    ? t("admin.merchant").toUpperCase()
                                    : t("admin.user").toUpperCase()}
                                </span>
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  user.createdDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{user.orderCount}</TableCell>
                              <TableCell>
                                ${user.totalSpent.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    user.enabled
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {user.enabled
                                    ? t("admin.active")
                                    : t("admin.banned")}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    user.deleted
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {user.deleted
                                    ? t("admin.deleted")
                                    : t("admin.notDeleted")}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUserClick(user.userId);
                                    }}
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

                    <div className="md:hidden">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {paginatedUsers.products.map((user) => (
                            <CarouselItem
                              key={user.userId}
                              className="md:basis-1/2 lg:basis-1/3"
                            >
                              <Card className="h-full">
                                <CardContent className="p-4 flex flex-col h-full">
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                      {user.image ? (
                                        <img
                                          src={`data:${user.image.contentType};base64,${user.image.base64Data}`}
                                          alt={user.firstName}
                                          className="w-10 h-10 rounded-full object-cover"
                                        />
                                      ) : (
                                        <User size={20} />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {user.firstName} {user.lastName}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2 flex-1">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        {t("admin.userRole")}:
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          user.roles.includes("ADMIN")
                                            ? "bg-purple-100 text-purple-800"
                                            : user.roles.includes("MERCHANT")
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {user.roles}
                                      </span>
                                    </div>

                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        {t("admin.accountCreated")}:
                                      </span>
                                      <span className="text-sm">
                                        {new Date(
                                          user.createdDate
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>

                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        {t("admin.orderCount")}:
                                      </span>
                                      <span className="text-sm">
                                        {user.orderCount}
                                      </span>
                                    </div>

                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        {t("admin.totalSpent")}:
                                      </span>
                                      <span className="text-sm">
                                        ${user.totalSpent.toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        {t("admin.isBanned")}:
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          user.enabled
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {user.enabled
                                          ? t("admin.active")
                                          : t("admin.banned")}
                                      </span>
                                    </div>

                                    {/* New: Is User Deleted */}
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        {t("admin.isDeleted")}:
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          user.isDeleted
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {user.isDeleted
                                          ? t("admin.deleted")
                                          : t("admin.notDeleted")}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mt-4 pt-4 border-t border-border">
                                    <Button
                                      className="w-full"
                                      onClick={() =>
                                        handleUserClick(user.userId)
                                      }
                                    >
                                      {t("common.view")}
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                      </Carousel>
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
                                page === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
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
                                setPage((prev) =>
                                  Math.min(prev + 1, totalPages)
                                )
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
                    <User
                      size={64}
                      className="mx-auto text-muted-foreground mb-4"
                    />
                    <h3 className="text-lg font-medium mb-2">
                      {t("admin.noUsers")}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "No users match your search criteria."
                        : "No users found in the system."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersManagement;
