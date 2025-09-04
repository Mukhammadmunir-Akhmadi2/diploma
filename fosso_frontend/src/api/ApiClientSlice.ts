import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import { logout } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:8080",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("Authorization", `Beaver ${token}`)
        }
        return headers;
    }
});

const baseQueryWithAuth: typeof baseQuery = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if( result.error && result.error.status === 401) {
        api.dispatch(logout);
    }

    return result
};

export const apiClientSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});
