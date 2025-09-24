import React from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Heart, ShoppingBag, Sun, Moon, Globe } from "lucide-react";
import { Toggle } from "../ui/toggle";
import { toggleTheme } from "../../slices/themeSlice";
import UserDropdown from "./UserDropdown";
import { useLanguage } from "../../hooks/useLanguage";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import type { UserDTO } from "../../types/user";
import type { ImageDTO } from "../../types/image";

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
  const { language, setLanguage, t } = useLanguage();
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  ];

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
        <Toggle
          aria-label="Toggle theme"
          pressed={theme === "dark"}
          onPressedChange={() => dispatch(toggleTheme())}
          className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </Toggle>

        {/* Language switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full">
            <Globe size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-gray-900"
          >
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code as "en" | "ru" | "uz")}
                className={`flex items-center gap-2 ${
                  language === lang.code ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
