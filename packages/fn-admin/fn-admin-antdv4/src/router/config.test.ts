import { describe, expect, it } from "vitest";
import { adminPreferences } from "@fast-crud/fn-admin-shared/preferences";
import { adminMessages } from "../locale";
import { adminMenuConfig, adminRouteRecords } from "./config";

function menuPaths(config: typeof adminMenuConfig): string[] {
  return config.flatMap(item => [
    ...(item.path ? [item.path] : []),
    ...(item.children ? menuPaths(item.children) : []),
  ]);
}

describe("Ant Design Vue admin route configuration", () => {
  it("菜单和路由共用词条，标题随 Admin 语言更新", () => {
    const page = adminMenuConfig.find(item => item.key === "crud")!.children![0];
    const route = adminRouteRecords.find(item => item.path === page.path);
    const previousLanguage = adminPreferences.language;

    try {
      expect(route?.meta?.titleKey).toBe(page.titleKey);
      adminPreferences.language = "zh";
      expect(adminMessages.value.menu[page.titleKey]).toBe("基础列表");
      expect(adminMessages.value.layout.console).toBe("控制台");
      adminPreferences.language = "en";
      expect(adminMessages.value.menu[page.titleKey]).toBe("Basic list");
      expect(adminMessages.value.layout.console).toBe("Console");
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
