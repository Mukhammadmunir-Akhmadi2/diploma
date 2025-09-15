import React from "react";
import AddressForm from "../../components/profile/AddressForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { addCurrentUserAddress } from "../../api/User";
import type { Address } from "../../types/user";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";

interface AddressModalProps {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddressModal: React.FC<AddressModalProps> = ({
  addresses,
  setAddresses,
  setSelectedAddressId,
  isAddressModalOpen,
  setIsAddressModalOpen,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Handle the new address submission
  const handleAddAddress = async (data: Address) => {
    try {
      const newAddress: Address = await addCurrentUserAddress(data);

      let updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: data.default ? false : addr.isDefault,
      }));

      updatedAddresses = [...updatedAddresses, newAddress];
      setAddresses(updatedAddresses);

      setSelectedAddressId(newAddress.addressId);

      setIsAddressModalOpen(false);

      toast({
        title: t("address.addedSuccess"),
        description: t("address.addedSuccessDesc"),
      });
    } catch (error) {
      console.error("Error adding address:", error);
      toast({
        title: t("address.addedError"),
        description: t("address.addedErrorDesc"),
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("checkout.addNewAddress")}</DialogTitle>
        </DialogHeader>
        <AddressForm
          onSubmit={handleAddAddress}
          onCancel={() => setIsAddressModalOpen(false)}
          onClose={() => setIsAddressModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;