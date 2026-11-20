import { computed, onMounted, reactive, ref, type Ref } from "vue";
import { createFnCrudPreferenceSnapshot, createFnCrudPreferenceStorage, getFnCrudPreferenceKey, mergeFnCrudPreferences } from "../preferences";
import { useTableColumns, useTableProps } from "../use.tsx";
import { FN_CRUD_BLANK_COLUMN_KEY } from "./use-fn-crud";
import { useSelection } from "./use-selection";
import { isFnComputeValue } from "./compute";
import type { FnFeedbackApi } from "../provider/context";
import type { FnColumnSettingsColumn, FnCrudOptions, FnCrudPreferences, FnTableRow } from "../types/index";

export function useTable(props: FnCrudOptions, rowHandleProps: Ref<Record<string, any>>, searchForm: Record<string, any>, notification: FnFeedbackApi) {
  const data = ref<FnTableRow[]>([]);
  const loading = ref(false);
  const columnSettingsOpen = ref(false);
  const columnPreferences = ref<FnCrudPreferences["columns"]>({});
  const pageSizePreference = ref<number>();
  const densityPreference = ref<"compact" | "comfort">();
  const preferencesLoaded = ref(false);
  const preferencesKey = ref("");
  const preferencesStorage = computed(() => createFnCrudPreferenceStorage(props.preferenceStorage));
  const size = computed(() => props.table?.size ?? 14);
  const pageSize = computed(() => pageSizePreference.value ?? props.pagination?.pageSize ?? 10);
  const density = computed(() => densityPreference.value ?? props.table?.density ?? "comfort");
  const page = reactive({ current: props.pagination?.current || 1, get pageSize() { return pageSize.value; }, total: 0 });
  const sort = ref({ prop: "", asc: true });
  const tabsCounts = ref<Record<string, number>>({});
  const selection = useSelection(props, data);
  const baseTableColumns = useTableColumns(props, rowHandleProps);
  const tableColumns = computed(() => {
    const columns = mergeFnCrudPreferences(baseTableColumns.value, { columns: columnPreferences.value, pageSize: pageSize.value, density: density.value });
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
    "onUpdate:columns": updateColumnSettings,
  }));
  let requestId = 0;
  let preferenceSaveQueue: Promise<void> = Promise.resolve();

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

  function createCurrentPreferenceSnapshot(): FnCrudPreferences {
    return createFnCrudPreferenceSnapshot(columnPreferences.value, pageSizePreference.value, densityPreference.value);
  }

  function savePreferences(): void {
    if (!preferencesLoaded.value || !preferencesKey.value) return;
    const snapshot = createCurrentPreferenceSnapshot();
    const save = preferenceSaveQueue.then(() => preferencesStorage.value.set(preferencesKey.value, snapshot));
    preferenceSaveQueue = save.catch(error => {
      notification.error({ message: "列表偏好保存失败", description: String(error) });
    });
  }

  function normalizeColumnPreferences(savedColumns: FnCrudPreferences["columns"]): FnCrudPreferences["columns"] {
    const defaults = new Map(defaultColumnSettings.value.map((column, order) => [column.key, { column, order }]));
    const result: FnCrudPreferences["columns"] = {};

    for (const [key, saved] of Object.entries(savedColumns)) {
      const base = baseTableColumns.value[key];
      const defaultSetting = defaults.get(key);
      if (!base || key === "rowHandle" || key === FN_CRUD_BLANK_COLUMN_KEY || key === "__fn_selection_column" || !defaultSetting) continue;
      const cell = isFnComputeValue(base.cell) ? undefined : base.cell;
      const preference = { ...saved };
      if (preference.show === (base.show ?? cell?.show ?? true)) delete preference.show;
      if (preference.fixed === (cell?.fixed ?? null)) delete preference.fixed;
      if (preference.order === cell?.order || preference.order === defaultSetting.order) delete preference.order;
      if (preference.width === cell?.width) delete preference.width;
      if (Object.keys(preference).length) result[key] = preference;
    }

    return result;
  }

  async function initializePreferences(): Promise<void> {
    preferencesKey.value = getFnCrudPreferenceKey(props.id, globalThis.location?.href || "");
    try {
      const preferences = await preferencesStorage.value.get(preferencesKey.value);
      if (preferences) {
        const savedColumns = preferences.columns && typeof preferences.columns === "object" ? preferences.columns : {};
        columnPreferences.value = normalizeColumnPreferences(savedColumns);
        if (typeof preferences.pageSize === "number" && Number.isFinite(preferences.pageSize) && preferences.pageSize > 0) {
          pageSizePreference.value = preferences.pageSize;
        }
        if (preferences.density === "compact" || preferences.density === "comfort") {
          densityPreference.value = preferences.density;
        }
      }
    } catch (error) {
      notification.warning?.({ message: "读取列表偏好失败，使用默认设置", description: String(error) });
    } finally {
      preferencesLoaded.value = true;
    }
    await refresh();
  }

  function changeDensity(value: "compact" | "comfort"): void {
    densityPreference.value = value;
    props.table?.["onUpdate:density"]?.(value);
    savePreferences();
  }

  function updateColumnSettings(columns: FnColumnSettingsColumn[]): void {
    const defaults = defaultColumnSettings.value;
    const defaultByKey = new Map(defaults.map((column, order) => [column.key, { column, order }]));
    const next = { ...columnPreferences.value };

    for (const [order, setting] of columns.entries()) {
      const base = baseTableColumns.value[setting.key];
      const defaultSetting = defaultByKey.get(setting.key);
      if (!base || !defaultSetting || isFnComputeValue(base.cell) || setting.setting?.show === false || setting.setting?.disabled) continue;

      const preference = { ...next[setting.key] };
      const baseCell = base.cell || {};
      if (setting.show === (base.show ?? baseCell.show ?? true)) delete preference.show;
      else preference.show = setting.show;
      if (setting.fixed === baseCell.fixed) delete preference.fixed;
      else preference.fixed = setting.fixed ?? null;
      if (order === defaultSetting.order) delete preference.order;
      else preference.order = order;

      if (Object.keys(preference).length) next[setting.key] = preference;
      else delete next[setting.key];
    }

    columnPreferences.value = next;
    savePreferences();
  }

  function saveColumnWidth({ key, width }: { key: string; width: number }): void {
    if (!baseTableColumns.value[key] || key === "rowHandle" || key === FN_CRUD_BLANK_COLUMN_KEY || key === "__fn_selection_column") return;
    columnPreferences.value = { ...columnPreferences.value, [key]: { ...columnPreferences.value[key], width } };
    savePreferences();
  }

  function resetColumnSettings(): void {
    columnPreferences.value = {};
    savePreferences();
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
      pageSizePreference.value = nextPageSize;
      props.pagination?.["onUpdate:pageSize"]?.(nextPageSize);
      savePreferences();
    }
    await refresh();
  }

  function changePage(current: number, pageSize: number): void {
    if (!preferencesLoaded.value) return;
    void turnPage({ current, pageSize });
  }

  onMounted(() => void initializePreferences());

  return {
    ...selection,
    data,
    loading,
    columnSettingsOpen,
    columnPreferences,
    pageSizePreference,
    densityPreference,
    preferencesLoaded,
    preferencesKey,
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
    initializePreferences,
    savePreferences,
    updateColumnSettings,
    changeDensity,
    saveColumnWidth,
    resetColumnSettings,
    refresh,
    applySearch,
    changeSort,
    turnPage,
    changePage,
  };
}
