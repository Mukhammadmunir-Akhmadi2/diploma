import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { MapPin, Edit2, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import type { Address, UserDTO } from "../../types/user";
import AddressForm from "../../components/profile/AddressForm";
import { useLanguage } from "../../hooks/useLanguage";
import { updateCurrentUserAddress } from "../../api/User";
import { useToast } from "../../hooks/useToast";
import type { ErrorResponse } from "../../types/error";

interface CheckoutAddressSectionProps {
  user: UserDTO | null;
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  selectedAddressId: string;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
  setIsAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckoutAddressSection: React.FC<CheckoutAddressSectionProps> = ({
  user,
  addresses,
  setAddresses,
  selectedAddressId,
  setSelectedAddressId,
  setIsAddressModalOpen,
}) => {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleEditAddress = async (data: Address) => {
    try {
      const updatedAddress = await updateCurrentUserAddress(data);

      const updatedAddresses = addresses.map((address) =>
        address.addressId === updatedAddress.addressId
          ? updatedAddress
          : address
      );

      setAddresses(updatedAddresses);

      setSelectedAddressId(updatedAddress.addressId);

      toast({
        title: t("address.addressUpdated"),
        description: t("address.addressUpdatedDesc"),
      });
    } catch (error) {
      const errorResponse = error as ErrorResponse;

      console.error("Error updating address:", errorResponse);

      toast({
        title: t("address.editErrorTitle", {
          defaultValue: "Error Editing Address",
        }),
        description: t("address.editErrorDesc", {
          defaultValue:
            "An error occurred while editing the address. Please try again.",
        }),
        variant: "destructive",
      });
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          {t("checkout.shippingAddress")}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddressModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("checkout.addNewAddress")}
        </Button>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4">
          {addresses.length > 0 ? (
            <RadioGroup
              value={selectedAddressId}
              onValueChange={setSelectedAddressId}
              className="space-y-3"
            >
              {addresses.map((address) => (
                <div
                  key={address.addressId}
                  className={`flex items-start space-x-3 border rounded-md p-4 ${
                    selectedAddressId === address.addressId
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <RadioGroupItem
                    value={address.addressId}
                    id={address.addressId}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={address.addressId}
                      className="flex items-center font-medium cursor-pointer"
                    >
                      {user && `${user.firstName} ${user.lastName}`}
                      {address.isDefault && (
                        <span className="ml-2 text-xs font-normal text-white bg-blue-500 px-2 py-0.5 rounded-full">
                          {t("checkout.default")}
                        </span>
                      )}
                    </Label>
                    <div className="text-sm text-muted-foreground mt-1 space-y-1">
                      <p>{address.phoneNumber}</p>
                      <p>
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setEditingAddress(address)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Dialog
                open={editingAddress !== null}
                onOpenChange={(open) => {
                  if (!open) setEditingAddress(null);
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("address.editAddress")}</DialogTitle>
                  </DialogHeader>
                  {editingAddress && (
                    <AddressForm
                      defaultValues={editingAddress}
                      onSubmit={(data) => {
                        handleEditAddress(data);
                        setEditingAddress(null);
                      }}
                      onCancel={() => setEditingAddress(null)}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </RadioGroup>
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-1">{t("checkout.noAddresses")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("checkout.noAddressesDesc")}
              </p>
              <Button onClick={() => setIsAddressModalOpen(true)}>
                {t("checkout.addAddress")}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutAddressSection;
