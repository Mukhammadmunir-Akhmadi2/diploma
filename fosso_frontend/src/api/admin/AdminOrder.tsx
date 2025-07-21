import apiClient from "../ApiClient";
import type {
  OrderBriefDTO
} from "../../types/order";
import { type ErrorResponse } from "../../types/error";
import { type PaginatedResponse } from "../../types/paginatedResponse";

const baseUrl = "admin/orders";

// Get all orders with pagination and optional keyword
export async function getAllOrders(
  keyword: string | undefined,
  page: number = 0,
  size: number = 10,
  sort: string
): Promise<PaginatedResponse<OrderBriefDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<OrderBriefDTO>>(
      `${baseUrl}`,
      {
        params: { keyword, page, size, sort },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}
