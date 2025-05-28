import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../../components/ui/button";
import { PlusCircle, Home, Building, Mail, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useToast } from "../../hooks/use-toast";
import type { Address } from "../../types/user";
import {
  getCurrentUserAddresses,
  addCurrentUserAddress,
  updateCurrentUserAddress,
  deleteUserAddress,
} from "../../api/User";
import { Spin } from "antd";
import type { ErrorResponse } from "../../types/error";
import AddressForm from "./AddressForm";

const AddressesSection: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getCurrentUserAddresses();
        setAddresses(data);
      } catch (error: any) {
        const errorResponse = error as ErrorResponse;
        console.error("Fetch user addresses error:", errorResponse);
        if (errorResponse.status === 404) {
          toast({
            title: t("address.notFoundTitle", {
              defaultValue: "No Addresses Found",
            }),
            description: t("address.notFoundDesc", {
              defaultValue:
                "You have no saved addresses yet. Please add a new address to continue.",
            }),
          });
        } else {
          toast({
            title: t("address.fetchErrorTitle", {
              defaultValue: "Error Fetching Addresses",
            }),
            description:
              error.message ||
              t("address.fetchErrorDesc", {
                defaultValue:
                  "An error occurred while fetching your addresses. Please try again later.",
              }),
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleAddAddress = async (data: Address) => {
    try {
      const newAddress = await addCurrentUserAddress(data);
      setAddresses([...addresses, newAddress]);
      setIsAddDialogOpen(false);

      toast({
        title: t("address.addressAdded"),
        description: t("address.addressAddedDesc"),
      });
    } catch (error) {
      console.error("Error adding address:", error);
      toast({
        title: t("address.addErrorTitle", {
          defaultValue: "Error Adding Address",
        }),
        description: t("address.addErrorDesc", {
          defaultValue:
            "An error occurred while adding the address. Please try again.",
        }),
        variant: "destructive",
      });
    }
  };

  // Handle form submission for editing address
  const handleEditAddress = async (data: Address) => {
    if (!currentAddress) return;

    try {
      const updatedAddress = await updateCurrentUserAddress(data);
      const updatedAddresses = addresses.map((address) =>
        address.addressId === currentAddress.addressId
          ? updatedAddress
          : address
      );

      setAddresses(updatedAddresses);
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
    } finally {
      setIsEditDialogOpen(false);
      setCurrentAddress(null);
    }
  };

  // Handle address deletion
  const handleDeleteAddress = async (id: string) => {
    try {
      // Call the API to delete the address
      const response = await deleteUserAddress(id);

      // Update the state to remove the deleted address
      const updatedAddresses = addresses.filter(
        (address) => address.addressId !== id
      );
      setAddresses(updatedAddresses);

      // Show success toast
      toast({
        title: t("address.addressDeleted"),
        description: response || t("address.addressDeletedDesc"),
      });
    } catch (error) {
      console.error("Error deleting address:", error);

      // Show error toast
      toast({
        title: t("address.deleteErrorTitle", {
          defaultValue: "Error Deleting Address",
        }),
        description: t("address.deleteErrorDesc", {
          defaultValue:
            "An error occurred while deleting the address. Please try again.",
        }),
        variant: "destructive",
      });
    }
  };

  // Open edit dialog for an address
  const openEditDialog = (address: Address) => {
    setCurrentAddress(address);
    setIsEditDialogOpen(true);
  };

  // Get icon based on address type
  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home size={18} />;
      case "work":
        return <Building size={18} />;
      default:
        return <Mail size={18} />;
    }
  };

  if (isLoading) {
    // Show Ant Design's Spin component while loading
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("profile.addresses")}</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("address.addNew")}
        </Button>
      </div>

      <div className="space-y-4">
        {addresses &&
          addresses.map((address) => (
            <div
              key={address.addressId}
              className="border rounded-lg p-4 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 text-gray-500 dark:text-gray-400">
                    {getAddressIcon(address.addressType)}
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">
                      {t(`address.${address.addressType}`)}
                      {address.default && (
                        <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                          {t("address.default")}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {address.addressLine1}
                    </p>
                    {address.addressLine2 && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {address.addressLine2}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {address.country}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(address)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      address.addressId &&
                      handleDeleteAddress(address.addressId)
                    }
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}

        {addresses && addresses.length === 0 && (
          <div className="text-center py-8 border rounded-md dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              {t("address.noAddresses")}
            </p>
          </div>
        )}
      </div>

      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("address.addNew")}</DialogTitle>
          </DialogHeader>
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("address.editAddress")}</DialogTitle>
          </DialogHeader>
          {currentAddress && (
            <AddressForm
              onSubmit={handleEditAddress}
              onCancel={() => setIsEditDialogOpen(false)}
              defaultValues={currentAddress}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressesSection;
