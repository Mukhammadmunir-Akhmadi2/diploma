import useAuthStore from "../store/useAuthStore";
import { getCurrentUser, getAvatar } from "../api/User";
import type { AuthResponse } from "../types/auth";
import type { ImageDTO } from "../types/image";

export const useLoginHandler = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setAvatarUrl = useAuthStore((state) => state.setAvatar);

  const handleLoginSuccess = async (data: AuthResponse) => {
    setToken(data.accessToken);

    const userDetails = await getCurrentUser();
    setUser(userDetails);

    const avatar: ImageDTO = await getAvatar();
    setAvatarUrl(avatar);
  };

  return { handleLoginSuccess };
};
