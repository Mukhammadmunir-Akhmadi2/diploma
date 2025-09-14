import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash, Upload } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import type { ProductMerchantDTO } from "../../types/product";
import type { AdminProductDetailedDTO } from "../../types/admin/adminProduct";
import type { ImageType } from "../../types/enums";
import { useDeleteImageByOwnerIdMutation } from "../../api/ImageApiSlice";
import EntityImage from "../EntityImage";
interface ProductFormImagesProps {
  initialData?: ProductMerchantDTO | AdminProductDetailedDTO;
  imageFiles: { id: string; file: File; type: ImageType }[];
  setImageFiles: React.Dispatch<
    React.SetStateAction<{ id: string; file: File; type: ImageType }[]>
  >;
}
const ProductFormImages: React.FC<ProductFormImagesProps> = ({
  initialData,
  imageFiles,
  setImageFiles,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [deleteImageByOwnerId] = useDeleteImageByOwnerIdMutation();

  const handleRemoveImageFile = async (id: string) => {
    setImageFiles((prev) => prev.filter((img) => img.id !== id));
  };
  const handleRemoveImage = async (id: string) => {
    if (initialData) {
      await deleteImageByOwnerId({
        ownerId: initialData?.productId,
        imageId: id,
        imageType: "PRODUCT_IMAGE",
      }).unwrap();
    }
  };
  const handleRemoveMainImage = async (id: string) => {
    if (initialData) {
      await deleteImageByOwnerId({
        ownerId: initialData?.productId,
        imageId: id,
        ImageType: "PRODUCT_IMAGE_MAIN",
      }).unwrap();
    }
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
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">{t("merchant.mainImages")}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t("merchant.mainImagesDesc")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Main images */}
          {(initialData?.mainImagesId?.length > 0 || imageFiles) && (
            <>
              {initialData?.mainImagesId.map((imageId) => (
                <div key={imageId} className="border rounded-md p-3 relative">
                  <EntityImage
                    imageId={imageId}
                    imageType="PRODUCT_IMAGE_MAIN"
                    name="product"
                    className="w-full h-48 object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveMainImage(imageId)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {imageFiles
                .filter((imageFile) => imageFile.type === "PRODUCT_IMAGE_MAIN")
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
          {initialData?.mainImagesId?.length < 2 && imageFiles.length < 2 && (
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
                  onChange={(e) => handleImageUpload(e, "PRODUCT_IMAGE_MAIN")}
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
          {(initialData?.imagesId.length > 0 || imageFiles) && (
            <>
              {initialData?.imagesId.map((imageId) => (
                <div key={imageId} className="border rounded-md p-2 relative">
                  <EntityImage
                    imageId={imageId}
                    imageType="PRODUCT_IMAGE"
                    name="product"
                    className="w-full h-32 object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => handleRemoveImage(imageId)}
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
  );
};

export default ProductFormImages;
