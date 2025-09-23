import React from "react";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useLanguage } from "../../hooks/useLanguage";
import { getStatusClass, getStatusIcon } from "../../utils/statusUtils";
import OrderCustomerDetails from "./OrderCustomerDetails";
import OrderStatusManager from "./OrderStatusManager";
import type { PaginatedResponse } from "../../types/paginatedResponse";
import type { OrderMerchantDTO } from "../../types/order";
import EntityImage from "../../components/EntityImage";

interface DesktopOrderTableProps {
  orders: OrderMerchantDTO[];
  setPaginatedOrders: React.Dispatch<
    React.SetStateAction<PaginatedResponse<OrderMerchantDTO>>
  >;
}

const DesktopOrderTable: React.FC<DesktopOrderTableProps> = ({
  orders,
  setPaginatedOrders,
}) => {
  const { t } = useLanguage();
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableCaption>{t("merchant.orderedProductsCaption")}</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[250px]">{t("product.name")}</TableHead>
            <TableHead>{t("order.customer")}</TableHead>
            <TableHead>{t("order.trackingNumber")}</TableHead>
            <TableHead>{t("order.date")}</TableHead>
            <TableHead>{t("product.quantity")}</TableHead>
            <TableHead>{t("product.price")}</TableHead>
            <TableHead>{t("order.paymentMethod")}</TableHead>
            <TableHead>{t("order.status.status")}</TableHead>
            <TableHead className="text-right">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.productId + order.color + order.size}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="h-16 w-16 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <EntityImage
                      ownerId={order.productId}
                      imageType="PRODUCT_IMAGE_MAIN"
                      name={order.productName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="font-medium">{order.productName}</span>
                </div>
              </TableCell>
              <TableCell>
                <OrderCustomerDetails
                  order={order}
                  className="text-blue-600 underline hover:text-blue-800"
                />
              </TableCell>{" "}
              <TableCell>{order.orderTrackingNumber}</TableCell>
              <TableCell>{order.orderDateTime}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>${order.price.toFixed(2)}</TableCell>
              <TableCell>
                {order.paymentMethod === "CARD"
                  ? t("order.paymentMethods.card")
                  : t("order.paymentMethods.cashOnDelivery")}
              </TableCell>
              <TableCell>
                <Badge className={getStatusClass(order.orderTrack?.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(order.orderTrack?.status)}
                    {t(
                      `order.status.${order.orderTrack?.status.toLowerCase()}`
                    )}
                  </span>
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <OrderStatusManager
                  order={order}
                  variant="mobile"
                  setPaginatedOrders={setPaginatedOrders}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DesktopOrderTable;
