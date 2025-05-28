import type { Gender, Season } from "../types/enums";

export interface ProductBriefDTO {
  productId: string;
  brandId: string;
  mainImagesId: string[];
  productName: string;
  shortDescription: string;
  price: number;
  discountPrice: number;
  categoryId: string;
  rating: number;
  createdDateTime: string;
  reviewCount: number;
}


export interface ProductVariantDTO {
  color: string;
  size: string;
  stockQuantity: number;
}

export interface ProductDetailedDTO {
  productId: string;
  productName: string;
  shortDescription: string;
  fullDescription: string;
  merchantId: string;
  brandId: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  gender: Gender;
  season?: Season;
  enabled: boolean;
  reviewCount: number;
  productVariants: ProductVariantDTO[];
  mainImagesId: string[];
  imagesId: string[];
  details?: Record<string, string>;
  rating: number;
}

export interface ProductFilterCriteria {
  keyword?: string;
  categoryId?: string;
  brandId?: string;
  gender?: Gender;
  merchantId?: string;
  isNewIn?: boolean;
  color?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export interface ProductUpdateDTO {
  productId: string;
  merchantId: string;
  productName: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  brandId: string;
  price: number;
  discountPrice: number;
  shippingCost?: number;
  gender: Gender;
  season: Season;
  productVariants: ProductVariantDTO[];
  enabled: boolean;
  details: Record<string, string>;
}
export interface ProductCreateDTO {
  merchantId: string;
  productName: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  brandId: string;
  price: number;
  discountPrice?: number;
  shippingCost?: number;
  gender: Gender;
  season: Season;
  productVariants: ProductVariantDTO[];
  enabled: boolean;
  details?: Record<string, string>;
}

export interface ProductMerchantDTO {
  productId: string;
  merchantId: string;
  brandId: string;
  mainImagesId: string[];
  imagesId: string[];
  productName: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  discountPrice: number;
  shippingCost: number;
  categoryId: string;
  rating: number;
  createdDateTime: string;
  reviewCount: number;
  enabled: boolean;
  productVariants: ProductVariantDTO[];
  gender: Gender;
  season: Season;
  details: Record<string, string>;
}