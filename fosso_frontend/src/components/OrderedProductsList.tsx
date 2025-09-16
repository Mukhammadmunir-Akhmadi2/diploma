import React, { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useToast } from "../hooks/useToast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Package,
  PackageCheck,
  Truck,
  CheckCircle,
  XCircle,
  BadgeDollarSign,
} from "lucide-react";
import { useIsMobile } from "../hooks/useMobile";
import type { OrderStatus } from "../types/enums";
import type { OrderMerchantDTO } from "../types/order";
import type { PaginatedResponse } from "../types/paginatedResponse";
import { Spin } from "antd";
import {
  getOrdersByMerchant,
  updateProductStatus,
} from "../api/merchant/MerchantOrder";
import { getUserProfileById } from "../api/User";
import { Modal, Input } from "antd";
import type { ErrorResponse } from "../types/error";

const OrderedProductsList: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [pageOrders, setPageOrders] =
    useState<PaginatedResponse<OrderMerchantDTO>>();
  const [isLoading, setIsLoading] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalLoading, setStatusModalLoading] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [pendingOrder, setPendingOrder] = useState<{
    orderId: string;
    productId: string;
    color: string;
    size: string;
  } | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<OrderMerchantDTO | null>(
    null
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await getOrdersByMerchant(page, 10);
        let productsWithCustomer = response.products;
        if (response.products.length > 0) {
          productsWithCustomer = await Promise.all(
            response.products.map(async (item) => {
              const user = await getUserProfileById(item.customerId);
              return { ...item, customer: user };
            })
          );
        }
        setPageOrders({
          ...response,
          products: productsWithCustomer,
        });
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        console.error("Error fetching merchant orders:", errorResponse);
        if (errorResponse.status === 404) {
          toast({
            title: t("merchant.noOrders"),
            description: t("merchant.noOrdersDesc"),
          });
        } else {
          toast({
            title: t("merchant.errorFetchingOrders"),
            description: t("merchant.errorFetchingOrdersDesc"),
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page]);
  // Define status flow
  const getNextPossibleStatuses = (
    currentStatus: OrderStatus,
    paymentMethod: "CARD" | "CASH_ON_DELIVERY"
  ): OrderStatus[] => {
    switch (currentStatus) {
      case "NEW":
        return ["PROCESSING", "CANCELLED"];
      case "PROCESSING":
        return ["SHIPPED", "CANCELLED"];
      case "SHIPPED":
        return ["DELIVERED", "RETURNED"];
      case "DELIVERED":
        // For cash on delivery, we need to mark as PAID after delivery
        if (paymentMethod === "CASH_ON_DELIVERY") {
          return ["PAID", "RETURNED"];
        }
        // For card payments, we can complete after delivery
        return ["COMPLETED", "RETURNED"];
      case "PAID":
        return ["COMPLETED"];
      case "COMPLETED":
      case "CANCELLED":
      case "RETURNED":
        // Terminal states, no further transitions
        return [];
      default:
        return [];
    }
  };

  // Function to update order status
  const updateOrderStatus = async (
    orderId: string,
    productId: string,
    color: string,
    size: string,
    newStatus: OrderStatus,
    notes: string
  ) => {
    try {
      await updateProductStatus(orderId, productId, color, size, {
        status: newStatus,
        notes: notes || "",
      });
      setPageOrders((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.map((item) =>
            item.orderId === orderId &&
            item.productId === productId &&
            item.color === color &&
            item.size === size
              ? {
                  ...item,
                  orderTrack: { ...item.orderTrack, status: newStatus },
                }
              : item
          ),
        };
      });
      toast({
        title: t("merchant.orderStatusUpdated"),
        description: t("merchant.orderStatusUpdatedDesc"),
      });
    } catch (error: any) {
      const errorResponse = error as ErrorResponse;
      console.error("Error updating order status:", errorResponse);
      toast({
        title: t("merchant.errorUpdatingStatus"),
        description: t("merchant.errorUpdatingStatusDesc"),
        variant: "destructive",
      });
    }
  };

  // Get the status icon based on status
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "NEW":
        return <Package className="h-5 w-5 text-gray-500" />;
      case "PROCESSING":
        return <PackageCheck className="h-5 w-5 text-blue-500" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "DELIVERED":
        return <Truck className="h-5 w-5 text-green-500" />;
      case "PAID":
        return <BadgeDollarSign className="h-5 w-5 text-emerald-500" />;
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "RETURNED":
        return <XCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get the status color for badges
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "NEW":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PAID":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "COMPLETED":
        return "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "RETURNED":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Only allow status updates for non-terminal states
  const isTerminalState = (status: OrderStatus) => {
    return ["COMPLETED", "CANCELED", "RETURNED"].includes(status);
  };

  const getDefaultNote = (status: OrderStatus) => {
    switch (status) {
      case "SHIPPED":
        return t("merchant.defaultNote.shipped", {
          defaultValue: "Product is on the way.",
        });
      case "DELIVERED":
        return t("merchant.defaultNote.delivered", {
          defaultValue: "Product delivered to customer.",
        });
      case "RETURNED":
        return t("merchant.defaultNote.returned", {
          defaultValue: "Product returned by customer.",
        });
      case "CANCELLED":
        return t("merchant.defaultNote.cancelled", {
          defaultValue: "Order cancelled.",
        });
      case "PAID":
        return t("merchant.defaultNote.paid", {
          defaultValue: "Payment received.",
        });
      case "COMPLETED":
        return t("merchant.defaultNote.completed", {
          defaultValue: "Order completed.",
        });
      case "PROCESSING":
        return t("merchant.defaultNote.processing", {
          defaultValue: "Order is being processed.",
        });
      default:
        return "";
    }
  };
  const handleStatusChange = (
    orderId: string,
    productId: string,
    color: string,
    size: string,
    newStatus: OrderStatus
  ) => {
    setPendingOrder({ orderId, productId, color, size });
    setPendingStatus(newStatus);
    setStatusNote(getDefaultNote(newStatus));
    setStatusModalOpen(true);
  };

  const handleStatusModalOk = async () => {
    if (!pendingOrder || !pendingStatus) return;
    setStatusModalLoading(true);
    await updateOrderStatus(
      pendingOrder.orderId,
      pendingOrder.productId,
      pendingOrder.color,
      pendingOrder.size,
      pendingStatus,
      statusNote
    );
    setStatusModalLoading(false);
    setStatusModalOpen(false);
    setPendingOrder(null);
    setPendingStatus(null);
    setStatusNote("");
  };

  const handleStatusModalCancel = () => {
    setStatusModalOpen(false);
    setPendingOrder(null);
    setPendingStatus(null);
    setStatusNote("");
  };

  const totalPages = pageOrders?.totalPages || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (isLoading) {
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
    <div>
      <Modal
        open={statusModalOpen}
        title={t("merchant.addStatusNote")}
        onOk={handleStatusModalOk}
        onCancel={handleStatusModalCancel}
        confirmLoading={statusModalLoading}
        okText={t("common.confirm")}
        cancelText={t("common.cancel")}
      >
        <div className="mb-2 text-sm text-gray-700">
          {t("merchant.statusNotePrompt")}
        </div>
        <Input.TextArea
          rows={4}
          value={statusNote}
          onChange={(e) => setStatusNote(e.target.value)}
          placeholder={t("merchant.statusNotePlaceholder")}
        />
      </Modal>
      <Modal
        open={userModalOpen}
        onCancel={() => setUserModalOpen(false)}
        footer={null}
        title={
          selectedOrder
            ? `${selectedOrder.customer?.firstName} ${selectedOrder.customer?.lastName}`
            : ""
        }
        bodyStyle={{
          padding: 24,
          background: "#f9fafb",
          borderRadius: 8,
        }}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* User Info */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-800">
                {t("user.details")}
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-medium">{t("user.email")}:</span>{" "}
                  <span>{selectedOrder.customer?.email}</span>
                </div>
                <div>
                  <span className="font-medium">{t("user.phoneNumber")}:</span>{" "}
                  <span>
                    {selectedOrder.customer?.phoneNumber || (
                      <span className="text-gray-400">{t("user.noPhone")}</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="font-medium">{t("user.gender")}:</span>{" "}
                  <span>{selectedOrder.customer?.gender}</span>
                </div>
                <div>
                  <span className="font-medium">{t("user.dateOfBirth")}:</span>{" "}
                  <span>{selectedOrder.customer?.dateOfBirth}</span>
                </div>
                <div>
                  <span className="font-medium">{t("user.roles")}:</span>{" "}
                  <span>{selectedOrder.customer?.roles?.join(", ")}</span>
                </div>
              </div>
            </div>
            {/* Delivery Address */}
            {(() => {
              const orderWithAddress = pageOrders?.products.find(
                (p) => p.customer?.userId === selectedOrder.customer?.userId
              );
              const address = orderWithAddress?.shippingAddress;
              return (
                <div>
                  <h3 className="text-base font-semibold mb-2 text-gray-800">
                    {t("order.deliveryAddress")}
                  </h3>
                  {address ? (
                    <div className="rounded bg-white border p-4 shadow-sm space-y-1 text-sm">
                      <div>
                        <span className="font-medium">
                          {t("address.line1")}:
                        </span>{" "}
                        {address.addressLine1}
                      </div>
                      {address.addressLine2 && (
                        <div>
                          <span className="font-medium">
                            {t("address.line2")}:
                          </span>{" "}
                          {address.addressLine2}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">
                          {t("address.city")}:
                        </span>{" "}
                        {address.city}
                      </div>
                      <div>
                        <span className="font-medium">
                          {t("address.state")}:
                        </span>{" "}
                        {address.state}
                      </div>
                      <div>
                        <span className="font-medium">
                          {t("address.postalCode")}:
                        </span>{" "}
                        {address.postalCode}
                      </div>
                      <div>
                        <span className="font-medium">
                          {t("address.country")}:
                        </span>{" "}
                        {address.country}
                      </div>
                      {address.phoneNumber && (
                        <div>
                          <span className="font-medium">
                            {t("address.phone")}:
                          </span>{" "}
                          {address.phoneNumber}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400">{t("order.noAddress")}</div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </Modal>

      {isMobile ? (
        // Mobile view - cards
        <div className="grid grid-cols-1 gap-4">
          {pageOrders?.products.map((item) => (
            <Card
              key={item.productId}
              className="overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="p-4 border-b dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                      <img
                        src={`data:${item.productImage.contentType};base64,${item.productImage.base64Data}`}
                        alt={item.productName}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <CardTitle className="text-base font-medium">
                      {item.productName}
                    </CardTitle>
                  </div>
                  <Badge className={getStatusColor(item?.orderTrack?.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(item.orderTrack?.status)}
                      {t(
                        `order.status.${item.orderTrack?.status.toLowerCase()}`
                      )}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("order.customer")}
                    </span>
                    <button
                      className="text-blue-600 underline hover:text-blue-800 text-sm font-medium"
                      onClick={() => {
                        setSelectedOrder(item ?? null);
                        setUserModalOpen(true);
                      }}
                      type="button"
                    >
                      {item.customer?.email}
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("order.orderId")}
                    </span>
                    <span className="text-sm">{item.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("order.date")}
                    </span>
                    <span className="text-sm">{item.orderDateTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("product.quantity")}
                    </span>
                    <span className="text-sm">{item.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("product.price")}
                    </span>
                    <span className="text-sm font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("order.paymentMethod")}
                    </span>
                    <span className="text-sm">
                      {item.paymentMethod === "CARD"
                        ? t("order.paymentMethods.card")
                        : t("order.paymentMethods.cashOnDelivery")}
                    </span>
                  </div>

                  {/* Status Update */}
                  {!isTerminalState(item?.orderTrack?.status) && (
                    <div className="mt-4 pt-3 border-t dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {t("merchant.updateStatus")}
                        </span>
                        {getNextPossibleStatuses(
                          item.orderTrack?.status,
                          item.paymentMethod
                        ).length > 0 && (
                          <Select
                            value={item.orderTrack?.status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                item.orderId,
                                item.productId,
                                item.color,
                                item.size,
                                value as OrderStatus
                              )
                            }
                          >
                            <SelectTrigger className="w-[160px]">
                              <SelectValue
                                placeholder={t("merchant.updateStatusTo")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {getNextPossibleStatuses(
                                item.orderTrack?.status,
                                item.paymentMethod
                              ).map((status) => (
                                <SelectItem key={status} value={status}>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(status)}
                                    {t(`order.status.${status.toLowerCase()}`)}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop/table view */}
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableCaption>
                {t("merchant.orderedProductsCaption")}
              </TableCaption>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[250px]">
                    {t("product.name")}
                  </TableHead>
                  <TableHead>{t("order.customer")}</TableHead>
                  <TableHead>{t("order.trackingNumber")}</TableHead>
                  <TableHead>{t("order.date")}</TableHead>
                  <TableHead>{t("product.quantity")}</TableHead>
                  <TableHead>{t("product.price")}</TableHead>
                  <TableHead>{t("order.paymentMethod")}</TableHead>
                  <TableHead>{t("order.status.status")}</TableHead>
                  <TableHead className="text-right">
                    {t("common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageOrders?.products.map((item) => (
                  <TableRow
                    key={item.productId + item.color + item.size}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-16 w-16 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                          <img
                            src={`data:${item.productImage.contentType};base64,${item.productImage.base64Data}`}
                            alt={item.productName}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <span className="font-medium">{item.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        className="text-blue-600 underline hover:text-blue-800"
                        onClick={() => {
                          setSelectedOrder(item ?? null);
                          setUserModalOpen(true);
                        }}
                        type="button"
                      >
                        {item.customer?.email}
                      </button>
                    </TableCell>{" "}
                    <TableCell>{item.orderTrackingNumber}</TableCell>
                    <TableCell>{item.orderDateTime}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.paymentMethod === "CARD"
                        ? t("order.paymentMethods.card")
                        : t("order.paymentMethods.cashOnDelivery")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(item.orderTrack?.status)}
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(item.orderTrack?.status)}
                          {t(
                            `order.status.${item.orderTrack?.status.toLowerCase()}`
                          )}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {!isTerminalState(item.orderTrack?.status) &&
                      getNextPossibleStatuses(
                        item.orderTrack?.status,
                        item.paymentMethod
                      ).length > 0 ? (
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={item.orderTrack?.status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                item.orderId,
                                item.productId,
                                item.color,
                                item.size,
                                value as OrderStatus
                              )
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue
                                placeholder={t("merchant.updateStatusTo")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {getNextPossibleStatuses(
                                item.orderTrack?.status,
                                item.paymentMethod
                              ).map((status) => (
                                <SelectItem key={status} value={status}>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(status)}
                                    {t(`order.status.${status.toLowerCase()}`)}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="opacity-50"
                        >
                          {t("merchant.cannotUpdate")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default OrderedProductsList;
