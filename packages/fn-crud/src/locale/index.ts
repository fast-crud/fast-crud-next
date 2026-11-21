import en from "./en";
import zh from "./zh";

export const fnCrudLocales = {
  "zh-CN": zh,
  "en-US": en,
};

export type FnCrudLocale = keyof typeof fnCrudLocales;
