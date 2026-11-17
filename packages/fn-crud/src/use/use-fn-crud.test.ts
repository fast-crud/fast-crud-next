import { expect, it, vi } from "vitest";
import { reactive } from "vue";
import { useFnCrud } from "./use-fn-crud";

it("useFnCrud 只为 table 的 density 和 size 安装写回回调", () => {
  const state = reactive({
    columns: { name: { key: "name", title: "名称", show: true, cell: { width: 120, fixed: "left" as const, order: 7 } } },
    request: { pageRequest: vi.fn() },
    table: {},
  }) as any;
  useFnCrud(state);

  state.table["onUpdate:density"]("compact");
  state.table["onUpdate:size"](16);

  expect(state.table.density).toBe("compact");
  expect(state.table.size).toBe(16);
  expect(state.columns.name).toMatchObject({ show: true, cell: { width: 120, fixed: "left", order: 7 } });
  expect(state.table).not.toHaveProperty("onColumnResize");
  expect(state.table).not.toHaveProperty("onUpdate:columns");
  expect(state.pagination).not.toHaveProperty("pageSize");
  state.pagination["onUpdate:pageSize"](25);
  expect(state.pagination.pageSize).toBe(25);
});
