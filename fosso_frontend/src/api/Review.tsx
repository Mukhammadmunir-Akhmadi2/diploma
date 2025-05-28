import { type ReviewDTO } from "../types/review";
import { type ErrorResponse } from "../types/error";
import { type PaginatedResponse } from "../types/paginatedResponse";
import apiClient from "./ApiClient";

const baseUrl = "reviews";

// Create a new review
export async function createReview(review: ReviewDTO): Promise<string> {
  try {
    const response = await apiClient.post<string>(`${baseUrl}`, review);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update an existing review
export async function updateReview(reviewId: string, review: ReviewDTO): Promise<string> {
  try {
    const response = await apiClient.put<string>(`${baseUrl}/${reviewId}`, review);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get reviews by customer ID
export async function getReviewsByCustomerId(customerId: string): Promise<ReviewDTO[]> {
  try {
    const response = await apiClient.get<ReviewDTO[]>(`${baseUrl}/customer/${customerId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get paginated reviews by product ID
export async function getReviewsByProductId(
  productId: string,
  page?: number,
  size?: number,
  sort?: string
): Promise<PaginatedResponse<ReviewDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<ReviewDTO>>(`${baseUrl}/product/${productId}`, {
      params: { page, size, sort },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get a review by product ID and customer ID
export async function getReviewByProductIdAndCustomerId(
  productId: string,
  customerId: string
): Promise<ReviewDTO> {
  try {
    const response = await apiClient.get<ReviewDTO>(`${baseUrl}/product/${productId}/customer/${customerId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}