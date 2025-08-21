import type { Translations } from "../types/language";

export const getNestedTranslation = (
  obj: Translations,
  path: string
): string => {
  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current[key] === undefined) {
      console.warn(`Translation key not found: ${path}`);
      return path;
    }
    current = current[key];
  }

  if (typeof current !== "string") {
    console.warn(`Translation key is not a string: ${path}`);
    return path;
  }

  return current;
};

export const interpolateString = (
  text: string,
  args: { [key: string]: string | number }
): string => {
  return Object.entries(args).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`{{${key}}}`, "g"), String(value));
  }, text);
};
