import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { createRowSelectionColumn, useActionbarProps, usePaginationProps, useRowHandleProps, useSearchProps, useTabsProps } from "./use.tsx";
import { isFnComputeValue } from "./use/compute";
import type { FnCrudOptions, FnRowContext } from "./types/index";

describe("useTabsProps", () => {
  it("treats unloaded dictionary options as an empty list", () => {
    const props = {
      columns: {
        status: { key: "status", title: "状态", cell: { dict: { getOptions: () => ({ value: undefined }) } } },
      },
      request: { pageRequest: async () => ({ records: [], total: 0 }) },
      tabs: { refCol: "status" },
    } as unknown as FnCrudOptions;

    const result = useTabsProps(props, {}, ref({}), vi.fn()).value;

    expect(result.tabs).toEqual([]);
    expect(result.slots).toBeUndefined();
  });

  it("passes the tabs visibility option to the component props", () => {
    const props = {
      columns: {},
      request: { pageRequest: async () => ({ records: [], total: 0 }) },
      tabs: { show: false },
    } as unknown as FnCrudOptions;

    expect(useTabsProps(props, {}, ref({}), vi.fn()).value.show).toBe(false);
  });
});

it("search props 将调用方和配置中的自定义内容收敛到 default slot", () => {
  const configuredSlot = vi.fn();
  const vueSlot = vi.fn();
  const props = {
    columns: {},
    request: { pageRequest: vi.fn() },
    slots: { search: configuredSlot },
  } as unknown as FnCrudOptions;

  expect(useSearchProps(props).value.slots?.default).toBe(configuredSlot);
  expect(useSearchProps(props, vueSlot).value.slots?.default).toBe(vueSlot);
});

it("tabs props 在更新事件中写入搜索表单并执行搜索", () => {
  const applySearch = vi.fn();
  const searchForm: Record<string, any> = {};
  const props = {
    columns: { status: { key: "status", title: "状态" } },
    request: { pageRequest: vi.fn() },
    tabs: { refCol: "status" },
  } as unknown as FnCrudOptions;

  const tabs = useTabsProps(props, searchForm, ref({}), applySearch).value;
  tabs["onUpdate:modelValue"]("active");

  expect(searchForm.status).toBe("active");
  expect(applySearch).toHaveBeenCalledOnce();
});

it("行操作列通过 render 渲染按钮并把当前 FnRowContext 传给回调", () => {
  const onEdit = vi.fn();
  const props = {
    columns: {},
    request: { pageRequest: async () => ({ records: [], total: 0 }) },
    rowHandle: { buttons: { edit: { text: "编辑", click: onEdit } } },
  } as unknown as FnCrudOptions;
  const context = { type: "row", row: { id: 1 }, form: { id: 1 }, index: 0 } as FnRowContext;
  const rowHandle = useRowHandleProps(props, vi.fn(), vi.fn()).value as any;
  const vnode = rowHandle.render(context);
  const findButton = (children: any): any => {
    if (Array.isArray(children)) {
      return children.map(findButton).find(Boolean);
    }
    if (children && typeof children === "object") {
      if (children.props?.text) return children;
      return findButton(children.children);
    }
    return undefined;
  };
  const button = findButton(vnode.children);

  expect(rowHandle.buttons).toBeUndefined();
  expect(button.props.text).toBe("编辑");
  button.props.click();
  expect(onEdit).toHaveBeenCalledWith(context);
});

it("rowHandle 按钮回调携带配置中的具体行类型", () => {
  const options: FnCrudOptions<{ id: number }> = {
    columns: {},
    rowHandle: {
      buttons: {
        inspect: {
          text: "查看",
          click: context => {
            const id: number = context.row.id;
            void id;
          },
        },
      },
    },
    request: { pageRequest: vi.fn() },
  };

  expect(options.rowHandle?.buttons?.inspect).toBeDefined();
});

it("默认行操作按钮和未显式隐藏的自定义按钮保持可见", () => {
  const props = {
    columns: {},
    request: { pageRequest: async () => ({ records: [], total: 0 }), delRequest: async () => undefined },
    rowHandle: { buttons: { inspect: { text: "查看" }, hidden: { text: "隐藏", show: false } } },
    actionbar: { buttons: { custom: { text: "自定义" }, hidden: { text: "隐藏", show: false } } },
  } as unknown as FnCrudOptions;

  const rendered = (useRowHandleProps(props, vi.fn(), vi.fn()).value as any).render({ type: "row", row: {}, form: {}, index: 0 });
  const findButtons = (children: any): any[] => {
    if (Array.isArray(children)) return children.flatMap(findButtons);
    if (children && typeof children === "object") {
      if (children.props?.text) return [children];
      return findButtons(children.children);
    }
    return [];
  };
  const rowButtons = findButtons(rendered.children);
  const actionbarButtons = (useActionbarProps(props, vi.fn(), ref(false), vi.fn()) as any).value.buttons;

  expect(rowButtons.map((button: any) => button.props.show)).toEqual([true, true, true, false]);
  expect(actionbarButtons.custom.show).toBe(true);
  expect(actionbarButtons.hidden.show).toBe(false);
});

it("actionbar 按钮按 order 升序排列，未设置 order 的按钮保留在末尾", () => {
  const props = {
    columns: {},
    request: { pageRequest: async () => ({ records: [], total: 0 }) },
    actionbar: { buttons: {
      later: { text: "后置", order: 20 },
      defaultOrder: { text: "默认顺序" },
      earlier: { text: "前置", order: 10 },
    } },
  } as unknown as FnCrudOptions;

  const buttons = (useActionbarProps(props, vi.fn(), ref(false), vi.fn()) as any).value.buttons;

  expect(Object.keys(buttons)).toEqual(["earlier", "later", "defaultOrder", "add"]);
});

it("行选择列默认不固定，可按 rowSelect.fixed 配置固定", () => {
  const createColumn = (fixed?: "left" | "right" | null) => createRowSelectionColumn({
    rowSelect: { fixed },
    selectedRowKeys: [],
    pageKeys: [],
    radioName: "selection",
    getRecordId: () => "1",
    changeSelection: vi.fn(),
    togglePageSelection: vi.fn(),
  });

  const getFixed = (column: ReturnType<typeof createColumn>) => column.cell && !isFnComputeValue(column.cell) ? column.cell.fixed : undefined;

  expect(getFixed(createColumn())).toBeUndefined();
  expect(getFixed(createColumn("left"))).toBe("left");
});

it("当前 pageSize 不在选项中时仍将其加入选择项", () => {
  const pagination = usePaginationProps({ columns: {}, request: { pageRequest: vi.fn() } }, { current: 1, pageSize: 5, total: 3 }, vi.fn()).value;

  expect(pagination.pageSizeOptions).toEqual(["5", "10", "20", "50", "100"]);
});

it("pagination props 将页码变化交给传入的分页行为", () => {
  const onChange = vi.fn();
  const props = { columns: {}, request: { pageRequest: vi.fn() }, pagination: {} } as unknown as FnCrudOptions;
  const pagination = usePaginationProps(props, { current: 1, pageSize: 10, total: 20 }, onChange).value;

  pagination.onChange(2, 10);

  expect(pagination.show).toBe(true);
  expect(onChange).toHaveBeenCalledWith(2, 10);
});
