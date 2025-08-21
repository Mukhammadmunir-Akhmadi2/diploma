import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { ChevronRight, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/useToast";
import type { BrandDTO } from "../types/brand";
import { listAllBrands } from "../api/Brand";
interface BrandMenuProps {
  selectedGender?: "men" | "women" | null;
  onClick?: () => void;
}

const BrandMenu: React.FC<BrandMenuProps> = ({
  selectedGender = null,
  onClick,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [brands, setBrands] = useState<BrandDTO[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await listAllBrands();
        setBrands(response);
      } catch (error) {
        toast({
          title: t("error.fetchBrands"),
          description: t("error.tryAgain"),
          variant: "destructive",
        });
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle brand click
  const handleBrandClick = (brand: BrandDTO) => {
    const genderPath = selectedGender ? `/${selectedGender}` : "";
    navigate(`${genderPath}/brand/${brand.brandId}`);
    setIsOpen(false);
  };

  // Function to split list into columns
  const renderBrandsInColumns = () => {
    if (brands.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          {t("nav.noBrandsFound")}
        </div>
      );
    }

    const columns = [];
    const columnCount = 3; // Show 3 columns
    const brandsPerColumn = Math.ceil(brands.length / columnCount);

    for (let i = 0; i < columnCount; i++) {
      const startIndex = i * brandsPerColumn;
      const endIndex = Math.min(startIndex + brandsPerColumn, brands.length);
      const columnBrands = brands.slice(startIndex, endIndex);

      if (columnBrands.length > 0) {
        columns.push(
          <div key={i} className="flex-1 min-w-[150px]">
            {columnBrands.map((brand) => (
              <button
                key={brand.brandId}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleBrandClick(brand)}
              >
                {brand.name}
              </button>
            ))}
          </div>
        );
      }
    }

    return <div className="flex gap-4 overflow-hidden">{columns}</div>;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Trigger Button */}
      <button
        className="flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        onClick={() => {
          setIsOpen(!isOpen);
          onClick();
        }}
        onMouseEnter={() => setIsOpen(true)}
      >
        <span>{t("nav.brands")}</span>
        <ChevronRight
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 z-50 mt-1 bg-white dark:bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 w-[500px] overflow-hidden max-h-[70vh]"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Search box */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("nav.searchBrands")}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Brand list */}
          <div className="p-2 max-h-[50vh] overflow-y-auto">
            {renderBrandsInColumns()}
          </div>

          {/* Footer with "View All Brands" link */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <Link
              to={selectedGender ? `/${selectedGender}/brands` : "/brands"}
              className="text-blue-600 hover:underline text-sm block text-center"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.viewAllBrands")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandMenu;
