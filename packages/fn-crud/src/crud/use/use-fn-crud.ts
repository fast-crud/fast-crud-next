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
  state.onToggleDensity = () => {
    const currentDensity = state.table?.density || "comfort";
    const nextDensity = currentDensity === "comfort" ? "compact" : "comfort";
    if (!state.table) {
      state.table = { density: nextDensity };
    } else {
      state.table.density = nextDensity;
    }
  };
  return state;
}

export function installFnCrud(options: { commonOptions: () => Partial<FnCrudOptions> }): void {
  fnCrudContext.configure(options);
}
