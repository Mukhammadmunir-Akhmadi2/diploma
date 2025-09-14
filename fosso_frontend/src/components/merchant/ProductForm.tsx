import React, { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import CategorySelect from "./CategorySelect";
import BrandSelect from "./BrandSelect";
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

 

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
          await uploadImage({ownerId: newProduct.productId, imageType: file.type, file: file.file}).unwrap();
        }
      }

      onSuccess(newProduct);
      navigate("/merchant/dashboard");
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="productName">{t("merchant.productName")} *</Label>
              <Input
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="shortDescription">
                {t("merchant.shortDescription")} *
              </Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                required
                rows={2}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="fullDescription">
                {t("merchant.fullDescription")}
              </Label>
              <Textarea
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleInputChange}
                rows={5}
              />
            </div>

            <div>
              <Label>{t("merchant.category")} *</Label>
              <CategorySelect
                categoryId={formData.categoryId}
                onChange={(id) => handleSelectChange("categoryId", id)}
              />
            </div>

            <div>
              <Label>{t("merchant.brand")} *</Label>
              <BrandSelect
                brandId={formData.brandId}
                onChange={(id) => handleSelectChange("brandId", id)}
              />
            </div>

            <div>
              <Label htmlFor="gender">{t("merchant.gender")}</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("merchant.selectGender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">{t("merchant.male")}</SelectItem>
                  <SelectItem value="FEMALE">{t("merchant.female")}</SelectItem>
                  <SelectItem value="UNISEX">{t("merchant.unisex")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="season">{t("merchant.season")}</Label>
              <Select
                value={formData.season}
                onValueChange={(value) => handleSelectChange("season", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("merchant.selectSeason")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_SEASON">
                    {t("merchant.allSeason")}
                  </SelectItem>
                  <SelectItem value="SPRING">{t("merchant.spring")}</SelectItem>
                  <SelectItem value="SUMMER">{t("merchant.summer")}</SelectItem>
                  <SelectItem value="FALL">{t("merchant.fall")}</SelectItem>
                  <SelectItem value="WINTER">{t("merchant.winter")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
          onClick={() => navigate("/merchant/dashboard")}
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
