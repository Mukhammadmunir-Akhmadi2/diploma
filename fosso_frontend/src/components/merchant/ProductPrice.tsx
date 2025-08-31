import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useLanguage } from "../../hooks/useLanguage";
import type { ProductCreateDTO } from "../../types/product";

interface ProductPriceProps {
    formData: ProductCreateDTO
    setFormData: React.Dispatch<React.SetStateAction<ProductCreateDTO>>;
}
const ProductPrice: React.FC<ProductPriceProps> = ({
  formData,
  setFormData,
}) => {
  const { t } = useLanguage();
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
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
        <Label htmlFor="discountPrice">{t("merchant.discountPrice")}</Label>
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
          onCheckedChange={(checked) => handleSwitchChange("enabled", checked)}
        />
        <Label htmlFor="enabled" className="cursor-pointer">
          {formData.enabled ? t("merchant.enabled") : t("merchant.disabled")}
        </Label>
      </div>
    </div>
  );
};

export default ProductPrice;
