import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { useLanguage } from "../contexts/LanguageContext";
import ProductForm from "../components/merchant/ProductForm";
import useAuthStore from "../store/useAuthStore";
import { getMerchantProductById } from "../api/Product";
import type { ProductMerchantDTO } from "../types/product";
import { getProductById } from "../api/admin/AdminProduct";
import type { AdminProductDetailedDTO } from "../types/admin/adminProduct";
import { Spin } from "antd";

const CreateProduct: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<ProductMerchantDTO | AdminProductDetailedDTO>();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setIsLoading(false); 
        return;
      }

      try {
        if (user?.roles.includes("ADMIN")) {
          // Fetch product using admin API
          const fetchedProduct = await getProductById(id);
          setProduct(fetchedProduct);
        } else if (user?.roles.includes("MERCHANT")) {
          // Fetch product using merchant API
          const fetchedProduct = await getMerchantProductById(id);
          setProduct(fetchedProduct);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: t("error.fetchProduct", {
            defaultValue: "Error Fetching Product",
          }),
          description: t("error.tryAgain", {
            defaultValue: "Please try again later.",
          }),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (!user || !user.roles.includes("MERCHANT")) {
    toast({
      title: t("merchant.accessDenied"),
      description: t("merchant.notMerchant"),
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  const handleProductCreated = (data: ProductMerchantDTO) => {
    setProduct(data);
    toast({
      title: t("merchant.productCreated"),
      description: t("merchant.productCreatedDesc"),
    });
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          {t("merchant.createProduct")}
        </h1>
        <ProductForm
          onSuccess={handleProductCreated}
          initialData={product}
          user={user}
        />
      </div>
    </>
  );
};

export default CreateProduct;
