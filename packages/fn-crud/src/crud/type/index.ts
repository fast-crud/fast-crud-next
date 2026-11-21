import { shallowReactive } from "vue";
import type { FnCrudColumnType } from "../types";
import { builtinColumnTypes } from "./builtins";

const columnTypes = shallowReactive(new Map(Object.entries(builtinColumnTypes)));

export function addTypes(types: Record<string, FnCrudColumnType>): void {
  for (const [name, definition] of Object.entries(types)) {
    columnTypes.set(name, definition);
  }
}

export function getColumnType(name: string): FnCrudColumnType | undefined {
  return columnTypes.get(name);
}
