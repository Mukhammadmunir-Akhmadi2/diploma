import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import EntityImage from "../../components/EntityImage";
import { type CartItemDTO, type CartResponse } from "../../types/cart";
import { removeProductFromCart, updateCartItemQuantity } from "../../api/Cart";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";

export interface CartItemProps {
  cartItems: CartResponse;
  setCartItems: React.Dispatch<React.SetStateAction<CartResponse | undefined>>;
}

const CartItems: React.FC<CartItemProps> = ({ cartItems, setCartItems }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const updatedItem: CartItemDTO = await updateCartItemQuantity(
        id,
        newQuantity
      );
      setCartItems((prevItems) => {
        if (!prevItems) return prevItems;

        const updatedCartItems = prevItems.cartItems.map((item) =>
          item.cartId === updatedItem.cartId
            ? { ...item, quantity: newQuantity }
            : item
        );

        return {
          ...prevItems,
          cartItems: updatedCartItems,
          totalItems: updatedCartItems.reduce(
            (total, item) => total + item.quantity,
            0
          ),
          totalAmount: updatedCartItems.reduce(
            (total, item) => total + item.unitPrice * item.quantity,
            0
          ),
        };
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: t("cart.error"),
        description: t("cart.errorDesc"),
        variant: "destructive",
      });
    }
  };

  const removeItem = async (cartId: string) => {
    try {
      await removeProductFromCart(cartId); // Backend call to remove the item

      setCartItems((prevItems) => {
        if (!prevItems) return prevItems;

        const updatedCartItems = prevItems.cartItems.filter(
          (item) => item.cartId !== cartId
        );

        return {
          ...prevItems,
          cartItems: updatedCartItems,
          totalItems: updatedCartItems.reduce(
            (total, item) => total + item.quantity,
            0
          ),
          totalAmount: updatedCartItems.reduce(
            (total, item) => total + item.unitPrice * item.quantity,
            0
          ),
        };
      });

      toast({
        title: t("cart.itemRemoved"),
        description: t("cart.itemRemovedDesc"),
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: t("cart.error"),
        description: t("cart.errorDesc"),
        variant: "destructive",
      });
    }
  };
  return (
    <div className="md:col-span-2 space-y-4">
      {cartItems.cartItems.map((item) => (
        <div
          key={item.cartId}
          className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {/* Product Image */}
          <div className="w-full sm:w-24 h-24 bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            <EntityImage
              imageId={item.productMainImgId}
              imageType="PRODUCT_IMAGE_MAIN"
              name={item.productName}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div>
                <Link
                  to={`/product/${item.cartId}`}
                  className="font-medium text-gray-900 dark:text-white hover:underline"
                >
                  {item.productName}
                </Link>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.brandName}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {item.size && (
                    <span className="mr-2">
                      {t("cart.size")}: {item.size}
                    </span>
                  )}
                  {item.color && (
                    <span>
                      {t("cart.color")}: {item.color}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right mt-2 sm:mt-0">
                <div className="font-medium text-gray-900 dark:text-white">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ${item.unitPrice.toFixed(2)} each
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              {/* Quantity controls */}
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-3 py-1">{item.quantity}</span>
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Remove button */}
              <button
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 flex items-center"
                onClick={() => removeItem(item.cartId)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="text-sm">{t("cart.remove")}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
