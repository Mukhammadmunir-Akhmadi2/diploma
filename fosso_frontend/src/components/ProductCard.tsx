import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, StarHalf } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { useLanguage } from "../hooks/useLanguage";
import type { ProductBriefDTO } from "../types/product";
import placeholder from "../assets/placeholder.svg";
import { getAllImagesForOwner } from "../api/Image";
import { AspectRatio } from "./ui/aspect-ratio";
import type { ImageDTO } from "../types/image";
interface ProductCardProps {
  product: ProductBriefDTO;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mainImage, setMainImage] = useState<ImageDTO[]>();
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getAllImagesForOwner(
          product.productId,
          "PRODUCT_IMAGE_MAIN"
        );
        setMainImage(images);
      } catch (error) {
        console.error("Error fetching product images:", error);
        toast({
          title: t("error.fetchImage", {
            defaultValue: "Error Fetching Images",
          }),
          description: t("error.tryAgain", {
            defaultValue: "Please try again later.",
          }),
          variant: "destructive",
        });
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(
      wishlist.some(
        (item: ProductBriefDTO) => item.productId === product.productId
      )
    );
  }, [product.productId]);

  const discountPercentage =
    product.price && product.discountPrice
      ? Math.round(
          ((product.price - (product.discountPrice || 0)) / product.price) * 100
        )
      : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();

    let wishlist: ProductBriefDTO[] = [];
    if (localStorage.getItem("wishlist")) {
      wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    }

    const isAlreadyWishlisted = wishlist.some(
      (item) => item.productId === product.productId
    );

    let updatedWishlist: ProductBriefDTO[];
    if (isAlreadyWishlisted) {
      updatedWishlist = wishlist.filter(
        (item) => item.productId !== product.productId
      );
      setIsWishlisted(false);
    } else {
      updatedWishlist = [...wishlist, product];
      setIsWishlisted(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    toast({
      title: isAlreadyWishlisted
        ? t("product.removedFromWishlist")
        : t("product.addedToWishlist"),
      description: `${product.productName} ${
        isAlreadyWishlisted
          ? t("product.removedFromWishlistDesc")
          : t("product.addedToWishlistDesc")
      }`,
    });
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300 dark:text-gray-600"
        />
      );
    }

    return stars;
  };

  return (
    <div
      className="group relative shadow-lg flex flex-col h-full bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product/${product.productId}`} className="block">
        <div className="aspect-[3/4] overflow-hidden dark:bg-gray-800">
          <AspectRatio ratio={3 / 4}>
            <img
              src={
                mainImage
                  ? isHovered && mainImage[1] !== mainImage[0]
                    ? `data:${mainImage[1].contentType};base64,${mainImage[1].base64Data}`
                    : `data:${mainImage[0].contentType};base64,${mainImage[0].base64Data}`
                  : placeholder
              }
              alt={product.productName}
              className="h-full w-full object-contain object-center group-hover:opacity-90 transition-all duration-300"
              loading="lazy"
            />

            {discountPercentage > 0 && (
              <div className="absolute bottom-0 right-0 bg-red-500 text-white text-xs px-2 py-1">
                -{discountPercentage}%
              </div>
            )}
          </AspectRatio>

          {/* Wishlist Button */}
          <button
            className={`absolute top-2 right-2 p-1.5 rounded-full ${
              isWishlisted
                ? "bg-pink-50 dark:bg-pink-900/30"
                : "bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900"
            }`}
            aria-label={
              isWishlisted
                ? t("product.removeFromWishlist")
                : t("product.addToWishlist")
            }
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted
                  ? "text-pink-500 fill-pink-500"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            />
          </button>

          {/* New Season Tag */}
          {product.createdDateTime &&
            (() => {
              const createdDate = new Date(product.createdDateTime);
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

              if (createdDate >= oneWeekAgo) {
                return (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
                    {t("product.newSeason")}
                  </div>
                );
              }
              return null;
            })()}
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-3">
        <h2 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          <Link to={`/product/${product.productId}`}>
            {product.productName}
          </Link>
        </h2>
        {product.shortDescription && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        {/* Rating and reviews */}
        {product.rating !== undefined && (
          <div className="mt-1 flex items-center">
            <div className="flex">{renderRatingStars(product.rating)}</div>
            {product.reviewCount !== undefined && product.reviewCount > 0 && (
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price and discount */}
        <div className="mt-1 flex items-center">
          {product.discountPrice ? (
            <>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                ${product.discountPrice.toFixed(2)}
              </p>
              <p className="ml-2 text-xs text-gray-500 dark:text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="font-semibold text-sm text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
