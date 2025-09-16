import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import type {
  ProductDetailedDTO,
  ProductVariantDTO,
} from "../../types/product";

export interface ProductColorSelectorProps {
  product: ProductDetailedDTO;
  setAvailableSizes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedVariant: ProductVariantDTO | null;
  setSelectedVariant: React.Dispatch<
    React.SetStateAction<ProductVariantDTO | null>
  >;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}
const ProductColorSelector: React.FC<ProductColorSelectorProps> = ({
  product,
  setAvailableSizes,
  selectedVariant,
  setSelectedVariant,
  setQuantity,
}) => {
  const { t } = useLanguage();

  const handleColorChange = (color: string) => {
    // Update available sizes based on the selected color
    const sizesForColor =
      product?.productVariants
        ?.filter((variant) => variant.color === color)
        .map((variant) => variant.size) || [];
    setAvailableSizes(sizesForColor);

    // Reset selected variant and quantity
    const defaultVariant = product?.productVariants?.find(
      (variant) => variant.color === color && variant.size === sizesForColor[0]
    );
    setSelectedVariant(defaultVariant || null);
    setQuantity(1);
  };
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        {t("product.color")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {product?.productVariants
          ?.map((variant) => variant.color)
          .filter((value, index, self) => self.indexOf(value) === index) // Unique colors
          .map((color) => (
            <button
              key={color}
              className={`px-3 py-1 border rounded-md ${
                selectedVariant?.color === color
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              onClick={() => handleColorChange(color)}
            >
              {color}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ProductColorSelector;
