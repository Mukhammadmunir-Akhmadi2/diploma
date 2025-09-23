import React from "react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { useLanguage } from "../../hooks/useLanguage";
import type { OrderMerchantDTO } from "../../types/order";
import type { UserDetailedDTO } from "../../types/user";

interface UserDialogProps {
  order: OrderMerchantDTO;
  customer: UserDetailedDTO;
  userDialogOpen: boolean;
  setUserDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDialog: React.FC<UserDialogProps> = ({
  order,
  customer,
  userDialogOpen,
  setUserDialogOpen,
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {customer ? `${customer?.firstName} ${customer?.lastName}` : ""}
          </DialogTitle>
          <DialogDescription>{t("user.details")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div>
            <h3 className="text-base font-semibold mb-2 text-gray-800">
              {t("user.details")}
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <span className="font-medium">{t("user.email")}:</span>{" "}
                <span>{customer?.email}</span>
              </div>
              <div>
                <span className="font-medium">{t("user.phoneNumber")}:</span>{" "}
                <span>
                  {customer?.phoneNumber || (
                    <span className="text-gray-400">{t("user.noPhone")}</span>
                  )}
                </span>
              </div>
              <div>
                <span className="font-medium">{t("user.gender")}:</span>{" "}
                <span>{customer?.gender}</span>
              </div>
              <div>
                <span className="font-medium">{t("user.dateOfBirth")}:</span>{" "}
                <span>{customer?.dateOfBirth}</span>
              </div>
              <div>
                <span className="font-medium">{t("user.roles")}:</span>{" "}
                <span>{customer?.roles?.join(", ")}</span>
              </div>
            </div>
          </div>
          {/* Delivery Address */}

          <div>
            <h3 className="text-base font-semibold mb-2 text-gray-800">
              {t("order.deliveryAddress")}
            </h3>

            <div className="rounded border p-4 shadow-sm space-y-1 text-sm">
              <div>
                <span className="font-medium">{t("address.line1")}:</span>{" "}
                {order.shippingAddress.addressLine1}
              </div>
              {order.shippingAddress.addressLine2 && (
                <div>
                  <span className="font-medium">{t("address.line2")}:</span>{" "}
                  {order.shippingAddress.addressLine2}
                </div>
              )}
              <div>
                <span className="font-medium">{t("address.city")}:</span>{" "}
                {order.shippingAddress.city}
              </div>
              <div>
                <span className="font-medium">{t("address.state")}:</span>{" "}
                {order.shippingAddress.state}
              </div>
              <div>
                <span className="font-medium">{t("address.postalCode")}:</span>{" "}
                {order.shippingAddress.postalCode}
              </div>
              <div>
                <span className="font-medium">{t("address.country")}:</span>{" "}
                {order.shippingAddress.country}
              </div>
              {order.shippingAddress.phoneNumber && (
                <div>
                  <span className="font-medium">{t("address.phone")}:</span>{" "}
                  {order.shippingAddress.phoneNumber}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default UserDialog;
