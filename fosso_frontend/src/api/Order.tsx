import apiClient from "./ApiClient";
import type {
  OrderBriefDTO,
  OrderDetailedDTO,
  CheckoutRequest,
} from "../types/order";
import { type ErrorResponse } from "../types/error";
import { type PaginatedResponse } from "../types/paginatedResponse";

const baseUrl = "orders";

// Place a new order
export async function placeOrder(checkoutRequest: CheckoutRequest): Promise<string> {
  try {
    const response = await apiClient.post<string>(`${baseUrl}`, checkoutRequest);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Cancel an order
export async function cancelOrder(orderId: string, notes: string): Promise<string> {
  try {
    const response = await apiClient.delete<string>(`${baseUrl}/${orderId}`, {
      data: notes,
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Cancel a product in an order
export async function cancelProduct(
  orderId: string,
  productId: string,
  notes: string,
  color: string,
  size: string
): Promise<string> {
  try {
    const response = await apiClient.delete<string>(
      `${baseUrl}/${orderId}/product/${productId}`,
      {
        data: notes,
        params: { color, size },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}


// Get order by ID
export async function getOrderById(orderId: string): Promise<OrderDetailedDTO> {
  try {
    const response = await apiClient.get<OrderDetailedDTO>(`${baseUrl}/${orderId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get order by tracking number
export async function getOrderByTrackingNumber(trackingNumber: string): Promise<OrderBriefDTO> {
  try {
    const response = await apiClient.get<OrderBriefDTO>(`${baseUrl}/tracking/${trackingNumber}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get orders by customer ID with pagination
export async function getOrdersByCustomer(
  customerId: string,
  page?: number,
  size?: number,
  sort?: string[]
): Promise<PaginatedResponse<OrderBriefDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<OrderBriefDTO>>(`${baseUrl}/customer/${customerId}`, {
      params: { page, size, sort },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get orders by date range
export async function getOrdersByDateRange(startDate: string, endDate: string): Promise<OrderBriefDTO[]> {
  try {
    const response = await apiClient.get<OrderBriefDTO[]>(`${baseUrl}/date-range`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}