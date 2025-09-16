import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import type {
  ProductDetailedDTO,
  ProductVariantDTO,
} from "../../types/product";

interface ProductSizeSelectorProps {
  product: ProductDetailedDTO;
  availableSizes: string[];
  selectedVariant: ProductVariantDTO | null;
  setSelectedVariant: React.Dispatch<
    React.SetStateAction<ProductVariantDTO | null>
  >;
}

const ProductSizeSelector: React.FC<ProductSizeSelectorProps> = ({
  product,
  availableSizes,
  selectedVariant,
  setSelectedVariant,
}) => {
  const { t } = useLanguage();

  const handleSizeChange = (size: string) => {
    // Update selected variant based on the selected size
    const matchingVariant = product?.productVariants?.find(
      (variant) =>
        variant.color === selectedVariant?.color && variant.size === size
    );
    setSelectedVariant(matchingVariant || null);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        {t("product.size")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <button
            key={size}
            className={`w-10 h-10 flex items-center justify-center border rounded-md ${
              selectedVariant?.size === size
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                : "border-gray-300 dark:border-gray-700"
            }`}
            onClick={() => handleSizeChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSizeSelector;