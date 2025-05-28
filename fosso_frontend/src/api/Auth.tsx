import apiClient from "./ApiClient";
import { type ErrorResponse } from "../types/error";
import { type AuthRequest, type AuthResponse, type RegisterRequest } from "../types/auth";

const baseUrl = "auth";

// Login
export async function login(authRequest: AuthRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(`${baseUrl}/login`, authRequest);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Register
export async function register(registerRequest: RegisterRequest): Promise<string> {
  try {
    const response = await apiClient.post<string>(`${baseUrl}/register`, registerRequest);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Check if email is unique
export async function checkEmailUnique(email: string, userId?: string): Promise<string> {
  const params = new URLSearchParams({ email });
  if (userId) {
    params.append("userId", userId);
  }

  try {
    const response = await apiClient.post<string>(`${baseUrl}/check-email?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    if (error.response?.status === 409) {
      throw new Error("Email already exists");
    }
    throw errorResponse;
  }
}