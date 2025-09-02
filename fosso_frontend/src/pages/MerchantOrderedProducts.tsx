import React from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { useLanguage } from "../hooks/useLanguage";
import OrderedProductsList from "../components/merchant/OrderedProductsList";
import { useAppSelector } from "../hooks/hooks";
// This is a mock function that would be replaced by real auth

const MerchantOrderedProducts: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const user = useAppSelector((state) => state.auth.user);
  // Check if user is authenticated and has merchant role
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.roles.includes("MERCHANT")) {
    toast({
      title: t("merchant.accessDenied"),
      description: t("merchant.notMerchant"),
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {t("merchant.orderedProducts")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t("merchant.manageOrdersDesc")}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <OrderedProductsList />
        </div>
      </div>
    </>
  );
};

export default MerchantOrderedProducts;
