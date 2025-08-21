"use client";

import type React from "react";
import { useState, useEffect, type ReactNode } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { translations } from "../locales/index";
import {
  getNestedTranslation,
  interpolateString,
} from "../utils/translationUtils";
import {
  getInitialLanguage,
  saveLanguageToStorage,
} from "../utils/languageDetection";
import type { SupportedLanguage } from "../types/language";

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(getInitialLanguage);

  useEffect(() => {
    saveLanguageToStorage(language);
  }, [language]);

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
  };

  const t = (
    key: string,
    args?: { [key: string]: string | number }
  ): string => {
    const translation = getNestedTranslation(translations[language], key);

    if (args) {
      return interpolateString(translation, args);
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
