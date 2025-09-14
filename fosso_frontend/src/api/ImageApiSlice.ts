import { apiClientSlice } from "./ApiClientSlice";
import type { ImageDTO } from "../types/image";
import type { ImageType } from "../types/enums";

export const imageApiSlice = apiClientSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImageById: builder.query<
      ImageDTO,
      { imageId: string; imageType: ImageType }
    >({
      query: ({ imageId, imageType }) => ({
        url: `images/user/${imageId}`,
        params: { imageType },
      }),
      providesTags: (result, error, { ownerId, imageType }) => [
        { type: "Images", id: `${ownerId}-${imageType}` },
      ],
    }),

    getImageByOwnerId: builder.query<
      ImageDTO,
      { ownerId: string; imageType: ImageType }
    >({
      query: ({ ownerId, imageType }) => ({
        url: `images/user/owner/${ownerId}`,
        params: { imageType },
      }),
      providesTags: (result, error, { ownerId, imageType }) => [
        { type: "Images", id: `${ownerId}-${imageType}` },
      ],
    }),

    getAllImagesForOwner: builder.query<
      ImageDTO[],
      { ownerId: string; imageType: ImageType }
    >({
      query: ({ ownerId, imageType }) => ({
        url: `images/user/${ownerId}/all`,
        params: { imageType },
      }),
      providesTags: (result, error, { ownerId, imageType }) => [
        { type: "Images", id: `${ownerId}-${imageType}` },
      ],
    }),

    uploadProductImages: builder.mutation<
      void,
      { productId: string; imageType: ImageType; images: File[] }
    >({
      query: ({ productId, imageType, images }) => {
        const formData = new FormData();
        images.forEach((image) => formData.append("images", image));
        formData.append("imageType", imageType);
        return {
          url: `images/merchant/products/${productId}`,
          method: "POST",
          body: formData,
        };
      },
    }),

    uploadImage: builder.mutation<
      ImageDTO,
      { ownerId: string; imageType: ImageType; file: File }
    >({
      query: ({ ownerId, imageType, file }) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("imageType", imageType);
        return {
          url: `images/merchant/${ownerId}/upload`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { ownerId, imageType }) => [
        { type: "Images", id: `${ownerId}-${imageType}` },
      ],
    }),

    deleteImageByOwnerId: builder.mutation<
      string,
      { ownerId: string; imageId: string; imageType: ImageType }
    >({
      query: ({ ownerId, imageId, imageType }) => ({
        url: `images/merchant/${ownerId}/${imageId}/delete`,
        method: "DELETE",
        params: { imageType },
      }),
      invalidatesTags: (result, error, { ownerId, imageType }) => [
        { type: "Images", id: `${ownerId}-${imageType}` },
      ],
    }),
  }),
});

export const {
  useGetAllImagesForOwnerQuery,
  useGetImageByIdQuery,
  useGetImageByOwnerIdQuery,
  useUploadImageMutation,
  useUploadProductImagesMutation,
  useDeleteImageByOwnerIdMutation,
} = imageApiSlice;
