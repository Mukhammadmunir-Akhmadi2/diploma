import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import { type CartResponse } from "../../types/cart";
import { useAppSelector } from "../../store/hooks";
import { getCartItems } from "../../api/Cart";
import { Spin } from "antd";
import CartItems from "./CartItems";
import type { ErrorResponse } from "../../types/error";
import CartOrderSummary from "./CartOrderSummary";

const CartPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const [cartItems, setCartItems] = useState<CartResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchCartItems = async () => {
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
      fetchCartItems();
    } else {
      setIsLoading(false);
    }
  }, []);

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
            <CartItems cartItems={cartItems} setCartItems={setCartItems} />
            {/* Order Summary */}
            <CartOrderSummary
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
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
