import React from "react";
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
import CategorySelect from "./CategorySelect";
import BrandSelect from "./BrandSelect";
import { useLanguage } from "../../hooks/useLanguage";
import type { ProductCreateDTO } from "../../types/product";

interface ProductFormBasicProps {
  formData: ProductCreateDTO;
  setFormData: React.Dispatch<React.SetStateAction<ProductCreateDTO>>;
}

const ProductFormBasic: React.FC<ProductFormBasicProps> = ({
  formData,
  setFormData,
}) => {
  const { t } = useLanguage();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
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
        <Label htmlFor="fullDescription">{t("merchant.fullDescription")}</Label>
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
  );
};

export default ProductFormBasic;