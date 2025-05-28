import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import ProfileAvatar from "../../components/ProfileAvatar";
import {
  User,
  MapPin,
  CreditCard,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Package,
  Plus,
} from "lucide-react";
import type { UserProfileDTO } from "../../types/user";
import useAuthStore from "../../store/useAuthStore";
import type { ImageDTO } from "../../types/image";

const ProfileSidebar: React.FC<{ user: UserProfileDTO }> = ({ user }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const avatar: ImageDTO | null = useAuthStore((state) => state.avatar);

  const isMerchant = user.roles?.includes("MERCHANT");
  const isAdmin = user.roles.includes("ADMIN")

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const isMerchantPage = (path: string) => {
    return (
      location.pathname.includes("/merchant/") &&
      location.pathname.includes(path)
    );
  };

  const getLinkClasses = (path: string) => {
    return `flex items-center gap-3 px-4 py-3 ${
      isActiveLink(path)
        ? "bg-gray-100 dark:bg-gray-700 border-l-4 border-blue-600"
        : "hover:bg-gray-50 dark:hover:bg-gray-700"
    }`;
  };

  const getMerchantLinkClasses = (path: string) => {
    return `flex items-center gap-3 px-4 py-3 ${
      isMerchantPage(path)
        ? "bg-gray-100 dark:bg-gray-700 border-l-4 border-blue-600"
        : "hover:bg-gray-50 dark:hover:bg-gray-700"
    }`;
  };

  return (
    <div className="w-full md:w-1/4">
      <div className="flex flex-col items-center mb-8 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <ProfileAvatar avatar={avatar} />
        <h2 className="mt-4 text-xl font-bold">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          {user.roles?.map((role) => (
            <div
              key={role}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
            >
              {role}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <Link to="/profile" className={getLinkClasses("/profile")}>
          <User size={18} />
          <span className="font-medium">{t("profile.personalInfo")}</span>
        </Link>

        <Link
          to="/profile/addresses"
          className={getLinkClasses("/profile/addresses")}
        >
          <MapPin size={18} />
          <span>{t("profile.address")}</span>
        </Link>

        <Link
          to="/profile/payment"
          className={getLinkClasses("/profile/payment")}
        >
          <CreditCard size={18} />
          <span>{t("profile.payment")}</span>
        </Link>

        <Link
          to="/profile/orders"
          className={getLinkClasses("/profile/orders")}
        >
          <ShoppingBag size={18} />
          <span>{t("profile.orders")}</span>
        </Link>

        <Link
          to="/profile/wishlist"
          className={getLinkClasses("/profile/wishlist")}
        >
          <Heart size={18} />
          <span>{t("profile.wishlist")}</span>
        </Link>

        <Link
          to="/profile/settings"
          className={getLinkClasses("/profile/settings")}
        >
          <Settings size={18} />
          <span>{t("profile.settings")}</span>
        </Link>

        {isMerchant && (
          <>
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("merchant.merchantDashboard")}
              </h3>
            </div>
            <Link
              to="/merchant/dashboard"
              className={getMerchantLinkClasses("products")}
            >
              <Package size={18} />
              <span>{t("merchant.activeProducts")}</span>
            </Link>
            <Link
              to="/merchant/create-product"
              className={getMerchantLinkClasses("create-product")}
            >
              <Plus size={18} />
              <span>{t("merchant.createProduct")}</span>
            </Link>

            <Link
              to="/merchant/ordered-products"
              className={getMerchantLinkClasses("ordered-product")}
            >
              <Package size={18} />
              <span>{t("merchant.orderedProduct")}</span>
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link
              to="/admin/users"
              className={getMerchantLinkClasses("products")}
            >
              <Package size={18} />
              <span>{t("admin.adminDashboard")}</span>
            </Link>
          </>
        )}

        <Link to="/logout" className={getLinkClasses("/logout")}>
          <LogOut size={18} />
          <span>{t("profile.logout")}</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfileSidebar;
