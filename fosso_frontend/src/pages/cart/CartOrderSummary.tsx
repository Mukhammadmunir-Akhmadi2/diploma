import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import type { CartResponse } from "../../types/cart";
import { clearCart } from "../../api/Cart";

export interface CartOrderSummaryProps {
  cartItems: CartResponse;
  setCartItems: React.Dispatch<React.SetStateAction<CartResponse | undefined>>;
}

const CartOrderSummary: React.FC<CartOrderSummaryProps> = ({
  cartItems,
  setCartItems,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const clearCartHandler = async () => {
    try {
      await clearCart();
      setCartItems(undefined);
      toast({
        title: t("cart.cleared"),
        description: t("cart.clearedDesc"),
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: t("cart.error"),
        description: t("cart.errorDesc"),
        variant: "destructive",
      });
    }
  };

  const getTotalItems = () => {
    return cartItems?.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const getTotalPrice = () => {
    return cartItems?.cartItems
      .reduce((total, item) => total + item.unitPrice * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {t("cart.orderSummary")}
      </h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">
            {t("cart.subtotal")}
          </span>
          <span className="text-gray-900 dark:text-white">
            ${getTotalPrice()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">
            {t("cart.shipping")}
          </span>
          <span className="text-gray-900 dark:text-white">
            {t("cart.freeShipping")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">
            {t("cart.tax")}
          </span>
          <span className="text-gray-900 dark:text-white">
            {t("cart.calculatedAtCheckout")}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
        <div className="flex justify-between font-semibold">
          <span className="text-gray-900 dark:text-white">
            {t("cart.total")}
          </span>
          <span className="text-gray-900 dark:text-white">
            ${getTotalPrice()}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {getTotalItems()}{" "}
          {getTotalItems() === 1 ? t("cart.item") : t("cart.items")}
        </div>
      </div>

      <Button className="w-full mb-4" onClick={handleCheckout}>
        <ShoppingBag className="mr-2 h-5 w-5" />
        {t("cart.checkout")}
      </Button>
      <Button variant="outline" className="w-full" onClick={clearCartHandler}>
        {t("cart.clearCart")}
      </Button>

      <div className="text-center mt-4">
        <Link
          to="/"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    </div>
  );
};

export default CartOrderSummary;
