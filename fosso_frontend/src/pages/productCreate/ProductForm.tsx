import React, { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import type {
  ProductMerchantDTO,
  ProductUpdateDTO,
  ProductVariantDTO,
  ProductCreateDTO,
} from "../../types/product";
import { useUploadImageMutation } from "../../api/ImageApiSlice";
import type { UserDTO } from "../../types/user";
import type { ImageType } from "../../types/enums";
import {
  createProduct,
  updateProduct,
} from "../../api/merchant/MerchantProduct";
import type { AdminProductDetailedDTO } from "../../types/admin/adminProduct";
import ProductFormPrice from "./ProductFormPrice";
import ProductFormVariants from "./ProductFormVariants";
import ProductFormDetails from "./ProductFormDetails";
import ProductFormImages from "./ProductFormImages";
import ProductFormBasic from "./ProductFormBasic";

interface ProductFormProps {
  onSuccess: (data: ProductMerchantDTO) => void;
  initialData?: ProductMerchantDTO | AdminProductDetailedDTO;
  user: UserDTO;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSuccess,
  initialData,
  user,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductCreateDTO>({
    merchantId: user.userId,
    productName: initialData?.productName || "",
    shortDescription: initialData?.shortDescription || "",
    fullDescription: initialData?.fullDescription || "",
    categoryId: initialData?.categoryId || "",
    brandId: initialData?.brandId || "",
    price: initialData?.price || 0.0,
    discountPrice: initialData?.discountPrice || 0.0,
    shippingCost: initialData?.shippingCost || 0.0,
    gender: initialData?.gender || "UNISEX",
    season: initialData?.season || "ALL_SEASON",
    productVariants: initialData?.productVariants || [],
    enabled: initialData?.enabled !== undefined ? initialData.enabled : true,
    details: initialData?.details || {},
  });

  const [variants, setVariants] = useState<ProductVariantDTO[]>(
    initialData?.productVariants || [{ color: "", size: "", stockQuantity: 0 }]
  );

  const [details, setDetails] = useState<{ key: string; value: string }[]>(
    initialData?.details
      ? Object.entries(initialData.details).map(([key, value]) => ({
          key,
          value,
        }))
      : []
  );

  const [imageFiles, setImageFiles] = useState<
    { id: string; file: File; type: ImageType }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadImage] = useUploadImageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData: ProductCreateDTO = {
        ...formData,
        details: details.reduce((acc, detail) => {
          acc[detail.key] = detail.value;
          return acc;
        }, {} as Record<string, string>),
        productVariants: variants,
      };

      let newProduct;
      if (initialData) {
        newProduct = await updateProduct(initialData.productId, {
          ...productData,
          productId: initialData.productId,
        } as ProductUpdateDTO);
      } else {
        newProduct = await createProduct(productData);
      }
      if (imageFiles) {
        for (const file of imageFiles) {
          await uploadImage({
            ownerId: newProduct.productId,
            imageType: file.type,
            file: file.file,
          }).unwrap();
        }
      }

      onSuccess(newProduct);
      if (user.roles.includes("ADMIN")) {
        navigate("/admin/products");
      } else {
        navigate("/merchant/dashboard");
      }
    } catch (error) {
      toast({
        title: t("merchant.errorSavingProduct"),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">{t("merchant.basicInfo")}</TabsTrigger>
          <TabsTrigger value="pricing">{t("merchant.pricing")}</TabsTrigger>
          <TabsTrigger value="variants">{t("merchant.variants")}</TabsTrigger>
          <TabsTrigger value="details">{t("merchant.details")}</TabsTrigger>
          <TabsTrigger value="images">{t("merchant.images")}</TabsTrigger>
        </TabsList>

        {/* Basic Info */}
        <TabsContent value="basic" className="space-y-6">
          <ProductFormBasic formData={formData} setFormData={setFormData} />
        </TabsContent>

        {/* Pricing */}
        <TabsContent value="pricing" className="space-y-6">
          <ProductFormPrice formData={formData} setFormData={setFormData} />
        </TabsContent>

        {/* Variants */}
        <TabsContent value="variants" className="space-y-6">
          <ProductFormVariants variants={variants} setVariants={setVariants} />
        </TabsContent>

        {/* Details */}
        <TabsContent value="details" className="space-y-6">
          <ProductFormDetails details={details} setDetails={setDetails} />
        </TabsContent>

        {/* Images */}
        <TabsContent value="images" className="space-y-6">
          <ProductFormImages
            initialData={initialData}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            user.roles.includes("ADMIN")
              ? navigate("/admin/product")
              : navigate("/merchant/dashboard")
          }
        >
          {t("merchant.cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("merchant.saving") : t("merchant.saveProduct")}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
