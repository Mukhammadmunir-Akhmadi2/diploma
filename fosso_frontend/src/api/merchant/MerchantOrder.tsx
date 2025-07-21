import apiClient from "../ApiClient";
import type {
  OrderDetailedDTO,
  OrderStatusUpdateRequest,
  OrderMerchantDTO,
} from "../../types/order";
import { type ErrorResponse } from "../../types/error";
import { type PaginatedResponse } from "../../types/paginatedResponse";

const baseUrl = "merchant/orders";

// Update order status
export async function updateOrderStatus(
    orderId: string,
    statusUpdate: OrderStatusUpdateRequest
  ): Promise<OrderDetailedDTO> {
    try {
      const response = await apiClient.put<OrderDetailedDTO>(`${baseUrl}/${orderId}/status`, statusUpdate);
      return response.data;
    } catch (error: any) {
      const errorResponse: ErrorResponse = error.response?.data;
      throw errorResponse;
    }
  }
  
  // Update product status in an order
  export async function updateProductStatus(
    orderId: string,
    productId: string,
    color: string,
    size: string,
    statusUpdate: OrderStatusUpdateRequest
  ): Promise<OrderDetailedDTO> {
    try {
      const response = await apiClient.put<OrderDetailedDTO>(
        `${baseUrl}/${orderId}/product/${productId}/status`,
        statusUpdate,
        {
          params: { color, size },
        }
      );
      return response.data;
    } catch (error: any) {
      const errorResponse: ErrorResponse = error.response?.data;
      throw errorResponse;
    }
  }

  // Get orders by merchant with pagination
export async function getOrdersByMerchant(
    page: number = 0,
    size: number = 10,
    sort: string = "orderDateTime,desc"
  ): Promise<PaginatedResponse<OrderMerchantDTO>> {
    try {
      const response = await apiClient.get<PaginatedResponse<OrderMerchantDTO>>(
        `${baseUrl}`,
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
