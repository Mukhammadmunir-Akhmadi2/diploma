import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { CheckCircle } from "lucide-react";
import type { OrderDetailedDTO } from "../../types/order";

const STATUSES = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

interface OrderProgressProps {
  order: OrderDetailedDTO | null;
}

const OrderProgress: React.FC<OrderProgressProps> = ({ order }) => {
  const { t } = useLanguage();

  const currentStatusIndex = Math.max(
    0,
    STATUSES.indexOf(order?.status ?? "") // -1 if not found
  );

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        {t("order.status.heading")}
      </h2>
      <div className="my-8">
        <div className="flex justify-between mb-2">
          {STATUSES.map((status, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index <= currentStatusIndex
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full mb-1 flex items-center justify-center
                  ${
                    index < currentStatusIndex
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : index === currentStatusIndex
                      ? "border-2 border-blue-600 dark:border-blue-400"
                      : "border-2 border-gray-300 dark:border-gray-600"
                  }`}
              >
                {index < currentStatusIndex && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs uppercase">
                {t(`order.status.${status.toLowerCase()}`)}
              </span>
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-blue-600 dark:bg-blue-500 transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                (currentStatusIndex / (STATUSES.length - 1)) * 100
              )}%`,
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default OrderProgress;
