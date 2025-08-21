import type { SupportedLanguage } from "../types/language";
import { translations } from "../locales/index";

export const getStoredLanguage = (): SupportedLanguage | null => {
  const savedLanguage = localStorage.getItem(
    "language"
  ) as SupportedLanguage | null;
  if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
    return savedLanguage;
  }
  return null;
};

export const getBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.split("-")[0] as SupportedLanguage;
  if (Object.keys(translations).includes(browserLang)) {
    return browserLang;
  }
  return "en"; // fallback
};

export const getInitialLanguage = (): SupportedLanguage => {
  return getStoredLanguage() || getBrowserLanguage();
};

export const saveLanguageToStorage = (language: SupportedLanguage): void => {
  localStorage.setItem("language", language);
  document.documentElement.setAttribute("lang", language);
};
