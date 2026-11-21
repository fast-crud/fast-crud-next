import type { FnCrudLocale } from "@fast-crud/fast-crud-next";
import { computed, reactive } from "vue";

type AdminPreferences = { language: "zh" | "en"; dark: boolean };
const storageKey = "fn-admin-preferences";
const storedValue = typeof localStorage === "undefined" ? null : localStorage.getItem(storageKey);
let saved: Partial<AdminPreferences> = {};
try {
  saved = storedValue ? JSON.parse(storedValue) as Partial<AdminPreferences> : {};
} catch {
  saved = {};
}

export const adminPreferences = reactive<AdminPreferences>({
  language: saved.language === "en" ? "en" : "zh",
  dark: saved.dark === true,
});

export const adminCrudLocale = computed<FnCrudLocale>(() => adminPreferences.language === "en" ? "en-US" : "zh-CN");

function persist(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(storageKey, JSON.stringify(adminPreferences));
  }
}

export function toggleAdminLanguage(): void {
  adminPreferences.language = adminPreferences.language === "zh" ? "en" : "zh";
  persist();
}

export function toggleAdminTheme(): void {
  adminPreferences.dark = !adminPreferences.dark;
  persist();
}

export function adminText(chinese: string, english: string): string {
  return adminPreferences.language === "zh" ? chinese : english;
}
