import { createContext } from "react";
import type { LanguageContextType } from "../types/language";

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
