import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import UserDropdown from "./UserDropdown";
import { useLanguage } from "../../hooks/useLanguage";
import type { UserDTO } from "../../types/user";
import type { ImageDTO } from "../../types/image";
import ThemeToggle from "./ThemeToggle";
import LanguageDropdown from "./LanguageDropdown";

interface HeaderDesktopProps {
  user: UserDTO | null;
  avatar: ImageDTO | null;
  gender: string | null;
  isLoggedIn: boolean;
}

const HeaderDesktop: React.FC<HeaderDesktopProps> = ({
  user,
  avatar,
  gender,
  isLoggedIn,
}) => {
  const { t } = useLanguage();

  return (
    <div className="hidden md:flex justify-between items-center px-6 py-4">
      {/* Gender Toggle Buttons - Left Side */}
      <div className="flex items-center space-x-8">
        <Link
          to="/womenswear"
          className={`uppercase font-semibold tracking-wider transition-colors ${
            gender === "women"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          {t("nav.women")}
        </Link>
        <Link
          to="/menswear"
          className={`uppercase font-semibold tracking-wider transition-colors ${
            gender === "men"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          {t("nav.men")}
        </Link>
      </div>

      {/* Logo - Centered */}
      <Link
        to="/"
        className="text-3xl font-bold tracking-widest absolute left-1/2 transform -translate-x-1/2"
      >
        FOSSO
      </Link>

      {/* Right side elements: Search, Theme, Language, Account icons */}
      <div className="flex items-center gap-5">
        {/* Theme toggle */}
        <ThemeToggle
          isMobile={false}
          className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
        />

        {/* Language switcher */}
        <LanguageDropdown
          isMobile={false}
          className="inline-flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full"
        />
        {/* User Account - Using UserDropdown component */}
        <UserDropdown user={user} isLoggedIn={isLoggedIn} avatar={avatar} />

        <Link
          to="/wishlist"
          aria-label={t("wishlist.wishlist")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full"
        >
          <Heart size={20} />
        </Link>

        <Link
          to="/cart"
          aria-label={t("basket")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full"
        >
          <ShoppingBag size={20} />
        </Link>
      </div>
    </div>
  );
};

export default HeaderDesktop;
