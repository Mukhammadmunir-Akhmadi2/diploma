import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
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
import { FileImage, Plus, Trash, Upload, X } from "lucide-react";
import CategorySelect from "./CategorySelect";
import BrandSelect from "./BrandSelect";
import type {
  ProductMerchantDTO,
  ProductUpdateDTO,
  ProductVariantDTO,
  ProductCreateDTO,
} from "../../types/product";
import type { ImageDTO } from "../../types/image";
import {
  getImageById,
  uploadImage,
  deleteImageByOwnerId,
} from "../../api/Image";
import type { UserDTO } from "../../types/user";
import type { ImageType } from "../../types/enums";
import { createProduct, updateProduct } from "../../api/Product";

interface ProductFormProps {
  onSuccess: (data: ProductMerchantDTO) => void;
  initialData?: ProductMerchantDTO;
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

  const [images, setImages] = useState<ImageDTO[]>([]);
  const [mainImage, setMainImage] = useState<ImageDTO[]>([]);
  const [imageFiles, setImageFiles] = useState<
    { id: string; file: File; type: ImageType }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      const fetchImages = async () => {
        try {
          const mainImages = await Promise.all(
            initialData.mainImagesId.map((imageId) =>
              getImageById(imageId, "PRODUCT_IMAGE_MAIN")
            )
          );
          const galleryImages = await Promise.all(
            initialData.imagesId.map((imageId) =>
              getImageById(imageId, "PRODUCT_IMAGE")
            )
          );
          setMainImage(mainImages);
          setImages(galleryImages);
        } catch (error) {
          console.error("Error fetching images:", error);
          toast({
            title: t("error.fetchImages", {
              defaultValue: "Error Fetching Images",
            }),
            description: t("error.tryAgain", {
              defaultValue: "Please try again later.",
            }),
            variant: "destructive",
          });
        }
      };

      fetchImages();
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddVariant = () => {
    setVariants([...variants, { color: "", size: "", stockQuantity: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariantDTO,
    value: string | number
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
  };

  const handleAddDetail = () => {
    setDetails([...details, { key: "", value: "" }]);
  };

  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleDetailChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedDetails = [...details];
    updatedDetails[index][field] = value;
    setDetails(updatedDetails);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "PRODUCT_IMAGE_MAIN" | "PRODUCT_IMAGE"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast({
          title: t("merchant.imageTooLarge"),
          description: t("merchant.imageSizeLimit"),
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: t("merchant.invalidFileType"),
          description: t("merchant.acceptedImageTypes"),
          variant: "destructive",
        });
        return;
      }

      if (
        type === "PRODUCT_IMAGE_MAIN" &&
        imageFiles.filter((img) => img.type === "PRODUCT_IMAGE_MAIN").length >=
          2
      ) {
        toast({
          title: t("merchant.tooManyMainImages"),
          description: t("merchant.mainImagesLimit"),
          variant: "destructive",
        });
        return;
      }
      const id = Date.now().toString();
      setImageFiles((prev) => [...prev, { id, file, type }]);
    }
  };

  const handleRemoveImageFile = async (id: string) => {
    setImageFiles((prev) => prev.filter((img) => img.id !== id));
  };
  const handleRemoveImage = async (id: string) => {
    if (initialData && images) {
      await deleteImageByOwnerId(initialData?.productId, id, "PRODUCT_IMAGE");
      setImages((prev) => prev.filter((imag) => imag.imageId !== id));
    }
  };
  const handleRemoveMainImage = async (id: string) => {
    if (initialData && mainImage) {
      await deleteImageByOwnerId(
        initialData?.productId,
        id,
        "PRODUCT_IMAGE_MAIN"
      );
      setMainImage((prev) => prev.filter((imag) => imag.imageId !== id));
    }
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
          await uploadImage(newProduct.productId, file.type, file.file);
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">{t("merchant.price")} *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  className="pl-8"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="discountPrice">
                {t("merchant.discountPrice")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  className="pl-8"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="shippingCost">{t("merchant.shippingCost")}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="shippingCost"
                  name="shippingCost"
                  type="number"
                  step="0.01"
                  className="pl-8"
                  value={formData.shippingCost}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) =>
                  handleSwitchChange("enabled", checked)
                }
              />
              <Label htmlFor="enabled" className="cursor-pointer">
                {formData.enabled
                  ? t("merchant.enabled")
                  : t("merchant.disabled")}
              </Label>
            </div>
          </div>
        </TabsContent>

        {/* Variants */}
        <TabsContent value="variants" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {t("merchant.productVariants")}
              </h3>
              <Button
                type="button"
                onClick={handleAddVariant}
                variant="outline"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("merchant.addVariant")}
              </Button>
            </div>

            {variants.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-md">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("merchant.noVariantsYet")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border rounded-md relative"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveVariant(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div>
                      <Label htmlFor={`variant-${index}-color`}>
                        {t("merchant.color")} *
                      </Label>
                      <Input
                        id={`variant-${index}-color`}
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(index, "color", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`variant-${index}-size`}>
                        {t("merchant.size")} *
                      </Label>
                      <Input
                        id={`variant-${index}-size`}
                        value={variant.size}
                        onChange={(e) =>
                          handleVariantChange(index, "size", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`variant-${index}-stock`}>
                        {t("merchant.stock")} *
                      </Label>
                      <Input
                        id={`variant-${index}-stock`}
                        type="number"
                        value={variant.stockQuantity}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "stockQuantity",
                            parseInt(e.target.value)
                          )
                        }
                        required
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Details */}
        <TabsContent value="details" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {t("merchant.productDetails")}
              </h3>
              <Button
                type="button"
                onClick={handleAddDetail}
                variant="outline"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("merchant.addDetail")}
              </Button>
            </div>

            {details.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-md">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("merchant.noDetailsYet")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {details.map((detail, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-md relative"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveDetail(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div>
                      <Label htmlFor={`detail-${index}-key`}>
                        {t("merchant.detailName")} *
                      </Label>
                      <Input
                        id={`detail-${index}-key`}
                        placeholder={t("merchant.detailNameExample")}
                        value={detail.key}
                        onChange={(e) =>
                          handleDetailChange(index, "key", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`detail-${index}-value`}>
                        {t("merchant.detailValue")} *
                      </Label>
                      <Input
                        id={`detail-${index}-value`}
                        placeholder={t("merchant.detailValueExample")}
                        value={detail.value}
                        onChange={(e) =>
                          handleDetailChange(index, "value", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Images */}
        <TabsContent value="images" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("merchant.mainImages")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t("merchant.mainImagesDesc")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Main images */}
                {mainImage.length > 0 && (
                  <>
                    {mainImage.map((image) => (
                      <div
                        key={image.imageId}
                        className="border rounded-md p-3 relative"
                      >
                        <img
                          src={`data:${image.contentType};base64,${image.base64Data}`}
                          alt="Product"
                          className="w-full h-48 object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveMainImage(image.imageId)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {imageFiles
                      .filter(
                        (imageFile) => imageFile.type === "PRODUCT_IMAGE_MAIN"
                      )
                      .map((imageFile) => (
                        <div
                          key={imageFile.id}
                          className="border rounded-md p-3 relative"
                        >
                          <img
                            src={URL.createObjectURL(imageFile.file)}
                            alt="Uploaded"
                            className="w-full h-48 object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveImageFile(imageFile.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </>
                )}
                {/* Upload slots for main images */}
                {mainImage.length < 2 && imageFiles.length < 2 && (
                  <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Label
                      htmlFor="main-image-upload"
                      className="cursor-pointer text-center"
                    >
                      <Upload className="h-12 w-12 mb-2 text-gray-400 mx-auto" />
                      <span className="block font-medium text-sm mb-1">
                        {t("merchant.uploadImage")}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t("merchant.dragOrClick")}
                      </span>
                      <Input
                        id="main-image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e, "PRODUCT_IMAGE_MAIN")
                        }
                      />
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("merchant.galleryImages")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t("merchant.galleryImagesDesc")}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Gallery images */}
                {images.length > 0 && (
                  <>
                    {images.map((image) => (
                      <div
                        key={image.imageId}
                        className="border rounded-md p-2 relative"
                      >
                        <img
                          src={`data:${image.contentType};base64,${image.base64Data}`}
                          alt="Product"
                          className="w-full h-32 object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => handleRemoveImage(image.imageId)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {imageFiles
                      .filter((imageFile) => imageFile.type === "PRODUCT_IMAGE")
                      .map((imageFile) => (
                        <div
                          key={imageFile.id}
                          className="border rounded-md p-2 relative"
                        >
                          <img
                            src={URL.createObjectURL(imageFile.file)}
                            alt="Uploaded"
                            className="w-full h-32 object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => handleRemoveImageFile(imageFile.id)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                  </>
                )}

                {/* Upload slot for gallery images */}
                <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                  <Label
                    htmlFor="gallery-image-upload"
                    className="cursor-pointer text-center"
                  >
                    <Upload className="h-8 w-8 mb-1 text-gray-400 mx-auto" />
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {t("merchant.addToGallery")}
                    </span>
                    <Input
                      id="gallery-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "PRODUCT_IMAGE")}
                    />
                  </Label>
                </div>
              </div>
            </div>
          </div>
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
