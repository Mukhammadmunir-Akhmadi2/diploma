import React, { useState } from "react";
import { UserRound, Upload } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useToast } from "../hooks/useToast";
import { setAvatar } from "../slices/authSlice";
import { useAppDispatch } from "../hooks/hooks";
import { uploadAvatar } from "../api/User";
import type { ImageDTO } from "../types/image";

const ProfileAvatar: React.FC<{ avatar: ImageDTO | null }> = ({ avatar }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isHovering, setIsHovering] = useState(false);
  const dispatch = useAppDispatch();
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: t("profile.avatarTooLarge"),
        description: t("profile.avatarSizeLimit"),
        variant: "destructive",
      });
      return;
    }

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      toast({
        title: t("profile.invalidFileType"),
        description: t("profile.acceptedImageTypes"),
        variant: "destructive",
      });
      return;
    }

    const avatar: ImageDTO = await uploadAvatar(file);

    dispatch(setAvatar(avatar));

    toast({
      title: t("profile.avatarUpdated"),
      description: t("profile.avatarUpdatedDesc"),
    });
  };

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="w-60 h-60 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {avatar ? (
          <img
            src={`data:${avatar.contentType};base64,${avatar.base64Data}`}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <UserRound size={40} className="text-gray-500 dark:text-gray-400" />
        )}
      </div>

      <div
        className={`absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-opacity ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
          <Upload size={20} className="text-white mb-1" />
          <span className="text-xs text-white">
            {t("profile.uploadAvatar")}
          </span>
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ProfileAvatar;
