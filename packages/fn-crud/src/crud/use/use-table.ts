import { computed, reactive, ref, type Ref } from "vue";
import { useTableColumns, useTableProps } from "./use-crud-props";
import { FN_CRUD_BLANK_COLUMN_KEY } from "./use-fn-crud";
import { useSelection } from "./use-selection";
import { isFnComputeValue } from "./use-compute";
import type { FnCrudPreferencesController } from "./use-preferences";
import type { FnColumnSettingsColumn, FnCrudOptions, FnTableRow } from "../../types/index";

export function useTable(props: FnCrudOptions, resolvedColumns: Ref<FnCrudOptions["columns"]>, rowHandleProps: Ref<Record<string, any>>, searchForm: Record<string, any>, getPreferences: () => FnCrudPreferencesController) {
  const data = ref<FnTableRow[]>([]);
  const loading = ref(false);
  const columnSettingsOpen = ref(false);
  const size = computed(() => props.table?.size ?? 14);
  const pageSize = computed(() => getPreferences().pageSize.value);
  const density = computed(() => getPreferences().density.value);
  const page = reactive({ current: props.pagination?.current || 1, get pageSize() { return pageSize.value; }, total: 0 });
  const sort = ref({ prop: "", asc: true });
  const tabsCounts = ref<Record<string, number>>({});
  const selection = useSelection(props, data);
  const baseTableColumns = useTableColumns(props, resolvedColumns, rowHandleProps);
  const tableColumns = computed(() => {
    const columns = getPreferences().mergeColumns(baseTableColumns.value, { columns: getPreferences().columnPreferences.value, pageSize: pageSize.value, density: density.value });
    if (!selection.selectionColumn.value) return columns;
    return { __fn_selection_column: selection.selectionColumn.value, ...columns };
  });
  const columnSettingsColumns = computed<FnColumnSettingsColumn[]>(() => getColumnSettings(tableColumns.value));
  const defaultColumnSettings = computed<FnColumnSettingsColumn[]>(() => getColumnSettings(baseTableColumns.value, true));
  const tableProps = useTableProps(props, tableColumns, data, loading, sort, size, density, changeSort, saveColumnWidth);
  const columnSettingsProps = computed(() => ({
    modelValue: columnSettingsOpen.value,
    columns: columnSettingsColumns.value,
    "onUpdate:modelValue": (value: boolean) => (columnSettingsOpen.value = value),
    "onUpdate:columns": (columns: FnColumnSettingsColumn[]) => getPreferences().updateColumnSettings(columns),
  }));
  let requestId = 0;

  function getColumnSettings(columns: Record<string, any>, includeOrder = false): FnColumnSettingsColumn[] {
    return Object.entries(columns)
      .filter(([key]) => key !== "rowHandle" && key !== FN_CRUD_BLANK_COLUMN_KEY && key !== "__fn_selection_column")
      .map(([key, column]) => {
        const dynamic = isFnComputeValue(column.cell);
        const cell = isFnComputeValue(column.cell) ? undefined : column.cell;
        return {
          key,
          title: column.title,
          show: column.show ?? cell?.show ?? true,
          fixed: cell?.fixed,
          order: cell?.order,
          setting: cell?.setting,
          dynamic,
        };
      })
      .sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER))
      .map(({ key, title, show, fixed, order, setting, dynamic }) => includeOrder ? { key, title, show, fixed, order, setting, dynamic } : { key, title, show, fixed, setting, dynamic });
  }

  function saveColumnWidth(value: { key: string; width: number }): void {
    getPreferences().saveColumnWidth(value);
  }

  async function refresh(): Promise<void> {
    const id = ++requestId;
    loading.value = true;
    try {
      const query = Object.fromEntries(Object.entries(searchForm).filter(([, value]) => value !== "" && value !== null && value !== undefined));
      const sortQuery = sort.value.prop ? sort.value : undefined;
      const result = await props.request.pageRequest({ page: { offset: (page.current - 1) * page.pageSize, limit: page.pageSize }, query, sort: sortQuery });
      if (id !== requestId) return;
      data.value = result.records || [];
      selection.syncSelectionForRows(data.value);
      page.total = result.total || 0;
      tabsCounts.value = result.tabsCounts || {};
    } finally {
      if (id === requestId) loading.value = false;
    }
  }

  function updateCurrentPage(current: number): void {
    if (page.current === current) return;
    page.current = current;
    props.pagination?.["onUpdate:current"]?.(current);
  }

  function applySearch(): void {
    updateCurrentPage(1);
    void refresh();
  }

  function changeSort(value: { prop: string; asc: boolean }): void {
    sort.value = value;
    applySearch();
  }

  async function turnPage({ current, pageSize: nextPageSize }: { current: number; pageSize: number }): Promise<void> {
    const pageSizeChanged = page.pageSize !== nextPageSize;
    updateCurrentPage(current);
    if (pageSizeChanged) {
      getPreferences().setPageSize(nextPageSize);
    }
    await refresh();
  }

  function changePage(current: number, pageSize: number): void {
    if (!getPreferences().preferencesLoaded.value) return;
    void turnPage({ current, pageSize });
  }

  return {
    ...selection,
    data,
    loading,
    columnSettingsOpen,
    size,
    pageSize,
    density,
    page,
    sort,
    tabsCounts,
    baseTableColumns,
    tableColumns,
    columnSettingsColumns,
    defaultColumnSettings,
    tableProps,
    columnSettingsProps,
    saveColumnWidth,
    refresh,
    applySearch,
    changeSort,
    turnPage,
    changePage,
  };
}
