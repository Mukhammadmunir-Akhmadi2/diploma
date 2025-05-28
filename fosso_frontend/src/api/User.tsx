import type {
  UserDetailedDTO,
  UserBriefDTO,
  UserProfileDTO,
  Address,
  PasswordChangeRequest,
  UserDTO,
  UserUpdateDTO
} from "../types/user";
import { type ErrorResponse } from "../types/error";
import apiClient from "./ApiClient";
import type { ImageDTO } from "../types/image";

const baseUrl = "user";

// Get user profile by ID
export async function getUserProfileById(userId: string): Promise<UserDetailedDTO> {
  try {
    const response = await apiClient.get<UserDetailedDTO>(
      `${baseUrl}/${userId}/profile`
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get brief user info by ID
export async function getUserById(userId: string): Promise<UserBriefDTO> {
  try {
    const response = await apiClient.get<UserBriefDTO>(`${baseUrl}/${userId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get current user
export async function getCurrentUser(): Promise<UserDTO> {
  try {
    const response = await apiClient.get<UserDTO>(`${baseUrl}/me`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get current user profile
export async function getCurrentUserProfile(): Promise<UserProfileDTO> {
  try {
    const response = await apiClient.get<UserProfileDTO>(
      `${baseUrl}/me/profile`
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update current user profile
export async function updateCurrentUser(
  userDetails: Partial<UserUpdateDTO>
): Promise<UserProfileDTO> {
  try {
    const response = await apiClient.put<UserProfileDTO>(
      `${baseUrl}/me`,
      userDetails
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Delete current user
export async function deleteUser(): Promise<{ message: string }> {
  try {
    const response = await apiClient.delete<{ message: string }>(
      `${baseUrl}/me`
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get current user addresses
export async function getCurrentUserAddresses(): Promise<Address[]> {
  try {
    const response = await apiClient.get<Address[]>(`${baseUrl}/me/address`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Add a new address for the current user
export async function addCurrentUserAddress(addressDTO: Address): Promise<Address> {
  try {
    const response = await apiClient.post<Address>(
      `${baseUrl}/me/address`,
      addressDTO
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Update current user address
export async function updateCurrentUserAddress(addressDTO: Address): Promise<Address> {
  try {
    const response = await apiClient.put<Address>(
      `${baseUrl}/me/address`,
      addressDTO
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

export async function deleteUserAddress(addressId: string): Promise<string> {
  try {
    const response = await apiClient.delete<string>(
      `${baseUrl}/me/address/${addressId}`
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get current user avatar
export async function getAvatar(): Promise<ImageDTO> {
  try {
    const response = await apiClient.get<ImageDTO>(`${baseUrl}/me/avatar`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Upload avatar
export async function uploadAvatar(file: File): Promise<ImageDTO> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ImageDTO>(
      `${baseUrl}/me/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Change password
export async function changePassword(
  request: PasswordChangeRequest
): Promise<string> {
  try {
    const response = await apiClient.put<string>(
      `${baseUrl}/me/password`,
      request,
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}
