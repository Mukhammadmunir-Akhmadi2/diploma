import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { Users, ShoppingBag, Package, ShoppingBasket } from "lucide-react";

const AdminSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();

  // Helper function to check if a link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  // Generate class names based on active status
  const getLinkClasses = (path: string) => {
    return `flex items-center gap-3 px-4 py-3 rounded-md ${
      isActiveLink(path)
        ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium"
        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
    }`;
  };

  return (
    <div className="w-full md:w-1/4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700">
          <h3 className="text-lg font-medium">{t("admin.dashboard")}</h3>
        </div>

        {/* User Management Links */}
        <div className="px-3 py-2">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 px-1 mb-2">
            {t("admin.userManagement")}
          </h4>
          <Link to="/admin/users" className={getLinkClasses("/admin/users")}>
            <Users size={18} />
            <span>{t("admin.allUsers")}</span>
          </Link>
        </div>

        {/* Product Management Links */}
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 px-1 mb-2 pt-2">
            {t("admin.productManagement")}
          </h4>
          <Link
            to="/admin/categories"
            className={getLinkClasses("/admin/categories")}
          >
            <Package size={18} />
            <span>{t("admin.categories")}</span>
          </Link>

          <Link to="/admin/brands" className={getLinkClasses("/admin/brands")}>
            <ShoppingBag size={18} />
            <span>{t("admin.brands")}</span>
          </Link>

          <Link
            to="/admin/products"
            className={getLinkClasses("/admin/products")}
          >
            <ShoppingBasket size={18} />
            <span>{t("admin.products")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
