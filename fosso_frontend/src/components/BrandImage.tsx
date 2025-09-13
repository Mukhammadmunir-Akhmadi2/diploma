import React from "react";
import { useGetImageByIdQuery } from "../api/ImageApiSlice";
import placeholder from "../assets/placeholder.svg";
import { cn } from "../utils/utils";

interface BrandProps {
  imageId?: string;
  name: string;
  className?: string;
}
const BrandImage: React.FC<BrandProps> = ({ imageId, name, className }) => {
  const { data: image } = useGetImageByIdQuery({
    imageId: imageId ?? "",
    imageType: "BRAND_IMAGE",
  });

   if (!imageId || !image) {
     <img
       src={placeholder}
       alt={name}
       className={cn("max-w-full max-h-full object-contain", className)}
     />;

     return <span className="text-xl font-bold">{name.substring(0, 2)}</span>;
   }

  const logo = `data:${image.contentType};base64,${image.base64Data}`;
  return (
    <img
      src={logo}
      alt={name}
      className={cn("max-w-full max-h-full object-contain", className)}
    />
  );
};

export default BrandImage;