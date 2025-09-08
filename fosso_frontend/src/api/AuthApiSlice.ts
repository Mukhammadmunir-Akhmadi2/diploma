import type { RegisterRequest, AuthRequest, AuthResponse } from "../types/auth";
import { apiClientSlice } from "./ApiClientSlice";

export const authApiSlice = apiClientSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: (authRequest) => ({
        url: "auth/login",
        method: "POST",
        body: authRequest,
      }),
    }),
    register: builder.mutation<string, RegisterRequest>({
      query: (registerRequest) => ({
        url: "auth/register",
        method: "POST",
        body: registerRequest,
      }),
    }),
    checkEmailUnique: builder.query<string, { email: string; userId?: string }>({
        query: ({ email, userId }) => {
          const params = new URLSearchParams({ email });
          if (userId) {
            params.append("userId", userId);
          }
          return {
            url: `auth/check-email?${params.toString()}`,
          };
        },
        transformErrorResponse: (error) => {
          if (error.status === 409) {
            throw new Error("Email already exists");
          }
          return error;
        },
    }),
  }),
});
