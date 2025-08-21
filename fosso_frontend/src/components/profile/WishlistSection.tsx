import React, { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import ProductCard from "../../components/ProductCard";
import type { ProductBriefDTO } from "../../types/product";
import { useToast } from "../ui/use-toast";

const WishlistSection: React.FC = () => {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">{t("wishlist.title")}</h2>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.productId} className="relative">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Heart className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-500 dark:text-gray-400">
            {t("wishlist.empty")}
          </p>
          <Button className="mt-4" asChild>
            <Link to="/">{t("wishlist.continueShopping")}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default WishlistSection;
