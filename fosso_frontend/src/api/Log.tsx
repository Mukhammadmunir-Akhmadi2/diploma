import apiClient from "./ApiClient";
import { type ActionLog } from "../types/log";
import { type ErrorResponse } from "../types/error";

const baseUrl = "admin/actions";

// Log a new action
export async function logAction(
  userId: string,
  action: string,
  resource: string,
  resourceId: string,
  details?: string
): Promise<ActionLog> {
  try {
    const response = await apiClient.post<ActionLog>(`${baseUrl}/log`, null, {
      params: { userId, action, resource, resourceId, details },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get logs by user ID
export async function getLogsByUserId(userId: string): Promise<ActionLog[]> {
  try {
    const response = await apiClient.get<ActionLog[]>(`${baseUrl}/user/${userId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get logs by resource
export async function getLogsByResource(resource: string): Promise<ActionLog[]> {
  try {
    const response = await apiClient.get<ActionLog[]>(`${baseUrl}/resource/${resource}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get all logs
export async function getAllLogs(): Promise<ActionLog[]> {
  try {
    const response = await apiClient.get<ActionLog[]>(`${baseUrl}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}