import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ProductReviews from "./ProductReviews";
import { useLanguage } from "../../hooks/useLanguage";
import { Star } from "lucide-react";
import type { ProductDetailedDTO } from "../../types/product";

interface ProductTabsProps {
  product: ProductDetailedDTO | null;
  hasReviewed: boolean;
  userRating: number | null;
  handleStarClick: (star: number) => void;
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  hasReviewed,
  userRating,
  handleStarClick,
}) => {
  const { t } = useLanguage();

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
      <Tabs defaultValue="description">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="description">
            {t("product.description")}
          </TabsTrigger>
          <TabsTrigger value="details">{t("product.details")}</TabsTrigger>
          <TabsTrigger value="reviews">{t("product.reviews")}</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-4">
          <p className="text-gray-700 dark:text-gray-300">
            {product?.fullDescription}
          </p>
        </TabsContent>

        <TabsContent value="details" className="pt-4">
          <table className="w-full text-left">
            <tbody>
              {product?.details &&
                Object.entries(product.details).map(([key, value]) => (
                  <tr
                    key={key}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="py-2 text-gray-500 dark:text-gray-400 capitalize">
                      {key}
                    </td>
                    <td className="py-2 text-gray-900 dark:text-gray-200">
                      {value}
                    </td>
                  </tr>
                ))}

              {product?.gender && (
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 text-gray-500 dark:text-gray-400">
                    {t("product.gender")}
                  </td>
                  <td className="py-2 text-gray-900 dark:text-gray-200 capitalize">
                    {product.gender}
                  </td>
                </tr>
              )}

              {product?.season && (
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 text-gray-500 dark:text-gray-400">
                    {t("product.season")}
                  </td>
                  <td className="py-2 text-gray-900 dark:text-gray-200">
                    {product.season}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="reviews" className="pt-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {t("product.leaveReview")}
            </h3>
            <div className="flex items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  aria-label={`Rate ${star} stars`}
                  disabled={hasReviewed}
                  className={`cursor-pointer ${
                    hasReviewed ? "cursor-not-allowed" : ""
                  }`}
                >
                  <Star
                    className={`w-6 h-6 cursor-pointer ${
                      star <= (userRating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Reviews Component */}
          {product?.productId && (
            <ProductReviews
              productId={product?.productId}
              averageRating={product?.rating || 0}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductTabs;
