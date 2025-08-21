import React from "react";
import { Button } from "../components/ui/button";
import { useLanguage } from "../hooks/useLanguage";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  buttonText,
  buttonLink = "/new-in",
  imageUrl = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
}) => {
  const { t } = useLanguage();

  return (
    <div className="relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt="Hero banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto flex flex-col justify-center items-center text-center py-16 md:py-24 px-6 md:px-12">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-normal mb-4 text-white">
          {title || t("hero.title")}
        </h1>

        {(subtitle || t("hero.subtitle")) && (
          <p className="text-gray-200 mb-8 max-w-2xl">
            {subtitle || t("hero.subtitle")}
          </p>
        )}

        <div className="relative">
          <Button
            className="rounded-full bg-white hover:bg-gray-100 text-black px-8 py-6 text-base font-medium shadow-lg"
            asChild
          >
            <a href={buttonLink}>{buttonText || t("hero.button")}</a>
          </Button>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
