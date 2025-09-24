import React from "react";
import { Sun, Moon } from "lucide-react";
import { Toggle } from "../ui/toggle";
import { toggleTheme } from "../../slices/themeSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useLanguage } from "../../hooks/useLanguage";

interface ThemeToggleProps {
  isMobile: boolean;
  className: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isMobile, className }) => {
  const { t } = useLanguage();
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();
  return (
    <Toggle
      aria-label="Toggle theme"
      pressed={theme === "dark"}
      onPressedChange={() => dispatch(toggleTheme())}
      className={className}
    >
      {isMobile ? (
        theme === "dark" ? (
          <>
            <Sun size={18} />
            <span>{t("theme.light")}</span>
          </>
        ) : (
          <>
            {" "}
            <Moon size={18} />
            <span>{t("theme.dark")}</span>
          </>
        )
      ) : theme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
