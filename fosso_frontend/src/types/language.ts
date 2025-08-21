export type SupportedLanguage = "en" | "ru" | "uz";

export interface Translations {
  [key: string]: string | Translations;
}

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, args?: { [key: string]: string | number }) => string;
}