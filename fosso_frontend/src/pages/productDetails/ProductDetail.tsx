import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import { ChevronLeft, Heart, Star, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ProductReviews from "./ProductReviews";
import type { ProductVariantDTO } from "../../types/product";
import {
  useGetProductByIdQuery,
  useIncrementReviewCountMutation,
} from "../../api/ProductApiSlice";
import type { ErrorResponse } from "../../types/error";
import { Spin } from "antd";
import type { CartItemCreateDTO } from "../../types/cart";
import { addProductToCart } from "../../api/Cart";
import { type BrandDTO } from "../../types/brand";
import { getBrandById } from "../../api/Brand";
import { type ReviewDTO } from "../../types/review";
import {
  createReview,
  getReviewByProductIdAndCustomerId,
} from "../../api/Review";
import { useAppSelector } from "../../store/hooks";
import { Modal } from "antd";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import ProductDetailImages from "./ProductDetailImages";

const ProductDetail: React.FC = () => {
  const { t } = useLanguage();
  const user = useAppSelector((state) => state.auth.user);
  const avatar = useAppSelector((state) => state.auth.avatar);

  const navigate = useNavigate();

  const { toast } = useToast();
  const { id } = useParams();

  const [brand, setBrand] = useState<BrandDTO | null>(null);

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantDTO | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  const [quantity, setQuantity] = useState(1);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);

  const [incrementReviewCount] = useIncrementReviewCountMutation();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(id);

  if (isError) {
    const errorResponse = error as ErrorResponse;
    console.error("Error fetching product:", errorResponse);
    toast({
      title: t("product.fetchError"),
      description: t("product.fetchErrorDesc"),
      variant: "destructive",
    });
  }
  useEffect(() => {
    const fetchProduct = async () => {
      // Fetch brand details
      if (product.brandId) {
        const brandData = await getBrandById(product.brandId);
        setBrand(brandData);
      }

      setSelectedVariant(product.productVariants[0]);
    };
    fetchProduct();
  }, []);

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
    setIsReviewModalVisible(true);
  };

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

  const handleSizeChange = (size: string) => {
    // Update selected variant based on the selected size
    const matchingVariant = product?.productVariants?.find(
      (variant) =>
        variant.color === selectedVariant?.color && variant.size === size
    );
    setSelectedVariant(matchingVariant || null);
  };

  const handleAddToCart = async () => {
    if (!user) {
      setIsLoginModalVisible(true);
      return;
    }
    if (!product || !selectedVariant) return;

    const cartItem: CartItemCreateDTO = {
      productId: product.productId,
      quantity,
      color: selectedVariant?.color,
      size: selectedVariant?.size,
    };
    try {
      await addProductToCart(cartItem);
      toast({
        title: t("product.addedToCart"),
        description: `${product.productName} ${t("product.addedToCartDesc")}`,
      });
    } catch (error: any) {
      const errorResponse = error as ErrorResponse;
      console.error("Error fetching product or images:", errorResponse);

      console.error("Error adding product to cart:", error);
      toast({
        title: t("product.addToCartError"),
        description: t("product.addToCartErrorDesc"),
        variant: "destructive",
      });
    }
  };

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast({
      title: isInWishlist
        ? t("product.removedFromWishlist")
        : t("product.addedToWishlist"),
      description: `${product?.productName} ${
        isInWishlist
          ? t("product.removedFromWishlistDesc")
          : t("product.addedToWishlistDesc")
      }`,
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userRating) return;

    const review: ReviewDTO = {
      productId: product?.productId || "",
      productName: product?.productName,
      rating: userRating,
      comment: reviewText,
      customerId: user.userId,
    };

    try {
      await createReview(review);
      toast({
        title: t("product.reviewSubmitted"),
        description: t("product.reviewSubmittedDesc"),
      });
      setIsReviewModalVisible(false);
      setUserRating(null);
      setReviewText("");
    } catch (error: any) {
      const errorResponse = error as ErrorResponse;
      console.error("Error submitting review:", errorResponse);
      toast({
        title: t("product.reviewError"),
        description: t("product.reviewErrorDesc"),
        variant: "destructive",
      });
    }
  };

  const handleCancelReview = () => {
    setIsReviewModalVisible(false);
    setUserRating(null);
    setReviewText("");
  };

  const handleGoToLogin = () => {
    setIsLoginModalVisible(false);
    // Redirect to the login page
    navigate("/login");
  };

  const handleCancelLogin = () => {
    setIsLoginModalVisible(false);
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
      <Modal
        title={t("product.leaveReview")}
        visible={isReviewModalVisible}
        onCancel={handleCancelReview}
        footer={null}
      >
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage
              src={`data:${avatar?.contentType};base64,${avatar?.base64Data}`}
            />
            <AvatarFallback>
              {`${user?.firstName?.charAt(0)}${user?.lastName?.charAt(
                0
              )}`.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{`${user?.firstName} ${user?.lastName}`}</h4>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              onClick={() => handleStarClick(star)}
              className={`w-6 h-6 cursor-pointer ${
                star <= (userRating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmitReview}>
          <textarea
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 mb-3 bg-white dark:bg-gray-900"
            placeholder={t("product.reviewPlaceholder")}
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Button type="submit" className="w-full">
            {t("product.submitReview")}
          </Button>
        </form>
      </Modal>

      <Modal
        title={t("auth.loginRequired")}
        visible={isLoginModalVisible}
        onCancel={handleCancelLogin}
        footer={[
          <Button key="cancel" onClick={handleCancelLogin}>
            {t("auth.cancel")}
          </Button>,
          <Button key="login" type="button" onClick={handleGoToLogin}>
            {t("auth.goToLogin")}
          </Button>,
        ]}
      >
        <p>{t("auth.loginToSubmitReview")}</p>
      </Modal>

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
                        ((product.price - product.discountPrice) /
                          product.price) *
                          100
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

              {/* Color selection */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {t("product.color")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product?.productVariants
                    ?.map((variant) => variant.color)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    ) // Unique colors
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

              {/* Size selection */}
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

              {/* Quantity and Add to Cart */}
              <div className="flex flex-wrap gap-4 mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {selectedVariant && selectedVariant?.stockQuantity > 0
                    ? `${selectedVariant.stockQuantity} ${t("product.inStock")}`
                    : t("product.outOfStock")}
                </p>
                <div className="flex border border-gray-300 dark:border-gray-700 rounded-md">
                  <button
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-3 py-2 flex items-center justify-center min-w-[40px]">
                    {quantity}
                  </span>
                  <button
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <Button
                  className="flex-grow"
                  onClick={handleAddToCart}
                  disabled={
                    !selectedVariant || selectedVariant.stockQuantity <= 0
                  }
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {t("product.addToCart")}
                </Button>

                <Button
                  variant="outline"
                  className={`w-12 ${
                    isInWishlist
                      ? "bg-pink-50 text-pink-500 border-pink-200 dark:bg-pink-900/30 dark:border-pink-800"
                      : ""
                  }`}
                  onClick={handleToggleWishlist}
                  aria-label={t("product.addToWishlist")}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isInWishlist ? "fill-pink-500 text-pink-500" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <Tabs defaultValue="description">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="description">
                    {t("product.description")}
                  </TabsTrigger>
                  <TabsTrigger value="details">
                    {t("product.details")}
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    {t("product.reviews")}
                  </TabsTrigger>
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
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductDetail;
