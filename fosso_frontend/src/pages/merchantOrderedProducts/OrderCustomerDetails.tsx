import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { getUserProfileById } from "../../api/User";
import type { UserDetailedDTO } from "../../types/user";
import type { OrderMerchantDTO } from "../../types/order";
import UserDialog from "./UserDialog";

interface OrderCustomerDetailsProps {
  order: OrderMerchantDTO;
  className?: string;
}

const OrderCustomerDetails: React.FC<OrderCustomerDetailsProps> = ({
  order,
  className,
}) => {
  const [customerDetails, setCustomerDetails] = useState<UserDetailedDTO>();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getUserProfileById(order.customerId)
      .then(setCustomerDetails)
      .catch((err) => console.error("Error fetching customer details:", err));
  }, [order.customerId]);

  return (
    <>
      <Button
        variant="link"
        className={className}
        onClick={() => setOpen(true)}
      >
        {customerDetails?.email ?? "View customer"}
      </Button>

      {customerDetails && (
        <UserDialog
          order={order}
          customer={customerDetails}
          userDialogOpen={open}
          setUserDialogOpen={setOpen}
        />
      )}
    </>
  );
};
export default OrderCustomerDetails;
