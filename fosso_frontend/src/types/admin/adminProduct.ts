import type { BrandDTO } from "../brand";
import type { Category } from "../category";
import type { Gender, Season } from "../enums";
import type { ImageDTO } from "../image";
import type { ProductVariantDTO } from "../product";
import type { UserBriefDTO } from "../user";

export interface AdminProductBriefDTO {
  productId: string;
  productName: string;
  shortDescription: string;
  merchantId: string;
  brandId: string;
  categoryId: string;
  enabled: boolean;
  price: number;
  discountPrice: number;
  gender: Gender;
  mainImagesId: string[];
  rating?: number | null;
  isDeleted: boolean;
  reviewCount: number;
  createdDateTime: string;
  category?: Category;
  image?: ImageDTO;
  brand?: BrandDTO;
  merchant?: UserBriefDTO;
}

export interface AdminProductDetailedDTO {
  productId: string;
  productName: string;
  shortDescription: string;
  fullDescription: string;
  merchantId: string;
  brandId: string;
  categoryId: string;
  price: number;
  discountPrice: number;
  shippingCost: number;
  gender: Gender;
  season: Season;
  reviewCount: number;
  productVariants: ProductVariantDTO[];
  mainImagesId: string[];
  imagesId: string[];
  details: Record<string, string>;
  rating: number | null;
  createdDateTime: string;
  updatedDateTime: string;
  enabled: boolean;
  isDeleted: boolean;
}
