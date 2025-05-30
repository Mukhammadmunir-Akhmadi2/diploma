import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserDTO } from "../types/user";
import type { ImageDTO } from "../types/image";

interface AuthState {
  user: UserDTO | null;
  token: string | null;
  avatar: ImageDTO | null;
  setUser: (user: UserDTO) => void;
  setToken: (token: string) => void;
  setAvatar: (avatar: ImageDTO) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem("token"),
      avatar: localStorage.getItem("avatarUrl")
        ? JSON.parse(localStorage.getItem("avatarUrl")!)
        : null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        localStorage.setItem("token", token); // Persist token in localStorage
      },
      setAvatar: (avatar: ImageDTO) => {
        set({ avatar });
        localStorage.setItem("avatarUrl", JSON.stringify(avatar));
      }, // Persist avatar URL
      logout: () => {
        set({ user: null, token: null, avatar: null });
        localStorage.removeItem("token"); // Clear token on logout
        localStorage.removeItem("avatarUrl"); // Clear avatar URL on logout
      },
    }),
    {
      name: "user-auth", // The key to store data in localStorage
    }
  )
);

export default useAuthStore;
