import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import {
  CreditCard,
  ShoppingBag,
  MapPin,
  Truck,
  Edit2,
  Plus,
} from "lucide-react";
import AddressForm from "../components/profile/AddressForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import type { Address } from "../types/user";
import {
  getCurrentUserAddresses,
  addCurrentUserAddress,
  updateCurrentUserAddress,
} from "../api/User";
import { getCartItems } from "../api/Cart";
import type { CartItemDTO } from "../types/cart";
import { useAppSelector } from "../store/hooks";
import { placeOrder } from "../api/Order";
import type { CheckoutRequest } from "../types/order";
import type { PaymentMethod } from "../types/enums";
import type { ErrorResponse } from "../types/error";
import { Spin } from "antd";

const CheckoutPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItemDTO[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((addr) => addr.isDefault)?.addressId ||
      addresses[0]?.addressId ||
      ""
  );

  const user = useAppSelector((state) => state.auth.user);

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CASH_ON_DELIVERY");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    if (user) {
      const fetchCartItemsAndAddresses = async () => {
        try {
          const cartResponse = await getCartItems(user.userId);
          setCartItems(cartResponse.cartItems);

          const addressResponse: Address[] = await getCurrentUserAddresses();
          setAddresses(addressResponse);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast({
            title: t("error.fetchData"),
            description: t("error.fetchDataDesc"),
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchCartItemsAndAddresses();
    }
  }, []);
  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const shippingCost = subtotal > 100 ? 0 : 5.99;
  const taxRate = 0.08; // 8% tax
  const estimatedTax = subtotal * taxRate;
  const total = subtotal + shippingCost + estimatedTax;

  // Get selected address object
  const selectedAddress = addresses.find(
    (address) => address.addressId === selectedAddressId
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: t("checkout.addressRequired"),
        description: t("checkout.pleaseSelectAddress"),
        variant: "destructive",
      });
      return;
    }

    setIsProcessingOrder(true);

    try {
      const orderRequest: CheckoutRequest = {
        addressId: selectedAddressId,
        paymentMethod: paymentMethod,
      };

      const trackingNumber = await placeOrder(orderRequest);

      toast({
        title: t("checkout.orderPlaced"),
        description: t("checkout.orderConfirmation"),
      });

      navigate(`/order-confirmation/${trackingNumber}`);
    } catch (error) {
      const errorResponse = error as ErrorResponse;

      console.error("Error placing order:", errorResponse);

      toast({
        title: t("checkout.orderError"),
        description: t("checkout.orderErrorDesc"),
        variant: "destructive",
      });
      setIsProcessingOrder(false);
    }
  };

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
    <>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t("checkout.title")}</h1>
          <Button variant="ghost" asChild>
            <Link to="/cart">{t("checkout.backToCart")}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Checkout Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Section */}
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
                                {address.addressLine2 &&
                                  `, ${address.addressLine2}`}
                              </p>
                              <p>
                                {address.city}, {address.state}{" "}
                                {address.postalCode}
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
                            <DialogTitle>
                              {t("address.editAddress")}
                            </DialogTitle>
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
                      <h3 className="font-medium mb-1">
                        {t("checkout.noAddresses")}
                      </h3>
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

            {/* Payment Method Section */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  {t("checkout.paymentMethod")}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div
                    className={`flex items-start space-x-3 border rounded-md p-4 ${
                      paymentMethod === "CASH_ON_DELIVERY"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <RadioGroupItem value="CASH_ON_DELIVERY" id="cod" />
                    <div className="flex-1">
                      <Label
                        htmlFor="cod"
                        className="font-medium cursor-pointer"
                      >
                        {t("checkout.cashOnDelivery")}
                      </Label>
                      <div className="text-sm text-muted-foreground mt-1">
                        {t("checkout.codDesc")}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 border rounded-md p-4 ${
                      paymentMethod === "CARD"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <RadioGroupItem value="CARD" id="card" />
                    <div className="flex-1">
                      <Label
                        htmlFor="card"
                        className="font-medium cursor-pointer"
                      >
                        {t("checkout.creditDebitCard")}
                      </Label>
                      <div className="text-sm text-muted-foreground mt-1">
                        {t("checkout.cardDesc")}
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  {t("checkout.deliveryMethod")}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="border rounded-md p-4 bg-primary/5 border-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {t("checkout.standardDelivery")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("checkout.deliveryTime")}
                      </p>
                    </div>
                    <div className="text-right">
                      {shippingCost === 0 ? (
                        <span className="font-medium text-green-600">
                          {t("checkout.free")}
                        </span>
                      ) : (
                        <span className="font-medium">
                          ${shippingCost.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  {t("checkout.orderSummary")}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Item List */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={`data:${item.productImage.contentType};base64,${item.productImage.base64Data}`}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {item.productName}
                        </h4>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.size && (
                            <span className="mr-2">
                              {t("product.size")}: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span>
                              {t("product.color")}: {item.color}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-xs">
                            {t("product.qty")}: {item.quantity}
                          </div>
                          <div className="font-medium">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("checkout.subtotal")}
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("checkout.shipping")}
                    </span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">
                        {t("checkout.free")}
                      </span>
                    ) : (
                      <span>${shippingCost.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("checkout.tax")}
                    </span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("checkout.total")}</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessingOrder || !selectedAddressId}
                >
                  {isProcessingOrder ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </span>
                      {t("checkout.processing")}
                    </span>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {t("checkout.placeOrder")}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {t("checkout.termsNotice")}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* New Address Modal */}
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
    </>
  );
};

export default CheckoutPage;
