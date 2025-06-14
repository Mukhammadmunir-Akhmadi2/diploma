import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../../components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { type OrderBriefDTO } from "../../types/order";
import { getOrdersByCustomer } from "../../api/Order";
import { type PaginatedResponse } from "../../types/paginatedResponse";
import { Spin } from "antd";
import { useToast } from "../ui/use-toast";
import type { ErrorResponse } from "../../types/error";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { Card, CardContent } from "../../components/ui/card";
import type { OrderStatus } from "../../types/enums";
import { useIsMobile } from "../../hooks/use-mobile";
import type { UserBriefDTO } from "../../types/user";
import { getUserById } from "../../api/User";

const OrdersSection: React.FC<{ userId: string }> = ({ userId }) => {
  const { t } = useLanguage();
  const [paginatedOrder, setPaginatedOrder] =
    useState<PaginatedResponse<OrderBriefDTO>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [user, setUser] = useState<UserBriefDTO | null>(null);
  const [page, setPage] = useState(1);
  const ordersPerPage = 4;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data: PaginatedResponse<OrderBriefDTO> =
          await getOrdersByCustomer(userId, page, ordersPerPage);

        const userData: UserBriefDTO = await getUserById(userId);
        setUser(userData);
        setPaginatedOrder(data);
      } catch (error: any) {
        const errorResponse = error as ErrorResponse;
        if(errorResponse.status === 404) {
          toast({
            title: t("error.notFoundTitle", {
              defaultValue: "Orders Not Found",
            }),
            description: t("error.notFoundDescription", {
              defaultValue: "No orders were found for this user.",
            }),
          });
        } else {
          toast({
          title: t("error.fetchProduct"),
          description: t("error.tryAgain"),
          variant: "destructive",
        });
        console.error("Error fetching categories:", errorResponse);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalPages = paginatedOrder?.totalPages || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "COMPLETED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "SHIPPED":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "NEW":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">{t("profile.orders")}</h2>

      {paginatedOrder?.products && paginatedOrder.products.length > 0 ? (
        <>
          <div
            className={`${
              isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"
            }`}
          >
            {paginatedOrder.products.map((order) => (
              <Card
                key={order.orderId}
                className="border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    {/* Order header with ID and status */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{user?.email}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("order.tracking")}: {order.orderTrackingNumber}
                        </p>
                      </div>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${getStatusBadgeClass(
                          order.orderStatus
                        )}`}
                      >
                        {t(`profile.${order.orderStatus.toLowerCase()}`)}
                      </span>
                    </div>

                    {/* Order details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t("order.customer")}
                        </span>
                        <span>{`${user?.firstName} ${user?.lastName}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t("order.date")}
                        </span>
                        <span>
                          {formatDate(order.orderDateTime)}{" "}
                          {formatTime(order.orderDateTime)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t("order.deliveryDate")}
                        </span>
                        <span>
                          {formatDate(order.deliveryDate)} (
                          {t("order.days", { count: order.deliveryDays })})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t("product.quantity")}
                        </span>
                        <span>
                          {order.items} {t("profile.items")}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t("product.total")}
                        </span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full mt-2"
                    >
                      <Link to={`/order/${order.orderId}`}>
                        {t("profile.viewOrder")}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
        <div className="text-center py-8">
          <ShoppingBag className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-500 dark:text-gray-400">
            {t("profile.noOrders")}
          </p>
          <Button className="mt-4" asChild>
            <Link to="/">{t("profile.startShopping")}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
