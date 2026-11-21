import { describe, expect, it } from "vitest";
import { adminMenuConfig, adminRouteRecords } from "./config";

function menuPaths(config: typeof adminMenuConfig): string[] {
  return config.flatMap(item => [
    ...(item.path ? [item.path] : []),
    ...(item.children ? menuPaths(item.children) : []),
  ]);
}

describe("Naive admin route configuration", () => {
  it("uses one config for navigation and categorized CRUD routes", () => {
    const routes = new Map(adminRouteRecords.map(route => [route.path, route]));
    const paths = menuPaths(adminMenuConfig);

    expect(paths).toHaveLength(9);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every(path => routes.get(path)?.component)).toBe(true);
    expect(paths).toContain("/crud/form/slots");
    expect(routes.get("/overview")?.redirect).toBe("/dashboard");
    expect(routes.get("/crud/basic")?.redirect).toBe("/crud/basis/basic");
  });
});
