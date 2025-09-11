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
import { useLanguage } from "../hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Toggle } from "./ui/toggle";
import { Input } from "./ui/input";
import CategoryMenu from "./CategoryMenu";
import BrandMenu from "./BrandMenu";
import UserDropdown from "./UserDropdown";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { toggleTheme } from "../slices/themeSlice";
import MobileMenu from "./MobileMenu";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user, avatar } = useAppSelector((state) => state.auth);
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();

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
            <MobileMenu
              user={user}
              avatar={avatar}
              gender={gender}
              setGender={setGender}
              handleSearch={handleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isLoggedIn={isLoggedIn}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
