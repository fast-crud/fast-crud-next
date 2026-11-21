import type { FnCrudExpose, FnCrudOptions } from "../../types/index";
import type { FnDynamicType } from "../../types/index";
import type { Ref, UnwrapNestedRefs } from "vue";
import { toRaw } from "vue";
import { computed } from "vue";
import { fnCrudContext, type FnCrudInstallOptions } from "../../components/provider/context";
import { useMerge } from "../../components/use/use-merge";
import type { FnCrudI18n } from "../../locale";
import { addTypes } from "../type";

export type FnCrudOptionsInput<Row = any> = FnDynamicType<FnCrudOptions<Row>>;

export type FnCrudState<Row = any> = UnwrapNestedRefs<FnCrudOptionsInput<Row>> & {
  onToggleDensity?: () => void;
};

export type FnCrudReactiveState<Row = any> = FnCrudState<Row>;

export const FN_CRUD_BLANK_COLUMN_KEY = "__fn_blank_column";

export interface UseFnCrudOptions<Row = any> {
  state: FnCrudReactiveState<Row>;
  crudRef?: Ref<FnCrudExpose<Row> | undefined>;
  i18n?: FnCrudI18n;
}

export function useFnCrud<Row = any>({ state, crudRef, i18n }: UseFnCrudOptions<Row>): FnCrudReactiveState<Row> {
  const { merge } = useMerge();
  state.table ||= {};
  state.pagination ||= {};
  state.rowSelect ||= {};
  const commonOptions = fnCrudContext.getCommonOptions();
  const t = (key: string) => fnCrudContext.t(key, i18n);
  const defaultCrudOptions = {
    columns: {
      [FN_CRUD_BLANK_COLUMN_KEY]: {
        key: FN_CRUD_BLANK_COLUMN_KEY,
        title: "",
        cell: { width: "auto", order: state.rowHandle?.order ?? Infinity, resizable: false, setting: { show: false },render: () => null },
      },
    },
    actionbar: {
      show: true,
      buttons: {
        add: {
          text: computed(() => t("fnCrud.crud.actionbar.add")),
          click: crudRef ? () => crudRef.value?.form.openAddForm() : undefined,
          type: "primary",
          show: true,
          order: -100,
        },
        batch: {
          text: computed(() => t("fnCrud.crud.actionbar.batch")),
          type: "default",
          show: true,
          order: 0,
          buttonType: "dropdown",
          items: [{ key: "delete", label: computed(() => t("fnCrud.crud.actionbar.batchDelete")), danger: true }],
        },
      },
    },
    form:{
      dialog: {
        title: computed(() => t("fnCrud.crud.formDialog.edit")),
      },
    },
    rowSelect: {
      selectedRowKeys: [],
      onChange: selectedRowKeys => {
        state.rowSelect!.selectedRowKeys = [...selectedRowKeys];
      },
      fixed: "left",
    },
    table: {
      "onUpdate:density": density => {
        state.table!.density = density;
      },
      "onUpdate:size": size => {
        state.table!.size = size;
      },
    },
    pagination: {
      "onUpdate:current": current => {
        state.pagination!.current = current;
      },
      "onUpdate:pageSize": pageSize => {
        state.pagination!.pageSize = pageSize;
      },
    },
  } satisfies Omit<Partial<FnCrudOptions<Row>>, "actionbar" | "form"> & Record<"actionbar" | "form", unknown>;
  const commonTableOptions = commonOptions.table || {};
  const commonPaginationOptions = commonOptions.pagination || {};
  const localDensity = state.table["onUpdate:density"];
  const localSize = state.table["onUpdate:size"];
  const localCurrent = state.pagination["onUpdate:current"];
  const localPageSize = state.pagination["onUpdate:pageSize"];
  const localSelectionChange = state.rowSelect.onChange;
  state.table["onUpdate:density"] = density => {
    state.table!.density = density;
    (localDensity || commonTableOptions["onUpdate:density"])?.(density);
  };
  state.table["onUpdate:size"] = size => {
    state.table!.size = size;
    (localSize || commonTableOptions["onUpdate:size"])?.(size);
  };
  state.pagination["onUpdate:current"] = current => {
    state.pagination!.current = current;
    (localCurrent || commonPaginationOptions["onUpdate:current"])?.(current);
  };
  state.pagination["onUpdate:pageSize"] = pageSize => {
    state.pagination!.pageSize = pageSize;
    (localPageSize || commonPaginationOptions["onUpdate:pageSize"])?.(pageSize);
  };
  state.rowSelect.onChange = selectedRowKeys => {
    state.rowSelect!.selectedRowKeys = [...selectedRowKeys];
    (localSelectionChange || commonOptions.rowSelect?.onChange)?.([...selectedRowKeys]);
  };
  state.onToggleDensity = () => {
    const currentDensity = state.table?.density || "comfort";
    const nextDensity = currentDensity === "comfort" ? "compact" : "comfort";
    state.table?.["onUpdate:density"]?.(nextDensity);
  };
  // Resolve configuration overrides before Vue unwraps the default text refs.
  return merge(state, merge({}, defaultCrudOptions, commonOptions, toRaw(state)));
}

export function installFnCrud(options: FnCrudInstallOptions): void {
  fnCrudContext.configure(options);
  if (options.columnTypes) addTypes(options.columnTypes);
}
