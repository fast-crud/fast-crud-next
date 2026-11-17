import type { FnCrudOptions } from "../types/index";
import type { FnDynamicType } from "../types/index";
import type { UnwrapNestedRefs } from "vue";
import { fnCrudContext } from "../provider/context";

export type FnCrudOptionsInput<Row = any> = FnDynamicType<FnCrudOptions<Row>>;

export type FnCrudState<Row = any> = UnwrapNestedRefs<FnCrudOptionsInput<Row>> & {
  onToggleDensity?: () => void;
};

export type FnCrudReactiveState<Row = any> = FnCrudState<Row>;

export function useFnCrud<Row = any>(state: FnCrudReactiveState<Row>): FnCrudReactiveState<Row>;
export function useFnCrud<Row = any>(state: FnCrudReactiveState<Row>): FnCrudReactiveState<Row> {
  state.table ||= {};
  const onUpdateDensity = state.table["onUpdate:density"];
  const onUpdateSize = state.table["onUpdate:size"];
  state.table["onUpdate:density"] = density => {
    state.table!.density = density;
    onUpdateDensity?.(density);
  };
  state.table["onUpdate:size"] = size => {
    state.table!.size = size;
    onUpdateSize?.(size);
  };
  state.pagination ||= {};
  const onUpdateCurrent = state.pagination["onUpdate:current"];
  state.pagination["onUpdate:current"] = current => {
    state.pagination!.current = current;
    onUpdateCurrent?.(current);
  };
  const onUpdatePageSize = state.pagination["onUpdate:pageSize"];
  state.pagination["onUpdate:pageSize"] = pageSize => {
    state.pagination!.pageSize = pageSize;
    onUpdatePageSize?.(pageSize);
  };
  state.onToggleDensity = () => {
    const currentDensity = state.table?.density || "comfort";
    const nextDensity = currentDensity === "comfort" ? "compact" : "comfort";
    state.table?.["onUpdate:density"]?.(nextDensity);
  };
  return state;
}

export function installFnCrud(options: { commonOptions: () => Partial<FnCrudOptions> }): void {
  fnCrudContext.configure(options);
}
