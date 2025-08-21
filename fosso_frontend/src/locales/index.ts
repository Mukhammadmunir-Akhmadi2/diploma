import type { SupportedLanguage, Translations } from "../types/language";
import { enTranslations } from "./en";
import { ruTranslations } from "./ru";
import { uzTranslations } from "./uz";

export const translations: Record<SupportedLanguage, Translations> = {
  en: enTranslations,
  ru: ruTranslations,
  uz: uzTranslations,
};

export * from "./en";
export * from "./ru";
export * from "./uz";
