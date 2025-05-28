import apiClient from "./ApiClient";
import type {
  CartItemCreateDTO,
  CartItemDTO,
  CartResponse,
} from "../types/cart";
import { type ErrorResponse } from "../types/error";

const baseUrl = "cart";

// Get all cart items for a customer
export async function getCartItems(customerId: string): Promise<CartResponse> {
  try {
    const response = await apiClient.get<CartResponse>(`${baseUrl}/${customerId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Add a product to the cart
export async function addProductToCart(cartItem: CartItemCreateDTO): Promise<CartItemDTO> {
  try {
    const response = await apiClient.post<CartItemDTO>(`${baseUrl}/add`, cartItem);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update the quantity of a cart item
export async function updateCartItemQuantity(cartId: string, quantity: number): Promise<CartItemDTO> {
  try {
    const response = await apiClient.put<CartItemDTO>(`${baseUrl}/update`, null, {
      params: { cartId, quantity },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Remove a product from the cart
export async function removeProductFromCart(cartId: string): Promise<void> {
  try {
    await apiClient.delete(`${baseUrl}/remove`, {
      params: { cartId },
    });
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Clear the entire cart
export async function clearCart(): Promise<void> {
  try {
    await apiClient.delete(`${baseUrl}/clear`);
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}