import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

interface LanguageDropdownProps {
    isMobile: boolean;
    className: string;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  isMobile,
  className,
}) => {
  const { language, setLanguage } = useLanguage();
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  ];

  const size = isMobile ? 18 : 20;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <Globe size={size} />
        {isMobile && (
          <span>{languages.find((lang) => lang.code === language)?.name}</span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as "en" | "ru" | "uz")}
            className={`flex items-center gap-2 ${
              language === lang.code ? "bg-gray-100 dark:bg-gray-800" : ""
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;