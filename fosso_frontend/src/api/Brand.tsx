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