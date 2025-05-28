import apiClient from "./ApiClient";
import type {
  ProductBriefDTO,
  ProductCreateDTO,
  ProductDetailedDTO,
  ProductUpdateDTO,
  ProductFilterCriteria,
  ProductMerchantDTO,
} from "../types/product";
import type { PaginatedResponse } from "../types/paginatedResponse";
import { type ErrorResponse } from "../types/error";

const baseUrl = "products";

// Get all products with filters and pagination
export async function getAllProducts(
  criteria: ProductFilterCriteria,
  page?: number,
  size?: number,
  sort?: string,
): Promise<PaginatedResponse<ProductBriefDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<ProductBriefDTO>>(
      `${baseUrl}`,
      {
        params: { ...criteria, page, size, sort },
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

// Create a new product
export async function createProduct(
  productDTO: ProductCreateDTO
): Promise<ProductMerchantDTO> {
  try {
    const response = await apiClient.post<ProductMerchantDTO>(
      `${baseUrl}`,
      productDTO
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update a product
export async function updateProduct(
  productId: string,
  productDTO: ProductUpdateDTO
): Promise<ProductMerchantDTO> {
  try {
    const response = await apiClient.put<ProductMerchantDTO>(
      `${baseUrl}/${productId}`,
      productDTO
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update product price
export async function updateProductPrice(
  productId: string,
  price: number,
  discountPrice?: number
): Promise<string> {
  try {
    const response = await apiClient.put<string>(`${baseUrl}/${productId}/price`, {
      params: { price, discountPrice },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update product enabled status
export async function updateProductEnabledStatus(
  productId: string,
  status: boolean
): Promise<string> {
  try {
    const response = await apiClient.put<string>(`${baseUrl}/${productId}/enabled/${status}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Delete a product
export async function deleteProduct(productId: string): Promise<string> {
  try {
    const response = await apiClient.delete<string>(`${baseUrl}/${productId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

export async function getMerchantProducts(
  page: number,
  size: number,
  sort?: string[]
): Promise<PaginatedResponse<ProductMerchantDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<ProductMerchantDTO>>(
      `${baseUrl}/merchant`,
      {
        params: { page, size, sort },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

export async function getMerchantProductById(
  productId: string
): Promise<ProductMerchantDTO> {
  try {
    const response = await apiClient.get<ProductMerchantDTO>(
      `${baseUrl}/merchant/${productId}`
    );
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