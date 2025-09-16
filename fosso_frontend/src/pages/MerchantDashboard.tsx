import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { useLanguage } from "../hooks/useLanguage";
import ProductStats from "../components/ProductStats";
import ProductsList from "../components/ProductsList";
import { Button } from "../components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import { useAppSelector } from "../store/hooks";
import { getMerchantProducts } from "../api/merchant/MerchantProduct";
import type { PaginatedResponse } from "../types/paginatedResponse";
import type { ProductMerchantDTO } from "../types/product";
import { Spin } from "antd";
import type { ErrorResponse } from "../types/error";

// This is a mock function that would be replaced by real auth

const MerchantDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const [paginatedProducts, setPaginatedProducts] =
    useState<PaginatedResponse<ProductMerchantDTO>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || !user.userId) return;

      setIsLoading(true);
      try {
        const response = await getMerchantProducts(page, 8);
        setPaginatedProducts(response);
      } catch (err) {
        const errorResponse: ErrorResponse = err as ErrorResponse;
        console.error("Error fetching products:", errorResponse);
        if (errorResponse.status === 404) {
          toast({
            title: t("merchant.noProducts"),
            description: t("merchant.noProductsDesc", {
              defaultValue: "No products found for your account.",
            }),
          });
        } else {
          toast({
            title: t("error.fetchProduct", {
              defaultValue: "Error Fetching Products",
            }),
            description: t("error.tryAgain", {
              defaultValue: "Please try again later.",
            }),
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  const [activeProducts, inactiveProducts] = React.useMemo(() => {
    let active = 0;
    let inactive = 0;

    paginatedProducts?.products.forEach((product) => {
      if (product.enabled) {
        active++;
      } else {
        inactive++;
      }
    });

    return [active, inactive];
  }, [paginatedProducts]);

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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {t("merchant.dashboard")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t("merchant.dashboardDesc")}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
            <Button asChild className="md:ml-2">
              <Link to="/merchant/ordered-products">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t("merchant.viewOrders")}
              </Link>
            </Button>
            <Button asChild>
              <Link to="/merchant/create-product">
                <Plus className="mr-2 h-4 w-4" />
                {t("merchant.createProduct")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <ProductStats
              activeProducts={activeProducts}
              inactiveProducts={inactiveProducts}
            />
          </div>
          <div className="lg:col-span-9">
            {paginatedProducts ? (
              <ProductsList
                paginatedProducts={paginatedProducts}
                setPaginatedProducts={setPaginatedProducts}
                page={page}
                setPage={setPage}
              />
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                {t("merchant.noProducts", {
                  defaultValue: "No products available.",
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MerchantDashboard;
