import type { FnCrudExpose, FnCrudOptions } from "../types/index";
import type { FnDynamicType } from "../types/index";
import type { Ref, UnwrapNestedRefs } from "vue";
import { fnCrudContext } from "../provider/context";
import { useMerge } from "./use-merge";

export type FnCrudOptionsInput<Row = any> = FnDynamicType<FnCrudOptions<Row>>;

export type FnCrudState<Row = any> = UnwrapNestedRefs<FnCrudOptionsInput<Row>> & {
  onToggleDensity?: () => void;
};

export type FnCrudReactiveState<Row = any> = FnCrudState<Row>;

export const FN_CRUD_BLANK_COLUMN_KEY = "__fn_blank_column";

export interface UseFnCrudOptions<Row = any> {
  state: FnCrudReactiveState<Row>;
  crudRef?: Ref<FnCrudExpose<Row> | undefined>;
}

export function useFnCrud<Row = any>({ state, crudRef }: UseFnCrudOptions<Row>): FnCrudReactiveState<Row>;
export function useFnCrud<Row = any>({ state, crudRef }: UseFnCrudOptions<Row>): FnCrudReactiveState<Row> {
  const { merge } = useMerge();
  state.table ||= {};
  state.pagination ||= {};
  state.rowSelect ||= {};
  const commonOptions = fnCrudContext.getCommonOptions();
  const defaultCrudOptions: Partial<FnCrudOptions<Row>> = {
    columns: {
      [FN_CRUD_BLANK_COLUMN_KEY]: {
        key: FN_CRUD_BLANK_COLUMN_KEY,
        title: "",
        cell: { width: "auto", order: state.rowHandle?.order ?? Infinity, resizable: false, setting: { show: false },render: () => null },
      },
    },
    actionbar: {
      buttons: {
        add:{},
        batch: {
          text: "批量操作",
          type: "default",
          buttonType: "dropdown",
          items: [{ key: "delete", label: "批量删除", danger: true }],
        },
      },
    },
    form:{
      dialog: {
        title: "编辑",
      },
    },
    rowSelect: {
      selectedRowKeys: [],
      onChange: selectedRowKeys => {
        state.rowSelect!.selectedRowKeys = [...selectedRowKeys];
      },
      fixed: null,
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
  };
  if (crudRef) {
    defaultCrudOptions.actionbar!.buttons.add.click = () => crudRef.value?.form.openAddForm();
  }
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
  return merge(state, defaultCrudOptions, commonOptions, state);
}

export function installFnCrud(options: { commonOptions: () => Partial<FnCrudOptions> }): void {
  fnCrudContext.configure(options);
}
