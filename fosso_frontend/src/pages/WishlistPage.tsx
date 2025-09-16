import React, { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Trash, Heart } from "lucide-react";
import type { ProductBriefDTO } from "../types/product";
import { useToast } from "../hooks/useToast";

const WishlistPage: React.FC = () => {
  const { t } = useLanguage();
  const [wishlist, setWishlist] = useState<ProductBriefDTO[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        const parsedWishlist: ProductBriefDTO[] = JSON.parse(storedWishlist);
        setWishlist(parsedWishlist);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        title: t("error.fetchProduct", {
          defaultValue: "Error Fetching Wishlist",
        }),
        description: t("error.tryAgain", {
          defaultValue: "Please try again later.",
        }),
        variant: "destructive",
      });
    }
  }, []);

  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.productId !== productId
    );
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast({
      title: t("wishlist.removed"),
      description: t("wishlist.removedDesc"),
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">{t("wishlist.title")}</h1>

        {wishlist.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div key={product.productId} className="relative group">
                  <ProductCard product={product} />
                  <button
                    onClick={() => removeFromWishlist(product.productId)}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash size={16} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={24} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">{t("wishlist.empty")}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {t("wishlist.emptyMessage")}
            </p>
            <Button asChild>
              <Link to="/">{t("wishlist.continueShopping")}</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
