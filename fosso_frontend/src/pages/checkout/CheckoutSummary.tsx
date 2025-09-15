import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useLanguage } from "../../hooks/useLanguage";
import { placeOrder } from "../../api/Order";
import type { CheckoutRequest } from "../../types/order";
import type { ErrorResponse } from "../../types/error";
import { useToast } from "../../hooks/useToast";
import type { Address } from "../../types/user";
import type { PaymentMethod } from "../../types/enums";
import type { CartItemDTO } from "../../types/cart";

interface CheckoutSummaryProps {
  addresses: Address[];
  selectedAddressId: string;
  paymentMethod: PaymentMethod;
  cartItems: CartItemDTO[];
  shippingCost: number;
  total: number;
  subtotal: number;
  estimatedTax: number;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  addresses,
  selectedAddressId,
  paymentMethod,
  cartItems,
  shippingCost,
  total,
  subtotal,
  estimatedTax,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

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
        description: errorResponse.message || t("checkout.orderErrorDesc"),
        variant: "destructive",
      });
      setIsProcessingOrder(false);
    }
  };

  return (
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
                <h4 className="font-medium text-sm">{item.productName}</h4>
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
              <span className="text-green-600">{t("checkout.free")}</span>
            ) : (
              <span>${shippingCost.toFixed(2)}</span>
            )}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("checkout.tax")}</span>
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
  );
};

export default CheckoutSummary;
