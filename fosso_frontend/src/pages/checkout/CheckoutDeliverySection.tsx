import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Truck } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const CheckoutDeliverySection: React.FC<{ shippingCost: number }> = ({
  shippingCost,
}) => {
  const { t } = useLanguage();

  return (
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
              <h4 className="font-medium">{t("checkout.standardDelivery")}</h4>
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
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutDeliverySection;
