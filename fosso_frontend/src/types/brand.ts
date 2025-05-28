import type { ImageDTO } from "./image";

export interface BrandDTO {
  brandId?: string; 
  name: string; 
  description?: string;  
  logoImageId?: string;  
  categoryIds?: Set<string>;
  enabled: boolean; 
  logo?: ImageDTO
}