import apiClient from "./ApiClient";
import { type BrandDTO } from "../types/brand";
import { type ErrorResponse } from "../types/error";
import { type PaginatedResponse } from "../types/paginatedResponse";

const baseUrl = "brands";

// List all brands
export async function listAllBrands(): Promise<BrandDTO[]> {
  try {
    const response = await apiClient.get<BrandDTO[]>(`${baseUrl}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// List brands by page with optional keyword
export async function listBrandsByPage(
  keyword?: string | null,
  page?: number,
  size?: number,
  sort?: string
): Promise<PaginatedResponse<BrandDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<BrandDTO>>(`${baseUrl}/page`, {
      params: { keyword, page, size, sort },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// List brands by category ID
export async function listBrandsByCategoryId(categoryId: string): Promise<BrandDTO[]> {
  try {
    const response = await apiClient.get<BrandDTO[]>(`${baseUrl}/category/${categoryId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get brand by name
export async function getBrandByName(name: string): Promise<BrandDTO> {
  try {
    const response = await apiClient.get<BrandDTO>(`${baseUrl}/name/${name}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}



// Get brand by ID
export async function getBrandById(brandId: string): Promise<BrandDTO> {
  try {
    const response = await apiClient.get<BrandDTO>(`${baseUrl}/${brandId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}