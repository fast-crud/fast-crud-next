import { afterEach, expect, it, vi } from "vitest";
import { createFnCrudPreferenceSnapshot, createFnCrudPreferenceStorage, getFnCrudPreferenceKey, mergeFnCrudPreferences } from "./use-preferences";
import type { FnCrudPreferences } from "../../types/index";
import { useCompute } from "./use-compute";

const { compute, resolveComputedValue } = useCompute();

afterEach(() => {
  vi.restoreAllMocks();
});

it("prefers explicit CRUD id and resolves Vue hash routes as the fallback key", () => {
  expect(getFnCrudPreferenceKey("accounts", "https://certd.local/#/sys/accounts?tab=all")).toBe("fn-crud:accounts");
  expect(getFnCrudPreferenceKey(undefined, "https://certd.local/#/sys/accounts?tab=all")).toBe("fn-crud:/sys/accounts");
});

it("merges saved columns with current defaults and ignores removed columns", () => {
  const defaults = {
    id: { key: "id", title: "ID", cell: { width: 80, order: 0 } },
    name: { key: "name", title: "名称", cell: { width: 160, order: 1 } },
    status: { key: "status", title: "状态", cell: { order: 2 } },
  };
  const saved: FnCrudPreferences = {
    columns: {
      id: { order: 0, show: true, width: 90 },
      name: { order: 2, show: false, fixed: "right", width: 220 },
      deleted: { order: 1, show: true },
    },
    pageSize: 50,
    density: "compact",
  };

  expect(mergeFnCrudPreferences(defaults, saved)).toEqual({
    id: { key: "id", title: "ID", cell: { width: 90, order: 0, show: true }, show: true },
    name: { key: "name", title: "名称", cell: { width: 220, order: 2, fixed: "right", show: false }, show: false },
    status: { key: "status", title: "状态", cell: { order: 2 } },
  });
});

it("用户显隐偏好覆盖开发者的 column.show 和 cell.show", () => {
  const columns = {
    visible: { key: "visible", title: "显示", show: false, cell: { show: false } },
    hidden: { key: "hidden", title: "隐藏", show: true, cell: { show: true } },
  };
  const preferences: FnCrudPreferences = {
    columns: { visible: { show: true }, hidden: { show: false } },
    pageSize: 10,
    density: "comfort",
  };

  expect(mergeFnCrudPreferences(columns, preferences)).toMatchObject({
    visible: { show: true, cell: { show: true } },
    hidden: { show: false, cell: { show: false } },
  });
});

it("用户宽度覆盖动态 cell，但保留开发者的动态配置", () => {
  const columns = {
    amount: { key: "amount", title: "金额", cell: compute(({ row }) => ({ width: row?.width || 120, align: "right" as const })) },
  };
  const preferences: FnCrudPreferences = { columns: { amount: { width: 200 } }, pageSize: 10, density: "comfort" };
  const merged = mergeFnCrudPreferences(columns, preferences);

  expect(resolveComputedValue(merged.amount.cell!, { type: "row", row: { width: 150 } })).toMatchObject({ width: 200, align: "right" });
});

it("只保存用户列覆盖，未调整宽度时保留 undefined", () => {
  const snapshot = createFnCrudPreferenceSnapshot(
    {
      id: { order: 2, fixed: "left", width: 96 },
      name: { show: false },
    },
    50,
    "compact"
  );

  expect(snapshot).toEqual({
    columns: {
      id: { order: 2, fixed: "left", width: 96 },
      name: { show: false },
    },
    pageSize: 50,
    density: "compact",
  });
});

it("uses localStorage by default and delegates full snapshots to remote get/set", async () => {
  const values = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  });
  const snapshot: FnCrudPreferences = { columns: {}, pageSize: 20, density: "comfort" };
  const local = createFnCrudPreferenceStorage();
  await local.set("fn-crud:/path", snapshot);
  expect(await local.get("fn-crud:/path")).toEqual(snapshot);
  await local.remove?.("fn-crud:/path");
  expect(await local.get("fn-crud:/path")).toBeUndefined();

  const remote = { get: vi.fn(async () => snapshot), set: vi.fn(async (_key: string, _value: FnCrudPreferences) => undefined) };
  const storage = createFnCrudPreferenceStorage(remote);
  expect(await storage.get("fn-crud:/path")).toEqual(snapshot);
  await storage.set("fn-crud:/path", snapshot);
  expect(remote.get).toHaveBeenCalledWith("fn-crud:/path");
  expect(remote.set).toHaveBeenCalledWith("fn-crud:/path", snapshot);

  const offline = createFnCrudPreferenceStorage({
    get: async () => {
      throw new Error("offline");
    },
    set: async () => undefined,
  });
  expect(await offline.get("fn-crud:/path")).toEqual(snapshot);
});
