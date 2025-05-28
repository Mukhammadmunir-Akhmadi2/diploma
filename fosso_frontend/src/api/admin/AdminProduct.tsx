import apiClient from "../ApiClient";
import type { AdminProductBriefDTO, AdminProductDetailedDTO } from "../../types/admin/adminProduct";
import type { PaginatedResponse } from "../../types/paginatedResponse";
import type { ErrorResponse } from "../../types/error";

// Base URL for admin product endpoints
const baseUrl = "/admin/products";

// Get product by ID
export async function getProductById(productId: string): Promise<AdminProductDetailedDTO> {
  try {
    const response = await apiClient.get<AdminProductDetailedDTO>(`${baseUrl}/${productId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get disabled products
export async function getDisabledProducts(
  page: number = 1,
  size: number = 10,
  sort: string[] = ["createdDateTime,desc"]
): Promise<PaginatedResponse<AdminProductBriefDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<AdminProductBriefDTO>>(`${baseUrl}/disabled`, {
      params: { page, size, sort },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get deleted products
export async function getDeletedProducts(
  page: number = 1,
  size: number = 10,
  sort: string[] = ["createdDateTime,desc"]
): Promise<PaginatedResponse<AdminProductBriefDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<AdminProductBriefDTO>>(`${baseUrl}/deleted`, {
      params: { page, size, sort },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update product enabled status
export async function updateProductEnabledStatus(productId: string, status: boolean): Promise<string> {
  try {
    const response = await apiClient.put<string>(`${baseUrl}/${productId}/enabled/${status}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Delete product
export async function deleteProduct(productId: string): Promise<string> {
  try {
    const response = await apiClient.delete<string>(`${baseUrl}/${productId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get products by merchant
export async function getProductsByMerchant(
  merchantId: string,
  page?: number,
  size?: number,
  sort?: string
): Promise<PaginatedResponse<AdminProductBriefDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<AdminProductBriefDTO>>(`${baseUrl}/merchant/${merchantId}`, {
      params: { page, size, sort },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

//Get all products
export async function getAllProducts(
  keyword?: string | null,
  page?: number,
  size?: number,
  sort?: string,
): Promise<PaginatedResponse<AdminProductBriefDTO>> {
  try {
    const response = await apiClient.get<
      PaginatedResponse<AdminProductBriefDTO>
    >(`${baseUrl}/page`, {
      params: { keyword, page, size, sort },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

export async function restoreProduct(productId: string): Promise<string> {
  try {
    const response = await apiClient.put<string>(`${baseUrl}/${productId}/restore`)
    return response.data;
  } catch(error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}
