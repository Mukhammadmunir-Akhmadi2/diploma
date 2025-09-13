import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import type { BrandDTO } from "../types/brand";
import { listAllBrands } from "../api/Brand";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import { Spin } from "antd";
import BrandImage from "../components/BrandImage";


const BrandListingPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { gender } = useParams<{ gender?: string }>();
  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        const allBrands = await listAllBrands();
        setBrands(allBrands);
      } catch (error) {
        toast({
          title: t("brands.errorLoading"),
          description: t("brands.errorLoadingDesc"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
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
        <h1 className="text-3xl font-bold mb-8">
          {gender
            ? t(`nav.${gender}`) + " " + t("brands.title")
            : t("brands.title")}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {brands.map((brand) => (
            <Link
              to={`/brand/${brand.brandId}`}
              key={brand.brandId}
              className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 flex items-center justify-center">
                <BrandImage
                  imageId={brand.logoImageId}
                  name={brand.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h3 className="text-center font-medium">{brand.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 text-center">
                {brand.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default BrandListingPage;
