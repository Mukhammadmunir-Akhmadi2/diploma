import apiClient from "../ApiClient";
import type {
  AdminUserBriefDTO,
  AdminUserDetailDTO,
} from "../../types/admin/adminUser";
import type { Address, UserUpdateDTO } from "../../types/user";
import type { Role } from "../../types/enums";
import type { ErrorResponse } from "../../types/error";
import type { PaginatedResponse } from "../../types/paginatedResponse";

const baseUrl = "/admin/user";

// Get all users by page
export async function getAllUsersByPage(
  page?: number,
  size?: number,
  sort?: string
): Promise<PaginatedResponse<AdminUserBriefDTO>> {
  try {
    const response = await apiClient.get<PaginatedResponse<AdminUserBriefDTO>>(
      `${baseUrl}/page`,
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

// Search users by keyword
export async function searchUsers(
  keyword: string,
  page?: number,
  size?: number,
  sort?: string
): Promise<PaginatedResponse<AdminUserBriefDTO>> {
  try {
    const response = await apiClient.get(`${baseUrl}/search`, {
      params: { keyword, page, size, sort },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get user details by ID
export async function getUserById(userId: string): Promise<AdminUserDetailDTO> {
  try {
    const response = await apiClient.get<AdminUserDetailDTO>(`${baseUrl}/${userId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update user details
export async function updateUser(
  userId: string,
  userDetails: UserUpdateDTO
): Promise<string> {
  try {
    const response = await apiClient.put<string>(
      `${baseUrl}/${userId}`,
      userDetails
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update user address
export async function updateUserAddress(userId: string, address: Address): Promise<string> {
  try {
    const response = await apiClient.put<string>(`${baseUrl}/${userId}/address`, address);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Hard delete user
export async function deleteUser(userId: string): Promise<void> {
  try {
    await apiClient.delete(`${baseUrl}/hard-delete/${userId}`);
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Restore a deleted user
export async function restoreUser(userId: string): Promise<string> {
  try {
    const response = await apiClient.put<string>(
      `${baseUrl}/user/${userId}/restore`
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Block user
export async function blockUser(userId: string, banDuration: number): Promise<string> {
  try {
    const response = await apiClient.put<string>(`${baseUrl}/${userId}/block`, null, {
      params: { banDuration },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Unblock user
export async function unblockUser(userId: string): Promise<string> {
  try {
    const response = await apiClient.put<string>(`${baseUrl}/${userId}/unblock`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update user role
export async function updateUserRole(userId: string, role: Role): Promise<string> {
  try {
    const response = await apiClient.put<string>(`${baseUrl}/${userId}/role`, null, {
      params: { role },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}