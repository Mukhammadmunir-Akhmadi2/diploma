import apiClient from "../ApiClient";
import type { BrandDTO } from "../../types/brand";
import type { ErrorResponse } from "../../types/error";
import type { PaginatedResponse } from "../../types/paginatedResponse";

// Update a brand
export async function updateBrand(
  brandId: string,
  brandDTO: BrandDTO
): Promise<BrandDTO> {
  try {
    const response = await apiClient.put<BrandDTO>(
      `/admin/brands/${brandId}`,
      brandDTO
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Delete a brand
export async function deleteBrand(brandId: string): Promise<void> {
  try {
    await apiClient.delete(`/admin/brands/${brandId}`);
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update brand enabled status
export async function updateBrandEnabledStatus(
  brandId: string,
  enabled: boolean
): Promise<string> {
  try {
    const response = await apiClient.put<string>(
      `/admin/brands/${brandId}/enabled`,
      null,
      {
        params: { enabled },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get all disabled brands
export async function getAllDisabledBrands(): Promise<BrandDTO[]> {
  try {
    const response = await apiClient.get<BrandDTO[]>("/admin/brands/disabled");
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Fetch paginated brands
export async function listBrandsByPage(
  keyword?: string | null,
  page?: number ,
  size?: number,
  sort?: string,
): Promise<PaginatedResponse<BrandDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<BrandDTO>>(
      "/admin/brands/page",
      {
        params: {
          keyword: keyword || "",
          page,
          size,
          sort,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}
