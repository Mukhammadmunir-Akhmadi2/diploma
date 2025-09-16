import React from "react";
import { useLanguage } from "../hooks/useLanguage";
import { Package, PackageOpen } from "lucide-react";

const ProductStats: React.FC<{
  activeProducts: number;
  inactiveProducts: number;
}> = ({ activeProducts, inactiveProducts }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">{t("merchant.productStats")}</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
            <PackageOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("merchant.activeProducts")}
            </p>
            <p className="text-xl font-semibold">{activeProducts}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 mr-4">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("merchant.inactiveProducts")}
            </p>
            <p className="text-xl font-semibold">{inactiveProducts}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStats;
