import React from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Plus, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import type { ProductVariantDTO } from "../../types/product";

interface ProductVariantsProps {
  variants: ProductVariantDTO[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariantDTO[]>>;
}
const ProductFormVariants: React.FC<ProductVariantsProps> = ({
  variants,
  setVariants,
}) => {
  const { t } = useLanguage();

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("merchant.productVariants")}</h3>
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
  );
};

export default ProductFormVariants;
