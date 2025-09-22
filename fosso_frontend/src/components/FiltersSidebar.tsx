import React from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { useLanguage } from "../hooks/useLanguage";
import type { Gender } from "../types/enums";
import type { BrandDTO } from "../types/brand";
import type { FilterOptions } from "../types/filter";

const colors = [
  { id: "1", name: "Black", hex: "#000000" },
  { id: "2", name: "White", hex: "#FFFFFF" },
  { id: "3", name: "Red", hex: "#FF0000" },
  { id: "4", name: "Blue", hex: "#0000FF" },
  { id: "5", name: "Green", hex: "#00FF00" },
  { id: "6", name: "Yellow", hex: "#FFFF00" },
  { id: "7", name: "Brown", hex: "#A52A2A" },
  { id: "8", name: "Deep Ice", hex: "#A2C6E4" },
  { id: "9", name: "Marine", hex: "#3B9C9C" },
  { id: "10", name: "Marsh", hex: "#6B8E23" },
  { id: "11", name: "Dark Marsh", hex: "#556B2F" },
  { id: "12", name: "Vanilla", hex: "#F3E5AB" },
  { id: "13", name: "Lavender", hex: "#E6E6FA" },
  { id: "14", name: "Coral", hex: "#FF7F50" },
  { id: "15", name: "Peach", hex: "#FFE5B4" },
  { id: "16", name: "Charcoal", hex: "#36454F" },
  { id: "17", name: "Mint", hex: "#98FF98" },
  { id: "18", name: "Teal", hex: "#008080" },
  { id: "19", name: "Rose", hex: "#FFC0CB" },
  { id: "20", name: "Olive", hex: "#808000" },
  { id: "21", name: "Slate", hex: "#708090" },
  { id: "22", name: "Ivory", hex: "#FFFFF0" },
  { id: "23", name: "Plum", hex: "#8E4585" },
  { id: "24", name: "Copper", hex: "#B87333" },
  { id: "25", name: "Taupe", hex: "#483C32" },
  { id: "26", name: "Ecru", hex: "#C2B280" },
];

interface FiltersSidebarProps {
  brands: BrandDTO[];
  pendingFilters: FilterOptions;
  setPendingFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setAppliedFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  brands,
  pendingFilters,
  setPendingFilters,
  setAppliedFilters,
  setPage,
}) => {
  const { t } = useLanguage();

  const handleApplyFilters = () => {
    setAppliedFilters(pendingFilters);
    setPage(1);
  };

  const handleGenderChange = (gender: Gender | null) => {
    setPendingFilters((prev) => ({
      ...prev,
      selectedGender: gender,
    }));
  };

  const clearFilters = () => {
    setPendingFilters((perv) => ({
      ...perv,
      selectedBrand: null,
      priceRange: [undefined, undefined],
      selectedColor: null,
      selectedGender: null,
    }));
    setAppliedFilters((perv) => ({
      ...perv,
      selectedBrand: null,
      priceRange: [undefined, undefined],
      selectedColor: null,
      selectedGender: null,
    }));
    setPage(1);
  };

  return (
    <div className="md:w-64 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {t("products.filter")}
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={clearFilters}
          >
            {t("products.clear")}
          </Button>
        </div>

        {/* Gender filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Gender
          </h3>
          <div className="flex gap-2">
            <Button
              variant={
                pendingFilters.selectedGender === "FEMALE"
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                handleGenderChange(
                  pendingFilters.selectedGender === "FEMALE" ? null : "FEMALE"
                )
              }
            >
              Women
            </Button>
            <Button
              variant={
                pendingFilters.selectedGender === "MALE" ? "default" : "outline"
              }
              size="sm"
              onClick={() =>
                handleGenderChange(
                  pendingFilters.selectedGender === "MALE" ? null : "MALE"
                )
              }
            >
              Men
            </Button>
          </div>
        </div>

        {/* Price range filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("products.price")}
          </h3>
          <Slider
            value={[
              pendingFilters.priceRange[0] || 0,
              pendingFilters.priceRange[1] || null,
            ]}
            min={0}
            max={1000}
            step={25}
            onValueChange={(value) =>
              setPendingFilters((perv) => ({
                ...perv,
                priceRange: value as [number, number],
              }))
            }
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>${pendingFilters.priceRange[0]}</span>
            <span>${pendingFilters.priceRange[1]}</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Brand filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("products.brand")}
          </h3>
          <div className="relative">
            <select
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
              value={pendingFilters.selectedBrand || ""}
              onChange={(e) =>
                setPendingFilters((perv) => ({
                  ...perv,
                  selectedBrand: e.target.value || null,
                }))
              }
            >
              <option value="">{t("products.allBrands")}</option>
              {brands.map((brand) => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Color filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("products.color")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  pendingFilters.selectedColor === color.name
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                style={{
                  backgroundColor: color.hex,
                  cursor: "pointer",
                }}
                onClick={() =>
                  setPendingFilters((perv) => ({
                    ...perv,
                    selectedColor: color.name,
                  }))
                }
                title={color.name}
              >
                {pendingFilters.selectedColor === color.name && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <Button className="w-full" onClick={handleApplyFilters}>
          {t("products.apply")}
        </Button>
      </div>
    </div>
  );
};

export default FiltersSidebar;
