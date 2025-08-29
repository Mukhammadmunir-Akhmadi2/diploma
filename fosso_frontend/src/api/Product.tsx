import apiClient from "./ApiClient";
import type {
  ProductBriefDTO,
  ProductDetailedDTO,
  ProductFilterCriteria,
} from "../types/product";
import type { PaginatedResponse } from "../types/paginatedResponse";
import { type ErrorResponse } from "../types/error";

const baseUrl = "products";

// Get all products with filters and pagination
export async function getAllProducts(
  filterCriteria?: ProductFilterCriteria,
  page?: number,
  size?: number,
  sort?: string
): Promise<PaginatedResponse<ProductBriefDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<ProductBriefDTO>>(
      `${baseUrl}`,
      {
        params: { ...filterCriteria, page, size, sort },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get product by ID
export async function getProductById(productId: string): Promise<ProductDetailedDTO> {
  try {
    const response = await apiClient.get<ProductDetailedDTO>(`${baseUrl}/${productId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

export async function incrementReviewCount(productId: string): Promise<string> {
  try {
    const response = await apiClient.put<string>(`${baseUrl}/${productId}/review-count/increment`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}