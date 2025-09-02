import { useAppDispatch } from "./hooks";
import { setUser, setToken, setAvatar } from "../slices/authSlice";
import { getCurrentUser, getAvatar } from "../api/User";
import type { AuthResponse } from "../types/auth";
import type { ImageDTO } from "../types/image";

export const useLoginHandler = () => {
  const dispatch = useAppDispatch();

  const handleLoginSuccess = async (data: AuthResponse) => {
    dispatch(setToken(data.accessToken));

    const userDetails = await getCurrentUser();
    dispatch(setUser(userDetails));

    const avatar: ImageDTO = await getAvatar();
    dispatch(setAvatar(avatar));
  };

  return { handleLoginSuccess };
};
