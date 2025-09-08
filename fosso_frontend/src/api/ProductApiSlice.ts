import type { PaginatedResponse } from "../types/paginatedResponse";
import type {
  ProductBriefDTO,
  ProductDetailedDTO,
  ProductFilterCriteria,
} from "../types/product";
import { apiClientSlice } from "./ApiClientSlice";

export interface GetAllProductsRequest {
  filterCriteria?: ProductFilterCriteria;
  page?: number;
  size?: number;
  sort?: string;
}

export const productApiSlice = apiClientSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<PaginatedResponse<ProductBriefDTO>,GetAllProductsRequest>({
      query: ({ filterCriteria, page, size, sort }) => ({
        url: "products",
        params: { ...filterCriteria, page, size, sort },
      }),
    }),

    getProductById: builder.query<ProductDetailedDTO, { productId: string }>({
      query: (productId) => ({
        url: `products/${productId}`,
      }),
    }),

    incrementReviewCount: builder.mutation<string, { productId: string }>({
      query: (productId) => ({
        url: `products/${productId}/review-count/increment`,
        method: "PUT",
      }),
    }),
  }),
});

export const { useGetAllProductsQuery, useGetProductByIdQuery, useIncrementReviewCountMutation} = productApiSlice;