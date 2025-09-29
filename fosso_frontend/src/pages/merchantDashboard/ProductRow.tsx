import React, { useEffect, useState } from "react";
import type { ProductMerchantDTO } from "../../types/product";
import { Link } from "react-router-dom";
import { TableCell, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Eye, PenLine, Plus, Minus } from "lucide-react";
import { getCategoryById } from "../../api/Category";
import type { Category } from "../../types/category";
import { useToast } from "../../components/ui/use-toast";
import { useLanguage } from "../../hooks/useLanguage";
import EntityImage from "../../components/EntityImage";

const ProductRow: React.FC<{
  product: ProductMerchantDTO;
  handleUpdateStock: (id: string, variantIndex: number, change: number) => void;
  handleToggleStatus: (id: string) => void;
}> = ({ product, handleUpdateStock, handleToggleStatus }) => {
  const { toast } = useToast();
  const [category, setCategory] = useState<Category>();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const fetchedCategory = await getCategoryById(product.categoryId);
        setCategory(fetchedCategory);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast({
          title: t("error.fetchDetails", {
            defaultValue: "Error Fetching Details",
          }),
          description: t("error.tryAgain", {
            defaultValue:
              "Failed to fetch product details. Please try again later.",
          }),
          variant: "destructive",
        });
      }
    };
    fetchDetails();
  }, []);
  return (
    <>
      <TableRow key={product.productId}>
        <TableCell>
          <EntityImage
            imageId={product.mainImagesId[0]}
            imageType="PRODUCT_IMAGE_MAIN"
            name={product.productName}
            className="w-25 h-25 object-contain rounded"
          />
        </TableCell>
        <TableCell className="font-medium">{product.productName}</TableCell>
        <TableCell>
          {category?.name ||
            t("merchant.loading", { defaultValue: "Loading..." })}
        </TableCell>{" "}
        <TableCell>${product.price.toFixed(2)}</TableCell>
        <TableCell>
          <div className="space-y-1">
            {product?.productVariants.map((variant, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-20">
                  {variant.color}, {variant.size}:
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleUpdateStock(product.productId, idx, -1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm w-8 text-center">
                  {variant.stockQuantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleUpdateStock(product.productId, idx, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </TableCell>
        <TableCell>
          <Switch
            checked={product.enabled}
            onCheckedChange={() => handleToggleStatus(product.productId)}
          />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-1">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/product/${product.productId}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/merchant/edit-product/${product.productId}`}>
                <PenLine className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProductRow;
