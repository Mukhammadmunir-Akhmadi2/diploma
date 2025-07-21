import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { uploadImage } from "../api/Image";
import { createBrand } from "../api/merchant/MerchantBrand";
import type { BrandDTO } from "../types/brand";
import type { ImageDTO } from "../types/image";
import { useToast } from "../hooks/use-toast";

interface AddBrandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newBrand: BrandDTO) => void;
}

const AddBrandDialog: React.FC<AddBrandDialogProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDescription, setNewBrandDescription] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetStates = () => {
    setNewBrandName("");
    setNewBrandDescription("");
    setNewBrandLogo(null);
    setIsSubmitting(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewBrandLogo(e.target.files[0]);
    }
  };

  const handleCreateBrand = async () => {
    if (!newBrandName || !newBrandDescription || !newBrandLogo) return;

    setIsSubmitting(true);

    try {
      // Create the brand
      const newBrandObj: BrandDTO = {
        name: newBrandName,
        description: newBrandDescription,
        enabled: true,
      };

      const createdBrand: BrandDTO = await createBrand(newBrandObj);

      // Upload the logo
      let uploadedLogo: ImageDTO | null = null;
      if (newBrandLogo) {
        uploadedLogo = await uploadImage(
          createdBrand.brandId,
          "BRAND_IMAGE",
          newBrandLogo
        );
      }

      createdBrand.logoImageId = uploadedLogo ? uploadedLogo.imageId : "";
      onCreate(createdBrand);

      toast({
        title: t("merchant.brandCreated"),
        description: t("merchant.brandCreatedDesc"),
      });

      resetStates();
      onClose();
    } catch (error: any) {
      console.error("Error creating brand:", error);
      toast({
        title: t("merchant.errorCreatingBrand"),
        description: t("merchant.tryAgainLater"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetStates(); // Reset states when canceled
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("merchant.createNewBrand")}</DialogTitle>
          <DialogDescription>{t("merchant.createBrandDesc")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("merchant.brandName")}*
            </label>
            <Input
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder={t("merchant.brandNamePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("merchant.brandDescription")}*
            </label>
            <Input
              value={newBrandDescription}
              onChange={(e) => setNewBrandDescription(e.target.value)}
              placeholder={t("merchant.brandDescriptionPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("merchant.uploadBrandLogo")}*
            </label>

            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {newBrandLogo ? (
                  <img
                    src={URL.createObjectURL(newBrandLogo)}
                    alt="Brand logo preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Upload
                    size={30}
                    className="text-gray-500 dark:text-gray-400"
                  />
                )}
              </div>

              <div className="absolute w-20 h-20 inset-0 bg-black/60 rounded-lg flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                  <Upload size={20} className="text-white mb-1" />
                  <span className="text-xs text-white">
                    {t("merchant.uploadLogoPrompt") || "Upload Logo"}
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {newBrandLogo && (
              <div className="text-xs text-gray-600 mt-1">
                {newBrandLogo.name}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t("merchant.cancel")}
          </Button>
          <Button
            type="submit"
            onClick={handleCreateBrand}
            disabled={
              !newBrandName ||
              !newBrandDescription ||
              !newBrandLogo ||
              isSubmitting
            }
          >
            {isSubmitting ? t("merchant.creating") : t("merchant.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBrandDialog;