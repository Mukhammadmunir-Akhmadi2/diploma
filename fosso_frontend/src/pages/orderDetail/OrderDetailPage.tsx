import React, { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../api/Order";
import { type OrderDetail, type OrderDetailedDTO } from "../../types/order";
import { useToast } from "../../hooks/useToast";
import { Spin } from "antd";
import { getUserById } from "../../api/User";
import { type UserBriefDTO } from "../../types/user";
import OrderSummary from "./OrderSummary";
import OrderProgress from "./OrderProgress";
import OrderDetailItem from "./OrderDetailItem";

const OrderDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderDetailedDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const orderDetails: OrderDetailedDTO = await getOrderById(id);

          const updatedOrderDetails = await Promise.all(
            orderDetails.orderDetails.map(async (item) => {
              try {
                const merchant: UserBriefDTO = await getUserById(
                  item.merchantId
                );
                return { ...item, merchant };
              } catch (error) {
                console.error(
                  `Error fetching image for product ${item.productId}:`,
                  error
                );
                return { ...item, merchant: null };
              }
            })
          );

          setOrder({ ...orderDetails, orderDetails: updatedOrderDetails });
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast({
          title: t("error.fetchOrder"),
          description: t("error.tryAgain"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  if (isLoading) {
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
    <div className="container  px-4 py-8 flex-grow">
      <div className="max-w-full">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile/orders")}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("order.backToOrders")}
          </Button>
          <h1 className="text-2xl font-bold ml-2">{t("order.details")}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <OrderSummary order={order}/>
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* Order Progress */}
              <OrderProgress order={order} />

              <h2 className="text-lg font-semibold mt-8 mb-4">
                {t("order.orderItems")}
              </h2>
              <div className="space-y-4">
                {order?.orderDetails.map((orderDetail: OrderDetail, index) => (
                  <OrderDetailItem
                    orderDetail={orderDetail}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
