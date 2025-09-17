import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Truck } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import type { OrderDetailedDTO } from "../../types/order";
import { formatDate } from "../../utils/dateUtils";
import { getStatusClass } from "../../utils/statusUtils";

interface OrderSummaryProps {
  order: OrderDetailedDTO | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
}) => {
  const { t } = useLanguage();
  return (
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
          <h3 className="font-medium mb-2">{t("order.orderInformation")}</h3>
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
          <h3 className="font-medium mb-2">{t("order.shippingAddress")}</h3>
          <address className="not-italic text-gray-700 dark:text-gray-300 space-y-1 break-words">
            <div>{order?.shippingAddress.addressLine1}</div>
            <div>{order?.shippingAddress.addressLine2}</div>
            <div>
              {order?.shippingAddress.city}, {order?.shippingAddress.state}{" "}
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
              {formatDate(order?.deliveryDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
