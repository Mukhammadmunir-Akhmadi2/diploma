import apiClient from "../ApiClient";
import { type Category } from "../../types/category";
import { type ErrorResponse } from "../../types/error";

const baseUrl = "merchant/categories";

// Save a new category
export async function saveCategory(category: Category): Promise<Category> {
    try {
      const response = await apiClient.post<Category>(`${baseUrl}/save`, category);
      return response.data;
    } catch (error: any) {
      const errorResponse: ErrorResponse = error.response?.data;
      throw errorResponse;
    }
  }
  
  // Check if category name is unique
export async function checkUnique(
    id: string | undefined,
    name: string
  ): Promise<string> {
    try {
      const response = await apiClient.get<string>(`${baseUrl}/check_unique`, {
        params: { id, name },
      });
      return response.data;
    } catch (error: any) {
      const errorResponse: ErrorResponse = error.response?.data;
      throw errorResponse;
    }
  }