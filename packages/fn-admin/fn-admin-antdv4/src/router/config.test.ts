import { describe, expect, it } from "vitest";
import { reactive } from "vue";
import { installFnCrud, useFnCrud, type FnCrudState } from "@fast-crud/fast-crud-next";
import { adminPreferences } from "@fast-crud/fn-admin-shared/preferences";
import { adminI18n } from "../locale";
import { adminMenuConfig, adminRouteRecords } from "./config";

function menuPaths(config: typeof adminMenuConfig): string[] {
  return config.flatMap(item => [
    ...(item.path ? [item.path] : []),
    ...(item.children ? menuPaths(item.children) : []),
  ]);
}

describe("Ant Design Vue admin route configuration", () => {
  it("Admin 和 FnCrud 使用同一个 i18n 实例切换语言", () => {
    const previousLanguage = adminPreferences.language;
    try {
      adminPreferences.language = "zh";
      installFnCrud({ i18n: adminI18n });
      const state = useFnCrud({
        state: reactive<FnCrudState>({
          columns: {},
          request: { pageRequest: async () => ({ records: [], total: 0 }) },
        }),
      });

      expect(state.actionbar?.buttons.add.text).toBe("添加");
      adminPreferences.language = "en";
      expect(adminI18n.global.t("layout.console")).toBe("Console");
      expect(state.actionbar?.buttons.add.text).toBe("Add");
      expect(state.form).toMatchObject({ dialog: { title: "Edit" } });
    } finally {
      adminPreferences.language = previousLanguage;
      installFnCrud({});
    }
  });

  it("菜单和路由共用词条，标题随 Admin 语言更新", () => {
    const page = adminMenuConfig.find(item => item.key === "crud")!.children![0];
    const route = adminRouteRecords.find(item => item.path === page.path);
    const previousLanguage = adminPreferences.language;

    try {
      expect(route?.meta?.titleKey).toBe(page.titleKey);
      adminPreferences.language = "zh";
      expect(adminI18n.global.t(`menu.${page.titleKey}`)).toBe("基础列表");
      expect(adminI18n.global.t("layout.console")).toBe("控制台");
      adminPreferences.language = "en";
      expect(adminI18n.global.t(`menu.${page.titleKey}`)).toBe("Basic list");
      expect(adminI18n.global.t("layout.console")).toBe("Console");
    } finally {
      adminPreferences.language = previousLanguage;
    }
  });

  it("derives menu pages and route records from one config", () => {
    const routes = new Map(adminRouteRecords.map(route => [route.path, route]));
    const paths = menuPaths(adminMenuConfig);

    expect(paths).toHaveLength(9);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every(path => routes.get(path)?.component)).toBe(true);
    expect(routes.get("/crud/basic")?.redirect).toBe("/crud/basis/basic");
    expect(routes.get("/")?.redirect).toBe("/dashboard");
  });
});
