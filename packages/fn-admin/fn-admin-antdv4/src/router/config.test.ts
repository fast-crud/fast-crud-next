import { describe, expect, it } from "vitest";
import { adminMenuConfig, adminRouteRecords } from "./config";

function menuPaths(config: typeof adminMenuConfig): string[] {
  return config.flatMap(item => [
    ...(item.path ? [item.path] : []),
    ...(item.children ? menuPaths(item.children) : []),
  ]);
}

describe("Ant Design Vue admin route configuration", () => {
  it("derives menu pages and route records from one config", () => {
    const routes = new Map(adminRouteRecords.map(route => [route.path, route]));
    const paths = menuPaths(adminMenuConfig);

    expect(paths).toHaveLength(8);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every(path => routes.get(path)?.component)).toBe(true);
    expect(routes.get("/crud/basic")?.redirect).toBe("/crud/basis/basic");
    expect(routes.get("/")?.redirect).toBe("/dashboard");
  });
});
