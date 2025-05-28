
import React, { useState } from 'react';
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Image, Upload, Trash } from "lucide-react";
import type { BrandDTO } from '../../types/brand';
import type { ImageDTO } from '../../types/image';
import { deleteImageByOwnerId, uploadImage } from '../../api/Image';
import { updateBrand } from '../../api/admin/AdminBrand';
import { useToast } from '../ui/use-toast';

interface EditBrandModalProps {
  brand: BrandDTO;
  isOpen: boolean;
  onClose: () => void;
  onSave: (brand: BrandDTO) => void;
}

const EditBrandModal: React.FC<EditBrandModalProps> = ({ 
  brand, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [editedBrand, setEditedBrand] = useState<BrandDTO>({ ...brand });
  const [tempLogo, setTempLogo] = useState<ImageDTO | File | null>(brand.logo || null);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedBrand(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveChanges = async () => {
    try {
      let updatedLogo = tempLogo;

      // Check if the logo has changed
      if (tempLogo !== brand.logo) {
        // Delete the old logo if it exists
        if (tempLogo === null && brand.logo && brand.logo.imageId) {
          await deleteImageByOwnerId(
            brand.brandId,
            brand.logo.imageId,
            "BRAND_IMAGE"
          );
        }

        // Upload the new logo if it exists
        if (tempLogo && tempLogo instanceof File) {
          const uploadedImage = await uploadImage(
            brand.brandId,
            "BRAND_IMAGE",
            tempLogo
          );
          updatedLogo = uploadedImage;
        }
      }

      // Update the brand with the new logo
      const updatedBrand = {
        ...editedBrand,
        logo: updatedLogo,
      };

      const result = await updateBrand(brand.brandId, updatedBrand);
      onSave({ ...result, logo: updatedLogo });      toast({
        title: t("admin.brandUpdated"),
        description: t("admin.brandUpdatedDesc"),
      });
      onClose();
    } catch (error: any) {
      console.error("Error saving brand changes:", error);
      toast({
        title: t("admin.errorUpdatingBrand"),
        description: error.message || t("admin.tryAgainLater"),
        variant: "destructive",
      });
    }
  };
  
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
  
    const file = e.target.files[0];
  
    // Validate file size (limit: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t("admin.imageTooLarge"),
        description: t("admin.imageSizeLimit"),
        variant: "destructive",
      });
      return;
    }
  
    // Validate file type (must be an image)
    if (!file.type.startsWith("image/")) {
      toast({
        title: t("admin.invalidFileType"),
        description: t("admin.acceptedImageTypes"),
        variant: "destructive",
      });
      return;
    }
    setTempLogo(file);
  };
  
  const handleLogoDelete = async () => {
    setTempLogo(null);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.editBrand")}</DialogTitle>
          <DialogDescription>
            Update brand details and images.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-center mb-2">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              {tempLogo ? (
                tempLogo instanceof File ? (
                  <img
                    src={URL.createObjectURL(tempLogo)}
                    alt={editedBrand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <img
                    src={`data:${tempLogo.contentType};base64,${tempLogo.base64Data}`}
                    alt={editedBrand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                )
              ) : (
                <Image size={32} className="text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <input
              type="file"
              id="logoUpload"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("logoUpload")?.click()}
            >
              <Upload size={16} className="mr-1" />
              {t("admin.replaceBrandImage")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogoDelete}
              disabled={!tempLogo}
            >
              <Trash size={16} className="mr-1" />
              {t("admin.deleteBrandImage")}
            </Button>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">{t("product.brand")}</Label>
              <Input
                id="name"
                name="name"
                value={editedBrand.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="description">{t("admin.brandDescription")}</Label>
              <Textarea
                id="description"
                name="description"
                value={editedBrand.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSaveChanges}>{t("common.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBrandModal;
