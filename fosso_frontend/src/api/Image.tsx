import apiClient from "./ApiClient";
import { type ImageDTO } from "../types/image";
import { type ErrorResponse } from "../types/error";
import { type ImageType } from "../types/enums";

const baseUrl = "images";

// Get image by ID
export async function getImageById(
  imageId: string,
  type: ImageType
): Promise<ImageDTO> {
  try {
    const response = await apiClient.get<ImageDTO>(`${baseUrl}/${imageId}`, {
      params: { type },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get image by owner ID and type
export async function getImageByOwnerId(
  ownerId: string,
  imageType: ImageType
): Promise<ImageDTO> {
  try {
    const response = await apiClient.get<ImageDTO>(
      `${baseUrl}/owner/${ownerId}`,
      {
        params: { imageType },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Upload main images for a product
export async function uploadProductImages(
  productId: string,
  imageType: ImageType,
  images: File[]
): Promise<void> {
  try {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    formData.append("imageType", imageType);

    await apiClient.post(`${baseUrl}/products/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Upload a single image
export async function uploadImage(
  ownerId: string,
  imageType: ImageType,
  file: File
): Promise<ImageDTO> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageType", imageType);

    const response = await apiClient.post<ImageDTO>(
      `${baseUrl}/${ownerId}/upload`,
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

// Delete an image
export async function deleteImageByOwnerId(
  ownerId: string,
  imageId: string,
  type: ImageType
): Promise<string> {
  try {
    const response = await apiClient.delete(`${baseUrl}/${ownerId}/${imageId}/delete`, {
      params: { type },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

export async function deleteImageById(imageId: string): Promise<string> {
  try {
    const response = await apiClient.delete(`${baseUrl}/${imageId}`);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}

// Get all images for an owner
export async function getAllImagesForOwner(
  ownerId: string,
  type: ImageType
): Promise<ImageDTO[]> {
  try {
    const response = await apiClient.get<ImageDTO[]>(
      `${baseUrl}/${ownerId}/all`,
      {
        params: { type },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data;
    throw errorResponse;
  }
}
