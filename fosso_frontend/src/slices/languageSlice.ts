import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { translations } from "../locales/index";
import {
  getNestedTranslation,
  interpolateString,
} from "../utils/translationUtils";

export type SupportedLanguage = "en" | "ru" | "uz";

export interface LanguageState {
  language: SupportedLanguage;
}

function getInitialState(): LanguageState {
  const browserLang = navigator.language.split("-")[0] as SupportedLanguage;
  if (Object.keys(translations).includes(browserLang)) {
    return { language: browserLang };
  }
  return { language: "en" }; // fallback
}

const initialState: LanguageState = getInitialState();

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<SupportedLanguage>) {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export const t = (
  state: { language: LanguageState },
  key: string,
  args?: Record<string, string | number>
) => {
  const translation = getNestedTranslation(
    translations[state.language.language],
    key
  );

  return args ? interpolateString(translation, args) : translation;
};

export default languageSlice.reducer;
