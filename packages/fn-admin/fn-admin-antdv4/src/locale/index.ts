import { watch } from "vue";
import { createI18n } from "vue-i18n";
import { adminPreferences } from "@fast-crud/fn-admin-shared/preferences";
import { fnCrudLocales } from "@fast-crud/fast-crud-next";
import enLayout from "./en/layout";
import enMenu from "./en/menu";
import zhLayout from "./zh/layout";
import zhMenu from "./zh/menu";

const messages = {
  en: { layout: enLayout, menu: enMenu, fnCrud: fnCrudLocales["en-US"] },
  zh: { layout: zhLayout, menu: zhMenu, fnCrud: fnCrudLocales["zh-CN"] },
};

export type AdminMenuMessageKey = keyof typeof zhMenu;
export const adminI18n = createI18n({
  legacy: false,
  locale: adminPreferences.language,
  fallbackLocale: "zh",
  messages,
});

watch(() => adminPreferences.language, language => {
  adminI18n.global.locale.value = language;
}, { flush: "sync" });
