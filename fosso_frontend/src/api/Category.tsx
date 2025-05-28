import apiClient from "./ApiClient";
import { type Category } from "../types/category";
import { type ErrorResponse } from "../types/error";
import { type PaginatedResponse } from "../types/paginatedResponse";

const baseUrl = "categories";

// List all categories
export async function listAllCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<Category[]>(`${baseUrl}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category> {
  try {
    const response = await apiClient.get<Category>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

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

// List subcategories by parent ID
export async function listSubcategories(parentId: string | null): Promise<Category[]> {
  try {
    const response = await apiClient.get<Category[]>(`${baseUrl}/parent/${parentId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// List root categories
export async function listRootCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<Category[]>(`${baseUrl}/root`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// List categories by page with optional keyword
export async function listCategoriesByPage(
  keyword?: string | null,
  page?: number,
  size?: number,
  sort?: string
): Promise<PaginatedResponse<Category>> {
  try {
    const response = await apiClient.get<PaginatedResponse<Category>>(`${baseUrl}/page`, {
      params: { keyword, page, size, sort },
    });
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

// List hierarchical categories
export async function listHierarchicalCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<Category[]>(`${baseUrl}/hierarchical`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

export async function getAboveCategories(
  parentId: string
): Promise<Category[]> {
  try {
    const response = await apiClient.get<Category[]>(
      `${baseUrl}/above/${parentId}`
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}