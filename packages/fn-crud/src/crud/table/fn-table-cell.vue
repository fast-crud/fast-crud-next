<template>
  <div class="fn-table-cell">
    <FnRender v-if="cell.show !== false && cellRender" :render="renderCell" />
    <FnComponentRender v-else-if="cell.show !== false && cell.component" :name="componentProps.name" :ref="instance => emit('componentRef', instance)" v-bind="componentProps" scope="table-cell" @update:model-value="updateCellValue" />
    <template v-else-if="cell.show !== false">{{ value ?? "—" }}</template>
  </div>
</template>
<script setup lang="ts">
import set from "lodash-es/set";
import { computed } from "vue";
import FnRender from "../../components/render/fn-render.ts";
import FnComponentRender from "../../components/render/fn-component-render.ts";
import type { FnTableColumn, FnTableRow, FnRowContext } from "../../types/index.ts";
const props = defineProps<{ column: FnTableColumn<FnTableRow> & { key: string }; context: FnRowContext; value: unknown }>();
const emit = defineEmits<{ componentRef: [instance: object | null] }>();
const cell = computed(() => props.column);
const cellRender = computed(() => typeof cell.value.render === "function" ? cell.value.render : undefined);
const componentProps = computed(() => {
  const component = { ...cell.value.component } as Record<string, any>;
  const modelProp = component.vModel || "modelValue";
  if (component.modelValue === undefined) {
    component.modelValue = component[modelProp] ?? props.value;
  }
  if (component[modelProp] === undefined) {
    component[modelProp] = component.modelValue;
  }
  return component;
});

function renderCell() {
  return cellRender.value?.(props.context);
}

function updateCellValue(value: unknown): void {
  set(props.context.row, props.column.key, value);
}
</script>
<style lang="less">
.fn-table-cell {
  min-width: 0;
}
</style>
