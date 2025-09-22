import type { Gender } from "./enums";

export interface FilterOptions {
  priceRange: [number | undefined, number | undefined];
  selectedColor: string | null;
  selectedBrand: string | null;
  selectedGender: Gender | null;
}
