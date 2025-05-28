import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const OrderConfirmationPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const {slug} = useParams();

  // In a real app, this would come from the order API/context
  const orderNumber = slug;

  return (
    <>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center my-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">
            {t("orderConfirmation.thankYou")}
          </h1>
          <p className="text-xl mb-2">{t("orderConfirmation.orderReceived")}</p>
          <p className="text-lg font-medium mb-6">
            {t("orderConfirmation.orderNumber")}: {orderNumber}
          </p>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="mb-4">{t("orderConfirmation.emailConfirmation")}</p>
              <p>
                {t("orderConfirmation.questions")}{" "}
                <a
                  href="mailto:support@fosso.com"
                  className="text-primary underline"
                >
                  {t("orderConfirmation.contactUs")}
                </a>
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              className="flex items-center"
              onClick={() => navigate("/profile/orders")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {t("orderConfirmation.viewOrders")}
            </Button>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => navigate("/")}
            >
              {t("orderConfirmation.continueShopping")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
