import en from "./en";
import zh from "./zh";
import get from "lodash-es/get";

export const fnCrudLocales = {
  "zh-CN": zh,
  "en-US": en,
};

export type FnCrudLocale = keyof typeof fnCrudLocales;

export interface FnCrudI18n {
  global: { t(key: string): string };
}

export function translateFnCrud(locale: FnCrudLocale, key: string): string {
  return get({ fnCrud: fnCrudLocales[locale] }, key, key);
}
