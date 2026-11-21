import { computed } from "vue";
import { adminPreferences } from "@fast-crud/fn-admin-shared/preferences";
import enLayout from "./en/layout";
import enMenu from "./en/menu";
import zhLayout from "./zh/layout";
import zhMenu from "./zh/menu";

const messages = {
  en: { layout: enLayout, menu: enMenu },
  zh: { layout: zhLayout, menu: zhMenu },
};

export type AdminMenuMessageKey = keyof typeof zhMenu;
export const adminMessages = computed(() => messages[adminPreferences.language]);
