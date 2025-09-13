import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setLanguage,
  type SupportedLanguage,
  t as translate,
} from "../slices/languageSlice";

export const useLanguage = () => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.language);

  const setLang = (lang: SupportedLanguage) => dispatch(setLanguage(lang));

  const t = (key: string, args?: Record<string, string | number>) =>
    translate({ language: { language } }, key, args);

  return { language, setLanguage: setLang, t };
};
