import { computed, ref } from "vue";
import { FN_CRUD_BLANK_COLUMN_KEY } from "./use-fn-crud";
import { compute, isFnComputeValue, resolveComputedValue } from "./compute";
import type { FnFeedbackApi } from "../components/provider/context";
import type { FnColumnSettingsColumn, FnCrudColumn, FnCrudOptions, FnCrudPreferenceStorage, FnCrudPreferences, FnTableColumn } from "../types/index";

const storagePrefix = "fn-crud:";

export function getFnCrudPreferenceKey(id: string | undefined, href: string): string {
  if (id) return `${storagePrefix}${id}`;
  const hashIndex = href.indexOf("#");
  const route = hashIndex >= 0 ? href.slice(hashIndex + 1) : href;
  const routePath = route.split(/[?#]/, 1)[0] || "/";
  if (routePath.startsWith("/")) return `${storagePrefix}${routePath}`;
  try {
    return `${storagePrefix}${new URL(href).pathname}`;
  } catch {
    return `${storagePrefix}/${routePath}`;
  }
}

export function createFnCrudPreferenceStorage(remote?: FnCrudPreferenceStorage): FnCrudPreferenceStorage {
  return {
    async get(key) {
      if (remote) {
        try {
          return await remote.get(key);
        } catch {
          // Keep the local snapshot available when the remote preference service is unreachable.
        }
      }
      const value = globalThis.localStorage?.getItem(key);
      return value ? (JSON.parse(value) as FnCrudPreferences) : undefined;
    },
    async set(key, value) {
      if (remote) {
        try {
          globalThis.localStorage?.setItem(key, JSON.stringify(value));
        } catch {
          // Remote storage remains authoritative when browser storage is unavailable.
        }
        await remote.set(key, value);
        return;
      }
      globalThis.localStorage?.setItem(key, JSON.stringify(value));
    },
    async remove(key) {
      if (remote?.remove) await remote.remove(key);
      globalThis.localStorage?.removeItem(key);
    },
  };
}

export function mergeFnCrudPreferences<Row>(columns: Record<string, FnCrudColumn<Row>>, preferences?: FnCrudPreferences): Record<string, FnCrudColumn<Row>> {
  const result: Record<string, FnCrudColumn<Row>> = {};
  const savedColumns = preferences?.columns || {};

  for (const [key, column] of Object.entries(columns)) {
    const saved = savedColumns[key];
    if (!saved) {
      result[key] = column;
      continue;
    }

    const mergeCell = (cell: FnTableColumn<Row>) => {
      const nextCell = { ...cell };
      if (saved.order !== undefined) nextCell.order = saved.order;
      if (saved.fixed !== undefined) {
        if (saved.fixed === null) delete nextCell.fixed;
        else nextCell.fixed = saved.fixed;
      }
      if (saved.show !== undefined) nextCell.show = saved.show;
      if (saved.width !== undefined) nextCell.width = saved.width;
      return nextCell;
    };
    const sourceCell = column.cell;
    const cell = isFnComputeValue(sourceCell)
      ? compute(context => mergeCell(resolveComputedValue(sourceCell, context) as unknown as FnTableColumn<Row>))
      : mergeCell((sourceCell || {}) as unknown as FnTableColumn<Row>);
    result[key] = { ...column, show: saved.show ?? column.show, cell };
  }

  return result;
}

export function createFnCrudPreferenceSnapshot(columns: FnCrudPreferences["columns"], pageSize?: number, density?: "compact" | "comfort"): FnCrudPreferences {
  return { columns: { ...columns }, pageSize, density };
}

export function useFnCrudPreferences(
  props: FnCrudOptions,
  getColumns: () => Record<string, FnCrudColumn<any>>,
  getDefaultColumnSettings: () => FnColumnSettingsColumn[],
  notification: FnFeedbackApi
) {
  const columnPreferences = ref<FnCrudPreferences["columns"]>({});
  const pageSizePreference = ref<number>();
  const densityPreference = ref<"compact" | "comfort">();
  const preferencesLoaded = ref(false);
  const preferencesKey = ref("");
  const preferencesStorage = computed(() => createFnCrudPreferenceStorage(props.preferenceStorage));
  const pageSize = computed(() => pageSizePreference.value ?? props.pagination?.pageSize ?? 10);
  const density = computed(() => densityPreference.value ?? props.table?.density ?? "comfort");
  let preferenceSaveQueue: Promise<void> = Promise.resolve();

  function savePreferences(): void {
    if (!preferencesLoaded.value || !preferencesKey.value) return;
    const snapshot = createFnCrudPreferenceSnapshot(columnPreferences.value, pageSizePreference.value, densityPreference.value);
    const save = preferenceSaveQueue.then(() => preferencesStorage.value.set(preferencesKey.value, snapshot));
    preferenceSaveQueue = save.catch(error => {
      notification.error({ message: "列表偏好保存失败", description: String(error) });
    });
  }

  function normalizeColumnPreferences(savedColumns: FnCrudPreferences["columns"]): FnCrudPreferences["columns"] {
    const defaults = new Map(getDefaultColumnSettings().map((column, order) => [column.key, { column, order }]));
    const result: FnCrudPreferences["columns"] = {};

    for (const [key, saved] of Object.entries(savedColumns)) {
      const base = getColumns()[key];
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
  }

  function updateColumnSettings(columns: FnColumnSettingsColumn[]): void {
    const defaults = getDefaultColumnSettings();
    const defaultByKey = new Map(defaults.map((column, order) => [column.key, { column, order }]));
    const next = { ...columnPreferences.value };

    for (const [order, setting] of columns.entries()) {
      const base = getColumns()[setting.key];
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
    if (!getColumns()[key] || key === "rowHandle" || key === FN_CRUD_BLANK_COLUMN_KEY || key === "__fn_selection_column") return;
    columnPreferences.value = { ...columnPreferences.value, [key]: { ...columnPreferences.value[key], width } };
    savePreferences();
  }

  function resetColumnSettings(): void {
    columnPreferences.value = {};
    savePreferences();
  }

  function changeDensity(value: "compact" | "comfort"): void {
    densityPreference.value = value;
    props.table?.["onUpdate:density"]?.(value);
    savePreferences();
  }

  function setPageSize(value: number): void {
    pageSizePreference.value = value;
    props.pagination?.["onUpdate:pageSize"]?.(value);
    savePreferences();
  }

  return {
    columnPreferences,
    pageSizePreference,
    densityPreference,
    preferencesLoaded,
    preferencesKey,
    pageSize,
    density,
    initializePreferences,
    savePreferences,
    updateColumnSettings,
    changeDensity,
    setPageSize,
    saveColumnWidth,
    resetColumnSettings,
    mergeColumns: mergeFnCrudPreferences,
  };
}

export type FnCrudPreferencesController = ReturnType<typeof useFnCrudPreferences>;
