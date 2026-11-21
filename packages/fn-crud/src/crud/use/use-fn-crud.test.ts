import { expect, it, vi } from "vitest";
import { reactive, ref } from "vue";
import { FN_CRUD_BLANK_COLUMN_KEY, installFnCrud, useFnCrud } from "./use-fn-crud";
import { useActionbarProps } from "./use-crud-props";

it("useFnCrud 初始化 actionbar 和 rowSelect 默认值并写回可变配置", () => {
  const state = reactive({
    columns: { name: { key: "name", title: "名称", show: true, cell: { width: 120, fixed: "left" as const, order: 7 } } },
    request: { pageRequest: vi.fn() },
    table: {},
  }) as any;
  useFnCrud({ state });

  state.table["onUpdate:density"]("compact");
  state.table["onUpdate:size"](16);

  expect(state.table.density).toBe("compact");
  expect(state.table.size).toBe(16);
  expect(state.columns.name).toMatchObject({ show: true, cell: { width: 120, fixed: "left", order: 7 } });
  expect(state.columns[FN_CRUD_BLANK_COLUMN_KEY]).toMatchObject({ key: FN_CRUD_BLANK_COLUMN_KEY, title: "", cell: { width: "auto", resizable: false } });
  expect(state.table).not.toHaveProperty("onColumnResize");
  expect(state.table).not.toHaveProperty("onUpdate:columns");
  expect(state.pagination).not.toHaveProperty("pageSize");
  expect(state.actionbar.buttons.batch).toMatchObject({
    text: "批量操作",
    show: true,
    buttonType: "dropdown",
    items: [{ key: "delete", label: "批量删除", danger: true }],
  });
  expect(state.actionbar.buttons.add).toMatchObject({ text: "添加", type: "primary", show: true });
  expect(state.rowSelect.selectedRowKeys).toEqual([]);
  state.pagination["onUpdate:pageSize"](25);
  expect(state.pagination.pageSize).toBe(25);
  state.pagination["onUpdate:current"](3);
  expect(state.pagination.current).toBe(3);
});

it("useFnCrud 保留用户 actionbar 按钮并补齐默认按钮", () => {
  const state = reactive({
    columns: {},
    request: { pageRequest: vi.fn() },
    actionbar: { buttons: { custom: { text: "自定义" } } },
  }) as any;
  useFnCrud({ state });

  const props = useActionbarProps(state, vi.fn(), ref(false), vi.fn()).value;

  expect(Object.keys(props.buttons)).toEqual(["add", "batch", "custom"]);
  expect(props.buttons.add).toMatchObject({ text: "添加", type: "primary", show: true, order: -100 });
  expect(props.buttons.batch).toMatchObject({ text: "批量操作", show: true, order: 0, buttonType: "dropdown" });
  expect(props.buttons.custom).toMatchObject({ text: "自定义" });
});

it("useFnCrud 在 crudState.rowSelect 持有选择 keys 并保留 onChange 回调", () => {
  const onChange = vi.fn();
  const state = reactive({
    columns: {},
    request: { pageRequest: vi.fn() },
    rowSelect: { selectedRowKeys: ["preset"], onChange },
  }) as any;

  useFnCrud({ state });
  state.rowSelect.onChange(["next"]);

  expect(state.rowSelect.selectedRowKeys).toEqual(["next"]);
  expect(onChange).toHaveBeenCalledWith(["next"]);
});

it("useFnCrud 将系统默认、公共配置和用户 state 合并到同一份 state", () => {
  const commonDensity = vi.fn();
  installFnCrud({
    commonOptions: () => ({
      columns: { common: { key: "common", title: "公共列" } },
      table: { size: 14, "onUpdate:density": commonDensity },
      pagination: { pageSize: 20 },
    }),
  });
  const localDensity = vi.fn();
  const state = reactive({
    columns: { local: { key: "local", title: "本地列" } },
    request: { pageRequest: vi.fn() },
    table: { size: 12, "onUpdate:density": localDensity },
    pagination: { pageSize: 50 },
  }) as any;

  useFnCrud({ state });

  expect(state.columns).toMatchObject({
    [FN_CRUD_BLANK_COLUMN_KEY]: { key: FN_CRUD_BLANK_COLUMN_KEY, cell: { width: "auto", resizable: false } },
    common: { key: "common", title: "公共列" },
    local: { key: "local", title: "本地列" },
  });
  expect(state.table.size).toBe(12);
  expect(state.pagination.pageSize).toBe(50);
  state.table["onUpdate:density"]("compact");
  expect(state.table.density).toBe("compact");
  expect(localDensity).toHaveBeenCalledWith("compact");
  expect(commonDensity).not.toHaveBeenCalled();

  const fallbackDensity = vi.fn();
  installFnCrud({ commonOptions: () => ({ table: { "onUpdate:density": fallbackDensity } }) });
  const stateWithCommonHandler = reactive({ columns: {}, request: { pageRequest: vi.fn() }, table: {}, pagination: {} }) as any;
  useFnCrud({ state: stateWithCommonHandler });
  stateWithCommonHandler.table["onUpdate:density"]("compact");
  expect(stateWithCommonHandler.table.density).toBe("compact");
  expect(fallbackDensity).toHaveBeenCalledWith("compact");

  installFnCrud({ commonOptions: () => ({}) });
});
