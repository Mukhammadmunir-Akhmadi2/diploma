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
import { saveCategory } from "../api/merchant/MerchantCategory";
import type { Category } from "../types/category";
import type { ImageDTO } from "../types/image";
import { useToast } from "../hooks/use-toast";

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newCategory: Category) => void;
  parentCategoryId?: string | null;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  isOpen,
  onClose,
  onCreate,
  parentCategoryId = null,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryLogo, setNewCategoryLogo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetStates = () => {
    setNewCategoryName("");
    setNewCategoryLogo(null);
    setIsSubmitting(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCategoryLogo(e.target.files[0]);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;

    setIsSubmitting(true);

    try {
      const createdCategory = await saveCategory({
        name: newCategoryName,
        parentId: parentCategoryId,
      });

      let uploadedLogo: ImageDTO | null = null;
      if (newCategoryLogo) {
        uploadedLogo = await uploadImage(
          createdCategory.categoryId,
          "CATEGORY_IMAGE",
          newCategoryLogo
        );
      }

      createdCategory.imageId = uploadedLogo?.imageId || null;

      onCreate(createdCategory);

      toast({
        title: t("merchant.categoryCreated"),
        description: t("merchant.categoryCreatedDesc"),
      });

      resetStates();
      onClose();
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast({
        title: t("merchant.errorCreatingCategory"),
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
          <DialogTitle>{t("merchant.createNewCategory")}</DialogTitle>
          <DialogDescription>
            {t("merchant.createCategoryDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder={t("merchant.categoryName")}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("merchant.uploadCategoryLogo")}
            </label>

            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {newCategoryLogo ? (
                  <img
                    src={URL.createObjectURL(newCategoryLogo)}
                    alt="Category logo preview"
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

            {newCategoryLogo && (
              <div className="text-xs text-gray-600 mt-1">
                {newCategoryLogo.name}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t("merchant.cancel")}
          </Button>
          <Button
            onClick={handleCreateCategory}
            disabled={!newCategoryName || isSubmitting}
          >
            {isSubmitting ? t("merchant.creating") : t("merchant.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;