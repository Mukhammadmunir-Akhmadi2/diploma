import React, { useEffect } from "react";
import {
  useGetImageByIdQuery,
  useGetImageByOwnerIdQuery,
} from "../api/ImageApiSlice";
import placeholder from "../assets/placeholder.svg";
import { cn } from "../utils/utils";
import type { ImageType } from "../types/enums";

interface EntityImageProps {
  imageId?: string;
  ownerId?: string;
  imageType: ImageType;
  name: string;
  className?: string;
  fallback?: React.ReactNode;
  onImageIdChange?: (imageId: string) => void;
}

const EntityImage: React.FC<EntityImageProps> = ({
  imageId,
  ownerId,
  imageType,
  name,
  className,
  fallback,
  onImageIdChange,
}) => {
  // Decide which query to run
  const skipOwner = !ownerId;
  const skipId = !imageId;

  const { data: ownerImage } = useGetImageByOwnerIdQuery(
    { ownerId: ownerId ?? "", imageType },
    { skip: skipOwner }
  );

  const { data: idImage } = useGetImageByIdQuery(
    { imageId: imageId ?? "", imageType },
    { skip: skipId }
  );

  const image = ownerImage || idImage;

  useEffect(() => {
    if (image?.imageId && onImageIdChange) {
      onImageIdChange(image.imageId);
    }
  }, [image?.imageId, onImageIdChange]);

  // Fallback when no image found
  if (!image) {
    return (
      <>
        {fallback ?? (
          <span className="text-xl font-bold">{name.substring(0, 2)}</span>
        )}
      </>
    );
  }
  const src = `data:${image.contentType};base64,${image.base64Data}`;

  return (
    <img
      src={src || placeholder}
      alt={name}
      className={cn("max-w-full max-h-full object-contain", className)}
    />
  );
};

export default EntityImage;
