import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../slices/authSlice";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Heart, Search, User } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useAppDispatch } from "../../store/hooks";
import type { UserDTO } from "../../types/user";
import type { ImageDTO } from "../../types/image";
import ThemeToggle from "./ThemeToggle";
import LanguageDropdown from "./LanguageDropdown";

interface MobileMenuProps {
  user: UserDTO | null;
  avatar: ImageDTO | null;
  gender: string | null;
  setGender: React.Dispatch<React.SetStateAction<string | null>>;
  handleSearch: (e: React.FormEvent) => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  user,
  avatar,
  gender,
  setGender,
  handleSearch,
  searchQuery,
  setSearchQuery,
  isLoggedIn,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();

  const handleGenderChange = (value: string) => {
    if (value === gender) {
      // Toggle off - show all products
      setGender(null);
      navigate("/");
    } else {
      // Set new gender filter
      setGender(value);
      navigate(`/${value}swear`);
    }
  };

  return (
    <div className="md:hidden bg-white dark:bg-gray-900 absolute w-full z-20 shadow-lg">
      <div className="flex flex-col p-4 gap-4">
        {/* Search */}
        <div className="px-2 py-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              placeholder={t("search")}
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full px-4 py-2 pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>
        </div>

        {/* User section for mobile */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {isLoggedIn && user ? (
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 dark:bg-gray-700 h-12 w-12 rounded-full flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={`data:${avatar.contentType};base64,${avatar.base64Data}`}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold">
                      {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="cursor-pointer flex items-center text-sm text-primary hover:underline p-2"
              >
                <User className="mr-2 h-4 w-4" />
                {t("account.viewProfile")}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" className="w-full">
                <Button variant="default" className="w-full">
                  {t("account.login")}
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button variant="outline" className="w-full">
                  {t("account.signUp")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Gender Toggle */}
        <div className="flex justify-center my-2">
          <ToggleGroup
            type="single"
            value={gender || ""}
            onValueChange={handleGenderChange}
          >
            <ToggleGroupItem value="women" className="px-4">
              {t("nav.women")}
            </ToggleGroupItem>
            <ToggleGroupItem value="men" className="px-4">
              {t("nav.men")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Navigation Links */}
        <Link
          to="/new-in"
          className="text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2"
        >
          {t("nav.new")}
        </Link>

        <Link
          to="/category"
          className="text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2"
        >
          {t("nav.categories")}
        </Link>

        <Link
          to="/brands"
          className="text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2"
        >
          {t("nav.brands")}
        </Link>

        <Link
          to="/trending"
          className="text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2"
        >
          {t("nav.trending")}
        </Link>

        <Link
          to="/wishlist"
          className="text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2 flex items-center gap-2"
        >
          <Heart size={18} />
          <span>{t("wishlist")}</span>
        </Link>

        {isLoggedIn && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(logout());
            }}
          >
            {t("account.logout")}
          </Button>
        )}

        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

        {/* Theme and Language */}
        <div className="flex justify-between border-t dark:border-gray-800 pt-3">
          <ThemeToggle
            isMobile={true}
            className="flex items-center gap-2 text-gray-800 dark:text-gray-300"
          />
          <LanguageDropdown
            isMobile={true}
            className="inline-flex items-center gap-2 text-gray-800 dark:text-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
