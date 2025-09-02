import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserDTO } from "../types/user";
import type { ImageDTO } from "../types/image";

interface AuthState {
  user: UserDTO | null;
  token: string | null;
  avatar: ImageDTO | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  avatar: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDTO>) {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setAvatar: (state, action: PayloadAction<ImageDTO | null>) {
        state.avatar = action.payload;
    },
    logout: (state) => {
        state.user = null;
        state.token = null;
        state.avatar = null;
    }
  },
});


export const { setUser, setToken, setAvatar, logout } = authSlice.actions;
export default authSlice.reducer;
