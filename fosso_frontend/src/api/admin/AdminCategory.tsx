import apiClient from "../ApiClient";
import type { Category } from "../../types/category";
import type { ErrorResponse } from "../../types/error";
import type { PaginatedResponse } from "../../types/paginatedResponse";

const BASE_URL = "/admin/categories";

export const listCategoriesByPage = async (
  keyword?: string | null,
  page?: number,
  size?: number,
  sort?: string,
): Promise<PaginatedResponse<Category>> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/page`, {
      params: { keyword, page, size, sort },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
};

export const deleteCategory = async (categoryId: string): Promise<string> => {
  try {
    const response = await apiClient.delete(`${BASE_URL}/delete/${categoryId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
};

export const updateCategoryEnabledStatus = async (
  categoryId: string,
  enabled: boolean
): Promise<string> => {
  try {
    const response = await apiClient.put(
      `${BASE_URL}/enable/${categoryId}`,
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
};

export const getDisabledCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/disabled`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
};

export const mergeCategories = async (
  sourceCategoryId: string,
  targetCategoryId: string
): Promise<string> => {
  try {
    const response = await apiClient.put(`${BASE_URL}/merge`, null, {
      params: { sourceCategoryId, targetCategoryId },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
};

export const updateCategory = async (
  updatedCategory: Category
): Promise<Category> => {
  try {
    const response = await apiClient.put(`${BASE_URL}/update`, updatedCategory);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
};
