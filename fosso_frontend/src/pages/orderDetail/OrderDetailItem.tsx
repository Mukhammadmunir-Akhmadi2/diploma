import React, { useState } from "react";
import EntityImage from "../../components/EntityImage";
import { useLanguage } from "../../hooks/useLanguage";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import type { OrderStatus } from "../../types/enums";
import { formatDate } from "../../utils/dateUtils";
import type { OrderDetail } from "../../types/order";
import { getStatusClass } from "../../utils/statusUtils";

interface OrderDetailItemProps {
  orderDetail: OrderDetail;
  index: number;
}
const OrderDetailItem: React.FC<OrderDetailItemProps> = ({
  orderDetail,
  index,
}) => {
  const { t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItemExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
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

  return (
    <div
      key={`${orderDetail.productId}${index}`}
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
              <h3 className="font-medium">{orderDetail.productName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("product.quantity")}: {orderDetail.quantity} × $
                {orderDetail.price.toFixed(2)}
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
                  toggleItemExpand(orderDetail.color + orderDetail.size)
                }
              >
                {expandedItems.includes(orderDetail.color + orderDetail.size)
                  ? t("common.lessDetails")
                  : t("common.moreDetails")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {expandedItems.includes(orderDetail.color + orderDetail.size) && (
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
                  <dd>{formatDate(orderDetail?.orderTrack.updatedTime)}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-gray-600 dark:text-gray-400">
                    {t("order.notes")}:
                  </dt>
                  <dd>{getDefaultNote(orderDetail.orderTrack?.status)}</dd>
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
                    ${(orderDetail.price * orderDetail.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("order.shipping")}
                  </span>
                  <span>${orderDetail.shippingCost.toFixed(2)}</span>
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
  );
};

export default OrderDetailItem;
