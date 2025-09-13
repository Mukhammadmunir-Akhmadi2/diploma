import React, { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Truck, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../api/Order";
import { type OrderDetail, type OrderDetailedDTO } from "../../types/order";
import { useToast } from "../../hooks/useToast";
import { Spin } from "antd";
import { getUserById } from "../../api/User";
import { type UserBriefDTO } from "../../types/user";
import type { OrderStatus } from "../../types/enums";
import EntityImage from "../EntityImage";

const OrderDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderDetailedDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const orderDetails: OrderDetailedDTO = await getOrderById(id);

          // Fetch images for all order items concurrently
          const updatedOrderDetails = await Promise.all(
            orderDetails.orderDetails.map(async (item) => {
              try {
                const merchant: UserBriefDTO = await getUserById(
                  item.merchantId
                );
                return { ...item, merchant };
              } catch (error) {
                console.error(
                  `Error fetching image for product ${item.productId}:`,
                  error
                );
                return { ...item, image: null, merchant: null }; // Fallback if image fetch fails
              }
            })
          );

          setOrder({ ...orderDetails, orderDetails: updatedOrderDetails });
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast({
          title: t("error.fetchOrder"),
          description: t("error.tryAgain"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, t, toast]);

  const toggleItemExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "PROCESSING":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "CANCELED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
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

  const renderOrderProgress = () => {
    const statuses = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
    const currentStatusIndex =
      statuses.indexOf(order?.status) !== -1
        ? statuses.indexOf(order?.status)
        : 1; // Default to PROCESSING if status not found

    return (
      <div className="my-8">
        <div className="flex justify-between mb-2">
          {statuses.map((status, index) => (
            <div
              key={status}
              className={`flex flex-col items-center ${
                index <= currentStatusIndex
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full mb-1 flex items-center justify-center
                  ${
                    index < currentStatusIndex
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : index === currentStatusIndex
                      ? "border-2 border-blue-600 dark:border-blue-400"
                      : "border-2 border-gray-300 dark:border-gray-600"
                  }`}
              >
                {index < currentStatusIndex && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs uppercase">
                {t(`order.status.${status.toLowerCase()}`)}
              </span>
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-blue-600 dark:bg-blue-500 transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                (currentStatusIndex / (statuses.length - 1)) * 100
              )}%`,
            }}
          ></div>
        </div>
      </div>
    );
  };

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
    <div className="container  px-4 py-8 flex-grow">
      <div className="max-w-full">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile/orders")}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("order.backToOrders")}
          </Button>
          <h1 className="text-2xl font-bold ml-2">{t("order.details")}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6 sticky top-4">
              {/* Order Summary Details */}
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {t("order.orderSummary")}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between flex-wrap">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("order.subtotal")}
                    </span>
                    <span className="text-gray-900 dark:text-gray-200 text-sm">
                      ${order?.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between flex-wrap">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("order.shipping")}
                    </span>
                    <span className="text-gray-900 dark:text-gray-200 text-sm">
                      ${order?.shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between flex-wrap font-bold text-lg">
                    <span>{t("order.total")}</span>
                    <span>${order?.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              {/* Order Information */}
              <Separator />
              <div>
                <h3 className="font-medium mb-2">
                  {t("order.orderInformation")}
                </h3>
                <dl className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-gray-600 dark:text-gray-400">
                      {t("order.orderId")}:
                    </dt>
                    <dd className="text-gray-900 dark:text-gray-200 break-words text-sm">
                      {order?.orderId}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-gray-600 dark:text-gray-400">
                      {t("order.orderDate")}:
                    </dt>
                    <dd className="text-gray-900 dark:text-gray-200 text-sm">
                      {formatDate(order?.orderDateTime)}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-gray-600 dark:text-gray-400">
                      {t("order.trackingNumber")}:
                    </dt>
                    <dd className="text-gray-900 dark:text-gray-200 break-words text-sm">
                      {order?.orderTrackingNumber}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-gray-600 dark:text-gray-400">
                      {t("order.status.status")}:
                    </dt>
                    <dd>
                      <Badge className={getStatusClass(order?.status)}>
                        {order?.status}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </div>
              {/* Shipping Address */}
              <Separator />
              <div>
                <h3 className="font-medium mb-2">
                  {t("order.shippingAddress")}
                </h3>
                <address className="not-italic text-gray-700 dark:text-gray-300 space-y-1 break-words">
                  <div>{order?.shippingAddress.addressLine1}</div>
                  <div>{order?.shippingAddress.addressLine2}</div>
                  <div>
                    {order?.shippingAddress.city},{" "}
                    {order?.shippingAddress.state}{" "}
                    {order?.shippingAddress.postalCode}
                  </div>
                  <div>{order?.shippingAddress.country}</div>
                </address>
              </div>
              {/* Estimated Delivery */}
              <Separator />
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <Truck className="mr-2 h-5 w-5" />
                <div>
                  <div>{t("order.estimatedDelivery")}</div>
                  <div className="font-medium">
                    {new Date(order?.deliveryDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                {t("order.status.heading")}
              </h2>
              {renderOrderProgress()}

              <h2 className="text-lg font-semibold mt-8 mb-4">
                {t("order.orderItems")}
              </h2>
              <div className="space-y-4">
                {order?.orderDetails.map((orderDetail: OrderDetail) => (
                  <div
                    key={orderDetail.productId}
                    className="border dark:border-gray-700 rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="p-4 flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0 w-16 h-16">
                        <EntityImage
                          ownerId={orderDetail.productId}
                          imageType="PRODUCT_IMAGE_MAIN"
                          name={orderDetail.productName}
                          className="w-full h-full object-contain rounded-md"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div>
                            <h3 className="font-medium">
                              {orderDetail.productName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {t("product.quantity")}: {orderDetail.quantity} ×
                              ${orderDetail.price.toFixed(2)}
                              <span className="mx-1">•</span>
                              {orderDetail.color}, {orderDetail.size}
                            </p>
                            <Badge
                              className={`mt-2 ${getStatusClass(
                                orderDetail?.orderTrack?.status
                              )}`}
                            >
                              {orderDetail.orderTrack?.status}
                            </Badge>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-medium">
                              ${orderDetail.subtotal.toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-sm underline text-blue-600 dark:text-blue-400 p-0 h-auto"
                              onClick={() =>
                                toggleItemExpand(
                                  orderDetail.color + orderDetail.size
                                )
                              }
                            >
                              {expandedItems.includes(
                                orderDetail.color + orderDetail.size
                              )
                                ? t("common.lessDetails")
                                : t("common.moreDetails")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedItems.includes(
                      orderDetail.color + orderDetail.size
                    ) && (
                      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              {t("order.sellerInformation")}
                            </h4>
                            <dl className="space-y-1 text-sm">
                              <div className="grid grid-cols-2">
                                <dt className="text-gray-600 dark:text-gray-400">
                                  {t("order.sellerName")}:
                                </dt>
                                <dd>{`${orderDetail?.merchant?.firstName} ${orderDetail.merchant?.lastName}`}</dd>
                              </div>
                              <div className="grid grid-cols-2">
                                <dt className="text-gray-600 dark:text-gray-400">
                                  {t("order.sellerEmail")}:
                                </dt>
                                <dd>{orderDetail?.merchant?.email}</dd>
                              </div>
                            </dl>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              {t("order.trackingInformation")}
                            </h4>
                            <dl className="space-y-1 text-sm">
                              <div className="grid grid-cols-2">
                                <dt className="text-gray-600 dark:text-gray-400">
                                  {t("order.status.status")}:
                                </dt>
                                <dd>{orderDetail?.orderTrack.status}</dd>
                              </div>
                              <div className="grid grid-cols-2">
                                <dt className="text-gray-600 dark:text-gray-400">
                                  {t("order.lastUpdate")}:
                                </dt>
                                <dd>
                                  {formatDate(
                                    orderDetail?.orderTrack.updatedTime
                                  )}
                                </dd>
                              </div>
                              <div className="grid grid-cols-2">
                                <dt className="text-gray-600 dark:text-gray-400">
                                  {t("order.notes")}:
                                </dt>
                                <dd>
                                  {getDefaultNote(
                                    orderDetail.orderTrack?.status
                                  )}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-end">
                            <div className="w-56">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  {t("order.price")}
                                </span>
                                <span>
                                  $
                                  {(
                                    orderDetail.price * orderDetail.quantity
                                  ).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  {t("order.shipping")}
                                </span>
                                <span>
                                  ${orderDetail.shippingCost.toFixed(2)}
                                </span>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between font-medium">
                                <span>{t("order.subtotal")}</span>
                                <span>${orderDetail.subtotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
