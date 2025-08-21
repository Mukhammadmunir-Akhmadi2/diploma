import React, { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Plus, Search } from "lucide-react";
import { Dialog, DialogTrigger } from "../../components/ui/dialog";
import type { BrandDTO } from "../../types/brand";
import { listAllBrands } from "../../api/Brand";
import { useToast } from "../ui/use-toast";
import AddBrandDialog from "../AddBrandDialog";

interface BrandSelectProps {
  brandId: string | null;
  onChange: (brandId: string) => void;
}

const BrandSelect: React.FC<BrandSelectProps> = ({ brandId, onChange }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [selectBrand, setSelectBrand] = useState<BrandDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);

    const fetchAllBrands = async () => {
      try {
        const allBrands = await listAllBrands();
        setBrands(allBrands);

        if (brandId) {
          const selected =
            allBrands.find((brand) => brand.brandId === brandId) || null;
          setSelectBrand(selected);
        } else {
          setSelectBrand(null);
        }
      } catch (error) {
        console.error("Error fetching all brands:", error);
        toast({
          title: t("error.fetchBrands", {
            defaultValue: "Error Fetching Brands",
          }),
          description: t("error.tryAgain", {
            defaultValue: "Please try again later.",
          }),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBrands();
  }, []);

  const filteredBrands = searchQuery
    ? brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : brands;

  const handleBrandChange = (brandId: string) => {
    const selected = brands.find((brand) => brand.brandId === brandId) || null;
    setSelectBrand(selected);
    onChange(brandId);
  };

  const handleCreateBrand = async (brandNew: BrandDTO) => {
    setBrands((prev) => [...prev, brandNew]);
    setSelectBrand(brandNew);

    setIsDialogOpen(false);

    onChange(brandNew.brandId);
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Select
          value={brandId || selectBrand?.brandId}
          onValueChange={handleBrandChange}
          disabled={isLoading}
        >
          <SelectTrigger className="flex-grow">
            <SelectValue
              placeholder={t("merchant.selectBrand")}
              defaultValue={selectBrand?.name || ""}
            />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <div className="mb-2 p-2">
              <div className="flex items-center border rounded-md px-3 py-1">
                <Search className="h-4 w-4 mr-2 text-gray-500" />
                <Input
                  placeholder={t("merchant.searchBrands")}
                  className="border-0 p-0 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <SelectItem key={brand.brandId} value={brand.brandId}>
                  {brand.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-4 text-center text-sm text-gray-500">
                {t("merchant.noBrandsFound")}
              </div>
            )}
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <AddBrandDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onCreate={handleCreateBrand}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default BrandSelect;
