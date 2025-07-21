import apiClient from "../ApiClient";
import { type BrandDTO } from "../../types/brand";
import { type ErrorResponse } from "../../types/error";

const baseUrl = "merchant/brands";

// Add a category to a brand
export async function addCategoryToBrand(categoryId: string, brandId: string): Promise<string> {
    try {
      const response = await apiClient.put<string>(`${baseUrl}/${categoryId}/brand/${brandId}`);
      return response.data;
    } catch (error: any) {
      const errorResponse: ErrorResponse = error.response?.data;
      throw errorResponse;
    }
  }

  // Create a new brand
export async function createBrand(brandDTO: BrandDTO): Promise<BrandDTO> {
    try {
      const response = await apiClient.post<BrandDTO>(`${baseUrl}`, brandDTO);
      return response.data;
    } catch (error: any) {
      const errorResponse: ErrorResponse = error.response?.data;
      throw errorResponse;
    }
  }
  
// Check if brand name is unique
export async function checkBrandName(name: string, brandId?: string): Promise<string> {
    const params = new URLSearchParams({ name });
    if (brandId) {
      params.append("brandId", brandId);
    }
  
    try {
      const response = await apiClient.get<string>(`${baseUrl}/check-name?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      const errorResponse: ErrorResponse = error.response?.data;
      if (error.response?.status === 409) {
        throw new Error("Brand name already exists");
      }
      throw errorResponse;
    }
  }