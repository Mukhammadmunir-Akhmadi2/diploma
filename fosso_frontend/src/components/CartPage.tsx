import { useEffect, useState } from "react";
import { Link, useNavigate, type ErrorResponse } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLanguage } from "../hooks/useLanguage";
import { useToast } from "../hooks/useToast";
import { type CartItemDTO, type CartResponse } from "../types/cart";
import { useAppSelector } from "../store/hooks";
import {
  getCartItems,
  removeProductFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../api/Cart";
import { Spin } from "antd";

const CartPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [cartItems, setCartItems] = useState<CartResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchCardtItems = async () => {
      try {
        const items = await getCartItems(user.userId);
        setCartItems(items);
      } catch (error) {
        const response = error as ErrorResponse;
        if (response?.status === 404) {
          setCartItems(undefined);
          toast({
            title: t("cart.empty"),
            description: t("cart.emptyDesc"),
          });
        } else {
          console.error("Error fetching cart items:", error);
          toast({
            title: t("cart.error"),
            description: t("cart.errorDesc"),
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchCardtItems();
    }
  }, []);

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
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          {t("cart.title")}
        </h1>

        {cartItems && cartItems?.cartItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-24 h-24 bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img
                      src={`data:${item.productImage.contentType};base64,${item.productImage.base64Data}`}
                      alt={item.productName}
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
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity + 1)
                          }
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

            {/* Order Summary */}
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
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCartHandler}
              >
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
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
              <ShoppingBag className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {t("cart.empty")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t("cart.emptyDesc")}
            </p>
            <Button asChild>
              <Link to="/">{t("cart.startShopping")}</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
