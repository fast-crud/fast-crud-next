import { computed, shallowReadonly, unref, type Ref } from "vue";
import FnButton from "../../components/button/fn-button.vue";
import { isFnComputeValue, useCompute } from "./use-compute";
import { FN_CRUD_BLANK_COLUMN_KEY } from "./use-fn-crud";
import { useMerge } from "../../components/use/use-merge";
import { getColumnType } from "../type";
import type { DictOption, FnColumnSettingsColumn, FnCrudColumn, FnCrudOptions, FnDynamic, FnFormColumn, FnRenderSlot, FnRowContext, FnSearchColumn, FnSearchProps, FnTableLayoutRow, FnTableProps, FnTableRow } from "../../types/index";
export { createRowSelectionColumn } from "./use-selection";
const { compute, resolveComputedValue } = useCompute();

export function useResolvedColumns<Row>(props: Pick<FnCrudOptions<Row>, "columns">) {
  const { merge } = useMerge();
  return computed(() => {
    const columns: Record<string, FnCrudColumn<Row>> = {};
    for (const [key, column] of Object.entries(props.columns)) {
      const type = unref(column.type);
      if (!type || type.length === 0) {
        columns[key] = column;
        continue;
      }
      const names = typeof type === "string" ? [type] : type;
      const defaults = names.map(name => {
        const definition = getColumnType(name);
        if (!definition && import.meta.env.DEV) {
          console.warn("[FnCrud] 未知字段类型", { key, type: name });
        }
        return typeof definition === "function" ? definition(shallowReadonly(column)) : definition;
      });
      columns[key] = merge({}, ...defaults, column);
    }
    return columns;
  });
}

export function useSearchProps(props: FnCrudOptions, columns: Ref<FnCrudOptions["columns"]>, searchSlot?: FnRenderSlot): Ref<FnSearchProps> {
  const { merge } = useMerge();
  return computed(() => {
    const source: Record<string, FnDynamic<FnSearchColumn>> = { ...props.search?.columns };
    for (const [key, column] of Object.entries(columns.value)) {
      if (column.search) {
        const override = source[key];
        const { search: merged } = merge({}, { search: column.search }, { search: override });
        source[key] = compute(context => resolveComputedValue(merged, context) as FnSearchColumn);
      }
    }
    const slots = { ...props.search?.slots };
    const defaultSlot = searchSlot || props.slots?.search;
    if (defaultSlot) slots.default = defaultSlot;
    return { ...props.search, columns: source, slots };
  });
}

export function useRowHandleProps<Row>(props: FnCrudOptions<Row>, editRow: (ctx: FnRowContext<Row>) => void, openDeleteDialog: (ctx: FnRowContext<Row>) => unknown) {
  return computed(() => {
    const { buttons: customButtons, render: customRender, ...options } = props.rowHandle || {};
    const buttons = {
      edit: { show: true, text: "编辑", type: "link", click: editRow, ...customButtons?.edit },
      delete: { show: true, text: "删除", type: "link", danger: true, disabled: !props.request.delRequest, click: openDeleteDialog, ...customButtons?.delete },
      ...Object.fromEntries(Object.entries(customButtons || {}).filter(([key]) => key !== "edit" && key !== "delete").map(([key, button]) => [key, { show: true, ...button }])),
    };
    const bindContext = (callback: ((context: FnRowContext<Row>) => unknown) | ((context?: FnRowContext<Row>) => unknown) | undefined, context: FnRowContext<Row>) => callback ? () => callback(context) : undefined;
    return {
      width: 160,
      ...options,
      render: customRender || ((context: FnRowContext<Row>) => (
        <div class="fn-table-cell-buttons">
          {Object.entries(buttons).map(([key, button]) => {
            const { click, ...buttonProps } = button;
            const items = button.items?.map(({ click: itemClick, ...item }) => ({ ...item, click: bindContext(itemClick, context) }));
            return <FnButton key={key} {...buttonProps} items={items} click={bindContext(click, context)} />;
          })}
        </div>
      )),
    };
  });
}

export function useTableColumns(props: FnCrudOptions, resolvedColumns: Ref<FnCrudOptions["columns"]>, rowHandleProps: Ref<Record<string, any>>) {
  return computed(() => {
    const columns = { ...resolvedColumns.value };
    if (props.rowHandle && props.rowHandle.show !== false) {
      const rowHandle = rowHandleProps.value;
      const blankColumn = columns[FN_CRUD_BLANK_COLUMN_KEY];
      if (blankColumn) {
        const cell = blankColumn.cell && !isFnComputeValue(blankColumn.cell) ? blankColumn.cell : {};
        columns[FN_CRUD_BLANK_COLUMN_KEY] = { ...blankColumn, cell: { ...cell, order: rowHandle.order ?? Infinity } };
      }
      columns.rowHandle = { key: "rowHandle", title: "操作", cell: { ...rowHandle, fixed: rowHandle.fixed ?? "right", order: rowHandle.order ?? Infinity } };
    }
    return columns;
  });
}

export function useTableProps(
  props: FnCrudOptions,
  columns: Ref<Record<string, any>>,
  data: Ref<FnTableRow[]>,
  loading: Ref<boolean>,
  sort: Ref<{ prop: string; asc: boolean }>,
  size: Ref<number>,
  density: Ref<"compact" | "comfort">,
  onSort: (sort: { prop: string; asc: boolean }) => void,
  onColumnResize: (size: { key: string; width: number }) => void
): Ref<FnTableProps> {
  return computed(() => {
    const { "onUpdate:density": _onUpdateDensity, "onUpdate:size": _onUpdateSize, ...table } = props.table || {};
    return {
      ...table,
      columns: columns.value,
      data: data.value,
      loading: loading.value || props.table?.loading,
      sort: sort.value,
      size: size.value,
      density: density.value,
      onSort,
      onColumnResize,
    };
  });
}

export function useActionbarProps(
  props: FnCrudOptions,
  openAddForm: () => unknown,
  canBatchDelete: Ref<boolean>,
  onSelect: (buttonKey: string, itemKey: string) => void
) {
  return computed(() => {
    const buttons = { ...props.actionbar?.buttons };
    buttons.add = { click: openAddForm, ...buttons.add };
    return {
      ...props.actionbar,
      buttons: Object.fromEntries(Object.entries(buttons).sort(([, left], [, right]) => (left.order ?? Infinity) - (right.order ?? Infinity))),
      canBatchDelete: canBatchDelete.value,
      onSelect,
    };
  });
}

export function useToolbarProps(
  props: FnCrudOptions,
  options: {
    density: Ref<"compact" | "comfort">;
    preferencesLoaded: Ref<boolean>;
    columnSettingsProps: Ref<{
      modelValue: boolean;
      columns: FnColumnSettingsColumn[];
      "onUpdate:modelValue": (value: boolean) => void;
      "onUpdate:columns": (columns: FnColumnSettingsColumn[]) => void;
    }>;
    onUpdateDensity: (density: "compact" | "comfort") => void;
    onResetColumnSettings: () => void;
    bodyBottomSlot?: FnRenderSlot;
  }
) {
  return computed(() => {
    const toolbar = props.toolbar || { show: true, buttons: {} };
    const slots = toolbar.slots || {};
    const bodyBottom = options.bodyBottomSlot || props.slots?.bodyBottom || slots.bodyBottom;
    return {
      ...toolbar,
      density: options.density.value,
      disabled: !options.preferencesLoaded.value,
      columnSettingsProps: {
        ...options.columnSettingsProps.value,
        onReset: options.onResetColumnSettings,
        slots: bodyBottom ? { ...slots, bodyBottom } : slots,
      },
      "onUpdate:density": options.onUpdateDensity,
    };
  });
}

export function useHeadingProps(props: FnCrudOptions, getSelectedRowKeys: () => Array<string | number>, headerSlot?: FnRenderSlot) {
  return computed(() => {
    const slot = headerSlot || props.slots?.header || props.heading?.slots?.default;
    return {
      ...props.heading,
      show: slot ? true : props.heading?.show,
      slots: slot ? { ...props.heading?.slots, default: slot } : props.heading?.slots,
      ctx: { selectedRowKeys: getSelectedRowKeys() },
    };
  });
}

export function useTabsProps(props: FnCrudOptions, columns: Ref<FnCrudOptions["columns"]>, searchForm: Record<string, any>, tabsCounts: Ref<Record<string, number>>, applySearch: () => void) {
  return computed(() => {
    const refCol = props.tabs?.refCol;
    const cell = refCol && columns.value[refCol]?.cell;
    const dict = cell && !isFnComputeValue(cell) ? cell.dict : undefined;
    const options = dict?.getOptions()?.value;
    const data: DictOption[] = Array.isArray(options) ? options : [];
    const tabs = new Map(data.map(item => [String(item.value), item]));
    for (const [key, item] of Object.entries(props.tabs?.tabs || {})) tabs.set(key, { ...tabs.get(key), ...item });
    return {
      show: props.tabs?.show,
      tabs: Array.from(tabs.values())
        .filter(item => item.show !== false)
        .map(item => ({ ...item, count: tabsCounts.value[item.value] ?? item.count ?? 0 })),
      modelValue: searchForm[refCol || ""] ?? "",
      slots: props.tabs?.slots,
      "onUpdate:modelValue": (value: string) => {
        if (refCol) searchForm[refCol] = value;
        applySearch();
      },
    };
  });
}

export function usePaginationProps(props: FnCrudOptions, page: { current: number; pageSize: number; total: number }, onChange: (current: number, pageSize: number) => void) {
  return computed(() => ({
    ...(({ "onUpdate:current": _onUpdateCurrent, "onUpdate:pageSize": _onUpdatePageSize, ...pagination }) => pagination)(props.pagination || {}),
    show: props.pagination?.show ?? Boolean(props.pagination),
    current: page.current,
    pageSize: page.pageSize,
    total: page.total,
    pageSizeOptions: Array.from(new Set([String(page.pageSize), ...(props.pagination?.pageSizeOptions || ["10", "20", "50", "100"])])),
    simple: props.pagination?.simple ?? false,
    showSizeChanger: props.pagination?.showSizeChanger ?? true,
    showQuickJumper: props.pagination?.showQuickJumper ?? false,
    showTotal: props.pagination?.showTotal || ((total: number) => `共 ${total} 条`),
    onChange,
  }));
}

export function useTableRenderProps(props: FnCrudOptions, tableProps: Ref<FnTableProps>, defaultSlot?: FnRenderSlot) {
  return computed(() => {
    const render = defaultSlot || props.slots?.default;
    return { show: Boolean(render), render: render || (() => null), ctx: tableProps.value };
  });
}

export function useLayoutProps(props: FnCrudOptions): Ref<FnTableLayoutRow[]> {
  return computed(() => props.layout || [{ cols: [{ type: "header" }] }, { cols: [{ type: "actionbar" }, { type: "tabs", style: { flex: 1 } }, { type: "search" }, { type: "toolbar" }] }]);
}

export function useFormProps(resolvedColumns: Ref<FnCrudOptions["columns"]>) {
  return computed(() => {
    const columns: Record<string, FnDynamic<FnFormColumn>> = {};
    for (const [key, { form, show, title }] of Object.entries(resolvedColumns.value)) {
      if (form && show !== false) columns[key] = compute(context => ({ title, ...resolveComputedValue(form, context) }));
    }
    return { columns };
  });
}
