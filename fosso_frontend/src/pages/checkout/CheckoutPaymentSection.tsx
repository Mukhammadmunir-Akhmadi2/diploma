import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { CreditCard } from "lucide-react";
import { Label } from "../../components/ui/label";
import { useLanguage } from "../../hooks/useLanguage";
import type { PaymentMethod } from "../../types/enums";

interface CheckoutPaymentSectionProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
}
const CheckoutPaymentSection: React.FC<CheckoutPaymentSectionProps> = ({paymentMethod, setPaymentMethod}) => {
  const { t } = useLanguage();

  return (
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
              <Label htmlFor="cod" className="font-medium cursor-pointer">
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
              <Label htmlFor="card" className="font-medium cursor-pointer">
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
  );
};

export default CheckoutPaymentSection;