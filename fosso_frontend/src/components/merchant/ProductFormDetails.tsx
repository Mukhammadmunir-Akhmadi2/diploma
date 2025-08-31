import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

interface ProductDetailsProps {
  details: { key: string; value: string }[];
  setDetails: React.Dispatch<React.SetStateAction<{ key: string; value: string }[]>>
}

const ProductFormDetails: React.FC<ProductDetailsProps> = ({details, setDetails}) => {
    const { t } = useLanguage();

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

    return (
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
    );
}

export default ProductFormDetails;