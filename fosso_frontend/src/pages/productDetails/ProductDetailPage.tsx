import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import { ChevronLeft } from "lucide-react";
import type { ProductVariantDTO } from "../../types/product";
import {
  useGetProductByIdQuery,
  useIncrementReviewCountMutation,
} from "../../api/ProductApiSlice";
import { getReviewByProductIdAndCustomerId } from "../../api/Review";
import type { ErrorResponse } from "../../types/error";
import { Spin } from "antd";
import { type BrandDTO } from "../../types/brand";
import { getBrandById } from "../../api/Brand";
import { useAppSelector } from "../../store/hooks";
import ProductDetailImages from "./ProductDetailImages";
import ProductColorSelector from "./ProductColorSelector";
import ProductSizeSelector from "./ProductSizeSelector";
import ProductQuantitySelector from "./ProductQuantitySelector";
import ProductTabs from "./ProductTabs";
import ReviewDialog from "../../components/ReviewDialog";
import LogInDialog from "../../components/LogInDialog";
import ProductOverview from "./ProductOverview";

const ProductDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const user = useAppSelector((state) => state.auth.user);

  const { toast } = useToast();
  const { id } = useParams();

  const [brand, setBrand] = useState<BrandDTO | null>(null);

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantDTO | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  const [quantity, setQuantity] = useState<number>(1);

  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);

  const [incrementReviewCount] = useIncrementReviewCountMutation();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(id);

  useEffect(() => {
    if (isError) {
      const errorResponse = error as ErrorResponse;
      console.error("Error fetching product:", errorResponse);
      toast({
        title: t("product.fetchError"),
        description: t("product.fetchErrorDesc"),
        variant: "destructive",
      });
      return;
    }

    const fetchProduct = async () => {
      // Fetch brand details
      if (product.brandId) {
        const brandData = await getBrandById(product.brandId);
        setBrand(brandData);
      }

      setSelectedVariant(product.productVariants[0]);
    };
    fetchProduct();
  }, [isError, error, product]);

  useEffect(() => {
    const fetchReviewAndIncementReview = async () => {
      try {
        if (id) {
          // Increment review count
          const viewedProducts = JSON.parse(
            localStorage.getItem("viewedProducts") || "[]"
          );

          if (!viewedProducts.includes(id)) {
            await incrementReviewCount(id);
            localStorage.setItem(
              "viewedProducts",
              JSON.stringify([...viewedProducts, id])
            );
          }
          if (user) {
            const userReview = await getReviewByProductIdAndCustomerId(
              id,
              user.userId
            );
            if (userReview) {
              setUserRating(userReview.rating);
              setReviewText(userReview.comment || "");
              setHasReviewed(true);
            }
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchReviewAndIncementReview();
  }, []);

  const handleStarClick = (star: number) => {
    if (hasReviewed) return; // Prevent interaction if already reviewed
    if (!user) {
      setIsLoginModalVisible(true);
      return;
    }

    setUserRating(star);
    setIsOpen(true);
  };

  if (isLoading) {
    // Show Ant Design's Spin component while loading
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin
          size="large"
          tip={t("profile.loading", { defaultValue: "Loading..." })}
        />
      </div>
    );
  }
  return (
    <>
      <ReviewDialog
        user={user}
        product={product}
        userRating={userRating}
        setUserRating={setUserRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleStarClick={handleStarClick}
      />

      <LogInDialog
        isOpen={isLoginModalVisible}
        setIsOpen={setIsLoginModalVisible}
      />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-4">
          <Link
            to="/category"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t("product.backToProducts")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <ProductDetailImages product={product} />
          {/* Product Information */}
          <div>
            <div className="mb-6">
              <ProductOverview
                product={product}
                brand={brand}
                selectedVariant={selectedVariant}
              />

              {/* Color selection */}
              <ProductColorSelector
                product={product}
                setAvailableSizes={setAvailableSizes}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                setQuantity={setQuantity}
              />
              {/* Size selection */}

              <ProductSizeSelector
                product={product}
                availableSizes={availableSizes}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
              />

              {/* Quantity and Add to Cart */}
              <ProductQuantitySelector
                user={user}
                product={product}
                selectedVariant={selectedVariant}
                quantity={quantity}
                setQuantity={setQuantity}
                setIsLoginModalVisible={setIsLoginModalVisible}
              />
            </div>

            {/* Product Details */}

            <ProductTabs
              product={product}
              hasReviewed={hasReviewed}
              userRating={userRating}
              handleStarClick={handleStarClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductDetailPage;
