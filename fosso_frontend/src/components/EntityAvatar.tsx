import React, { useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import type { ImageType } from "../types/enums";
import {
  useGetImageByIdQuery,
  useGetImageByOwnerIdQuery,
} from "../api/ImageApiSlice";

interface EntityAvatarProps {
  imageId?: string;
  ownerId?: string;
  imageType: ImageType;
  name: string;
  className?: string;
  onImageIdChange?: (imageId: string) => void;
}

const EntityAvatar: React.FC<EntityAvatarProps> = ({
  imageId,
  ownerId,
  imageType,
  name,
  className,
  onImageIdChange,
}) => {
  const { data: ownerImage } = useGetImageByOwnerIdQuery(
    { ownerId: ownerId ?? "", imageType },
    { skip: !ownerId }
  );

  const { data: idImage } = useGetImageByIdQuery(
    { imageId: imageId ?? "", imageType },
    { skip: !imageId }
  );

  const image = ownerImage || idImage;

  useEffect(() => {
    if (image?.imageId && onImageIdChange) {
      onImageIdChange(image.imageId);
    }
  }, [image?.imageId, onImageIdChange]);

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const src = image
    ? `data:${image.contentType};base64,${image.base64Data}`
    : undefined;
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default EntityAvatar;
