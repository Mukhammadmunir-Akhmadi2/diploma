import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/useToast";
import type {
  ProductBriefDTO,
  ProductDetailedDTO,
  ProductVariantDTO,
} from "../../types/product";
import type { CartItemCreateDTO } from "../../types/cart";
import { addProductToCart } from "../../api/Cart";
import type { ErrorResponse } from "../../types/error";
import type { UserDTO } from "../../types/user";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addToWishlist, removeFromWishlist } from "../../slices/wishlistSlice";

interface ProductQuantitySelectorProps {
  user: UserDTO | null;
  product: ProductDetailedDTO | null;
  selectedVariant: ProductVariantDTO | null;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  setIsLoginModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductQuantitySelector: React.FC<ProductQuantitySelectorProps> = ({
  user,
  product,
  selectedVariant,
  quantity,
  setQuantity,
  setIsLoginModalVisible,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const isInWishlist = useAppSelector((state) =>
    state.wishlist.products.some((p) => p.productId === product?.productId)
  );
  const dispatch = useAppDispatch();

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
    if (isInWishlist) {
      dispatch(removeFromWishlist(product!.productId));
    } else {
      dispatch(addToWishlist(product as ProductBriefDTO));
    }
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

  return (
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
        disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
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
  );
};

export default ProductQuantitySelector;
