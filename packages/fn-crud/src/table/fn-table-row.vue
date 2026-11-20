<template>
  <tr>
    <template v-if="rowSlot">
      <td :colspan="columns.length"><FnRender :render="rowSlot" :ctx="{ row, index }" /></td>
    </template>
    <template v-else>
      <td v-for="column in resolvedColumns" :key="column.key" :class="props.columnClasses(column)" :style="props.columnStyle(column, column.key)" :title="column.ellipsis ? String(getCellValue(row, column) ?? '') : undefined">
        <FnRender v-if="column.slots?.default" :render="column.slots.default" :ctx="rowContext" />
        <FnTableCell v-else :column="column" :context="rowContext" :value="getCellValue(row, column)" @component-ref="setComponentRef(column.key, $event)" />
      </td>
    </template>
  </tr>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FnRender from "../components/fn-render";
import type { FnDynamic, FnRenderSlot, FnRowContext, FnTableColumn, FnTableRow } from "../types/index";
import { resolveComputedValue } from "../use/compute";
import FnTableCell from "./fn-table-cell.vue";

interface FnTableRowColumn extends FnTableColumn<FnTableRow> {
  key: string;
  sourceCell: FnDynamic<FnTableColumn<FnTableRow>>;
}

const props = defineProps<{
  row: FnTableRow;
  index: number;
  columns: FnTableRowColumn[];
  rowSlot?: FnRenderSlot;
  columnClasses: (column: FnTableRowColumn) => Array<string | undefined>;
  columnStyle: (column: FnTableRowColumn, key: string) => Record<string, any>;
}>();

const componentRefs = new Map<string, unknown>();
const rowContext = computed<FnRowContext>(() => ({
  type: "row",
  row: props.row,
  form: props.row,
  index: props.index,
  getComponentRef: key => componentRefs.get(key || "default"),
}));

const resolvedColumns = computed(() => props.columns.map(column => {
  const cell = resolveComputedValue(column.sourceCell, rowContext.value) as FnTableColumn<FnTableRow>;
  return { ...column, ...cell, key: column.key, title: cell.title ?? column.title };
}));

function getCellValue(row: FnTableRow, column: FnTableRowColumn): unknown {
  return column.key.split(".").reduce<unknown>((value, key) => {
    if (typeof value !== "object" || value === null) {
      return undefined;
    }
    return (value as Record<string, unknown>)[key];
  }, row);
}

function setComponentRef(key: string, instance: unknown): void {
  if (instance) {
    componentRefs.set(key, instance);
  } else {
    componentRefs.delete(key);
  }
}
</script>
