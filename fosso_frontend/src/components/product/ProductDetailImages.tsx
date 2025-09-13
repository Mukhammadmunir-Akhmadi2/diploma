import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductDetailedDTO } from "../../types/product";
import { useGetAllImagesForOwnerQuery } from "../../api/ImageApiSlice";
import { useToast } from "../../hooks/useToast";
import { useLanguage } from "../../hooks/useLanguage";

const ProductDetailImages: React.FC<{ product: ProductDetailedDTO }> = ({
  product,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();
  const { t } = useLanguage();
  const {
    data: mainImages,
    isError: isMainError,
    error: mainError,
  } = useGetAllImagesForOwnerQuery({
    ownerId: product.productId,
    imageType: "PRODUCT_IMAGE_MAIN",
  });

  const {
    data: additionalImages,
    isError: isAdditionalError,
    error: additionalError,
  } = useGetAllImagesForOwnerQuery({
    ownerId: product.productId,
    imageType: "PRODUCT_IMAGE",
  });

  const images = [...(mainImages ?? []), ...(additionalImages ?? [])];

  useEffect(() => {
    if (isMainError || isAdditionalError) {
      console.error(
        "Error fetching product images:",
        mainError || additionalError
      );
      toast({
        title: t("product.fetchError"),
        description: t("product.fetchErrorDesc"),
        variant: "destructive",
      });
    }
  }, [isMainError, isAdditionalError, mainError, additionalError, toast, t]);

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 aspect-[3/4] relative overflow-hidden">
        {images.length > 0 && (
          <img
            src={`data:${images[currentImageIndex].contentType};base64,${images[currentImageIndex].base64Data}`}
            alt={product?.productName}
            className="w-full h-full object-contain"
          />
        )}

        {/* Image navigation controls */}
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 dark:bg-black/70 p-2 rounded-full"
          onClick={prevImage}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 dark:bg-black/70 p-2 rounded-full"
          onClick={nextImage}
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail gallery */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={img.imageId}
            className={`flex-shrink-0 w-16 h-20 border-2 ${
              currentImageIndex === idx
                ? "border-blue-500"
                : "border-transparent"
            }`}
            onClick={() => setCurrentImageIndex(idx)}
          >
            <img
              src={`data:${img.contentType};base64,${img.base64Data}`}
              alt={`${product?.productName} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailImages;
