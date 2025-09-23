import React, { useState } from "react";
import { updateProductStatus } from "../../api/merchant/MerchantOrder";
import type { OrderStatus } from "../../types/enums";
import { Modal, Input } from "antd";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import type { ErrorResponse } from "../../types/error";
import { getStatusIcon } from "../../utils/statusUtils";
import type { OrderMerchantDTO } from "../../types/order";
import type { PaginatedResponse } from "../../types/paginatedResponse";

interface OrderStatusManagerProps {
  order: OrderMerchantDTO;
  variant: "desktop" | "mobile";
  setPaginatedOrders: React.Dispatch<
    React.SetStateAction<PaginatedResponse<OrderMerchantDTO>>
  >;
}

const OrderStatusManager: React.FC<OrderStatusManagerProps> = ({
  order,
  variant,
  setPaginatedOrders,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

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
      setPaginatedOrders((prev) => {
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

  return (
    <>
      {/* User Details Dialog */}
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
      {!isTerminalState(order.orderTrack?.status) &&
      getNextPossibleStatuses(order.orderTrack?.status, order.paymentMethod)
        .length > 0 ? (
        <div className="flex items-center justify-end gap-2">
          <Select
            value={order.orderTrack?.status}
            onValueChange={(value) =>
              handleStatusChange(
                order.orderId,
                order.productId,
                order.color,
                order.size,
                value as OrderStatus
              )
            }
          >
            <SelectTrigger
              className={variant === "desktop" ? "w-[180px]" : "w-[160px]"}
            >
              <SelectValue placeholder={t("merchant.updateStatusTo")} />
            </SelectTrigger>
            <SelectContent>
              {getNextPossibleStatuses(
                order.orderTrack?.status,
                order.paymentMethod
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
        <Button variant="ghost" size="sm" disabled className="opacity-50">
          {t("merchant.cannotUpdate")}
        </Button>
      )}
    </>
  );
};
export default OrderStatusManager;
