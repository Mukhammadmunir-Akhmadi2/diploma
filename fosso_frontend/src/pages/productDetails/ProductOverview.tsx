import React from "react";
import { Star } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import type {
  ProductDetailedDTO,
  ProductVariantDTO,
} from "../../types/product";
import type { BrandDTO } from "../../types/brand";

interface ProductOverviewProps {
  product: ProductDetailedDTO;
  brand: BrandDTO;
  selectedVariant: ProductVariantDTO;
}
const ProductOverview: React.FC<ProductOverviewProps> = ({
  product,
  brand,
  selectedVariant,
}) => {
  const { t } = useLanguage();
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {product?.productName}
      </h1>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {brand?.name}
      </div>

      <div className="flex items-center mb-4">
        <div className="flex items-center mr-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(product?.rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            ({product?.reviewCount} {t("product.reviews")})
          </span>
        </div>

        <div className="text-sm text-green-600 dark:text-green-400">
          {selectedVariant && selectedVariant.stockQuantity > 0
            ? t("product.inStock")
            : t("product.outOfStock")}
        </div>
      </div>

      <div className="mb-4">
        {product?.discountPrice ? (
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.discountPrice}
            </span>
            <span className="ml-2 text-lg text-gray-500 dark:text-gray-400 line-through">
              ${product.price}
            </span>
            <span className="ml-2 text-sm text-red-500">
              {Math.round(
                ((product.price - product.discountPrice) / product.price) * 100
              )}
              % {t("product.off")}
            </span>
          </div>
        ) : (
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${product?.price}
          </span>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {product?.shortDescription}
      </p>
    </>
  );
};

export default ProductOverview;
