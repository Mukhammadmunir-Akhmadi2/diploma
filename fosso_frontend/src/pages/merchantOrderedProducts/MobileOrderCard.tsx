import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useLanguage } from "../../hooks/useLanguage";
import { getStatusClass, getStatusIcon } from "../../utils/statusUtils";
import OrderCustomerDetails from "./OrderCustomerDetails";
import type { OrderMerchantDTO } from "../../types/order";
import OrderStatusManager from "./OrderStatusManager";
import type { PaginatedResponse } from "../../types/paginatedResponse";

interface MobileOrderCardProps {
  orders: OrderMerchantDTO[];
  setPaginatedOrders: React.Dispatch<
    React.SetStateAction<PaginatedResponse<OrderMerchantDTO>>
  >;
}
const MobileOrderCard: React.FC<MobileOrderCardProps> = ({ orders, setPaginatedOrders }) => {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 gap-4">
      {orders.map((order) => (
        <Card
          key={order.productId}
          className="overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <CardHeader className="p-4 border-b dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img
                    src={`data:${order.productImage.contentType};base64,${order.productImage.base64Data}`}
                    alt={order.productName}
                    className="h-full w-full object-contain"
                  />
                </div>
                <CardTitle className="text-base font-medium">
                  {order.productName}
                </CardTitle>
              </div>
              <Badge className={getStatusClass(order?.orderTrack?.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(order.orderTrack?.status)}
                  {t(`order.status.${order.orderTrack?.status.toLowerCase()}`)}
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
                <OrderCustomerDetails
                  order={order}
                  className="text-blue-600 underline hover:text-blue-800 text-sm font-medium"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("order.orderId")}
                </span>
                <span className="text-sm">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("order.date")}
                </span>
                <span className="text-sm">{order.orderDateTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("product.quantity")}
                </span>
                <span className="text-sm">{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("product.price")}
                </span>
                <span className="text-sm font-medium">
                  ${order.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("order.paymentMethod")}
                </span>
                <span className="text-sm">
                  {order.paymentMethod === "CARD"
                    ? t("order.paymentMethods.card")
                    : t("order.paymentMethods.cashOnDelivery")}
                </span>
              </div>

              {/* Status Update */}

              <div className="mt-4 pt-3 border-t dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t("merchant.updateStatus")}
                  </span>

                  <OrderStatusManager
                    order={order}
                    variant="mobile"
                    setPaginatedOrders={setPaginatedOrders}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MobileOrderCard;
