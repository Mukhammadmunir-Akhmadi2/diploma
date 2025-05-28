import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Sun,
  Moon,
  Globe,
  Search,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Toggle } from "./ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import CategoryMenu from "./CategoryMenu";
import BrandMenu from "./BrandMenu";
import UserDropdown from "./UserDropdown";
import useAuthStore from "../store/useAuthStore";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const user = useAuthStore((state) => state.user);
  const avatar = useAuthStore((state) => state.avatar);
  const logout = useAuthStore((state) => state.logout);

  const isLoggedIn = !!user;

  useEffect(() => {
    if (
      location.pathname.includes("/womenswear") ||
      location.pathname.includes("/women/")
    ) {
      setGender("women");
    } else if (
      location.pathname.includes("/menswear") ||
      location.pathname.includes("/men/")
    ) {
      setGender("men");
    } else {
      setGender(null);
    }
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (gender === "women") {
        navigate(`/women/search/${encodeURIComponent(searchQuery.trim())}`);
      } else if (gender === "men") {
        navigate(`/men/search/${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleBrandClick = () => {
    navigate("/brands");
  };

  const handleCategoryClick = () => {
    navigate(
      gender === "women"
        ? "/women/category"
        : gender === "men"
        ? "/men/category"
        : "/category"
    );
    
  };

  
  return (
    <header className="sticky top-0 z-50">
      {/* Main Header with Logo, Search and Icons */}
      <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm">
        <div className="max-w-screen-2xl mx-auto">
          {/* Desktop Header */}
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
                onPressedChange={toggleTheme}
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
                      onClick={() =>
                        setLanguage(lang.code as "en" | "ru" | "uz")
                      }
                      className={`flex items-center gap-2 ${
                        language === lang.code
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* User Account - Using UserDropdown component */}
              <UserDropdown
                user={user}
                isLoggedIn={isLoggedIn}
                avatar={avatar}
              />

              <Link
                to="/wishlist"
                aria-label={t("wishlist")}
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

          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center px-4 py-3">
            <button onClick={toggleMobileMenu} aria-label="Menu">
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
            <Link to="/" className="text-2xl font-bold tracking-widest">
              FOSSO
            </Link>
            <Link to="/cart" aria-label={t("basket")}>
              <ShoppingBag size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-2xl mx-auto">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-between items-center px-6 py-2">
            <div className="flex items-center space-x-6">
              {/* Categories Dropdown Menu */}
              <CategoryMenu
                onClick={handleCategoryClick}
                selectedGender={gender as "women" | "men" | null}
              />

              {/* Brands Dropdown Menu */}
              <BrandMenu
                onClick={handleBrandClick}
                selectedGender={gender as "women" | "men" | null}
              />

              {/* Other Nav Links */}
              <Link
                to="/new-in"
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-gray-200 rounded-md text-sm"
              >
                {t("nav.new")}
              </Link>

              <Link
                to={
                  gender === "women"
                    ? "/women/trending"
                    : gender === "men"
                    ? "/men/trending"
                    : "/trending"
                }
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-gray-200 rounded-md text-sm"
              >
                {t("nav.trending")}
              </Link>
            </div>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder={t("search")}
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full px-4 py-1 pl-9 text-sm w-40 focus:w-56 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
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
                            {`${user.firstName.charAt(0)}${user.lastName.charAt(
                              0
                            )}`}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                        <Link
                          to="/profile"
                          className="text-sm text-primary hover:underline"
                        >
                          {t("account.viewProfile")}
                        </Link>
                      </div>
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                    className="text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2"
                  >
                    {t("account.logout")}
                  </button>
                )}

                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

                {/* Theme and Language */}
                <div className="flex justify-between border-t dark:border-gray-800 pt-3">
                  <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 text-gray-800 dark:text-gray-300"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun size={18} />
                        <span>{t("theme.light")}</span>
                      </>
                    ) : (
                      <>
                        <Moon size={18} />
                        <span>{t("theme.dark")}</span>
                      </>
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center gap-2 text-gray-800 dark:text-gray-300">
                      <Globe size={18} />
                      <span>
                        {languages.find((lang) => lang.code === language)?.name}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white dark:bg-gray-900"
                    >
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() =>
                            setLanguage(lang.code as "en" | "ru" | "uz")
                          }
                        >
                          <span className="mr-2">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
