import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import { Button } from "../../components/ui/button";
import type { Address } from "../../types/user";
import { getCurrentUserAddresses } from "../../api/User";
import { getCartItems } from "../../api/Cart";
import type { CartItemDTO } from "../../types/cart";
import { useAppSelector } from "../../store/hooks";

import type { PaymentMethod } from "../../types/enums";
import { Spin } from "antd";
import CheckoutAddressSection from "./CheckoutAddressSection";
import CheckoutPaymentSection from "./CheckoutPaymentSection";
import CheckoutDeliverySection from "./CheckoutDeliverySection";
import CheckoutSummary from "./CheckoutSummary";
import AddressModal from "./AddressModal";

const CheckoutPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItemDTO[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((addr) => addr.isDefault)?.addressId ||
      addresses[0]?.addressId ||
      ""
  );

  const user = useAppSelector((state) => state.auth.user);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CASH_ON_DELIVERY");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
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
            <CheckoutAddressSection
              user={user}
              addresses={addresses}
              setAddresses={setAddresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              setIsAddressModalOpen={setIsAddressModalOpen}
            />
            {/* Payment Method Section */}
            <CheckoutPaymentSection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            {/* Delivery Method */}
            <CheckoutDeliverySection shippingCost={shippingCost} />
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <CheckoutSummary
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              paymentMethod={paymentMethod}
              cartItems={cartItems}
              shippingCost={shippingCost}
              total={total}
              subtotal={subtotal}
              estimatedTax={estimatedTax}
            />
          </div>
        </div>
      </div>

      {/* New Address Modal */}
      <AddressModal
        addresses={addresses}
        setAddresses={setAddresses}
        setSelectedAddressId={setSelectedAddressId}
        isAddressModalOpen={isAddressModalOpen}
        setIsAddressModalOpen={setIsAddressModalOpen}
      />
    </>
  );
};

export default CheckoutPage;
