<template>
  <FnRender v-if="props.slots?.default" :render="props.slots.default" :ctx="context" />
  <form v-else class="fn-search" v-bind="resolvedProps.formProps" @submit.prevent="submit">
    <FnRender v-if="props.slots?.before" :render="props.slots.before" :ctx="context" />
    <FnComponentRender
      v-for="column in searchColumns"
      :key="column.key"
      v-bind="getComponent(column)"
      :model-value="searchState.form[column.key]"
      scope="table-search"
      :field-label="column.title"
      @update:model-value="updateField(column.key, $event)"
      @press-enter="submit"
    />
    <FnRender v-if="props.slots?.buttons" :render="props.slots.buttons" :ctx="{ ...context, buttons: buttonProps }" />
    <template v-else><FnButton v-for="(button, key) in contextualButtonProps" :key="key" v-bind="button" /></template>
    <FnRender v-if="props.slots?.after" :render="props.slots.after" :ctx="context" />
  </form>
</template>
<script setup lang="ts">
import { computed, inject, type Component } from "vue";
import { RotateCcw, Search } from "@lucide/vue";
import FnComponentRender from "../../components/render/fn-component-render.ts";
import FnButton from "../../components/button/fn-button.vue";
import FnInput from "../../components/input/fn-input.vue";
import FnRender from "../../components/render/fn-render.ts";
import type { FnButtonItem, FnSearchProps, FnSearchColumn, FnSearchColumnResolved, FnSearchContext } from "../../types/index.ts";
import { useCompute } from "../use/use-compute";
import { fnCrudSearchKey } from "../../components/provider/context.ts";
const props = defineProps<FnSearchProps>();
const { resolveComputedValue } = useCompute();
const injectedSearchState = inject(fnCrudSearchKey);
if (!injectedSearchState) {
  throw new Error("FnSearch 必须在 FnCrud 内使用");
}
const searchState = injectedSearchState;
const context = computed<FnSearchContext>(() => ({ type: "search", form: searchState.form, columns: props.columns, reset, search: searchState.search }));
const resolvedProps = computed(
  () =>
    resolveComputedValue({ columns: props.columns, buttons: props.buttons, formProps: props.formProps }, context.value) as Omit<FnSearchProps, "columns"> & {
      columns: Record<string, FnSearchColumn>;
    }
);
const searchColumns = computed(() =>
  Object.entries(resolvedProps.value.columns)
    .map(([key, column]) => ({ ...column, key }))
    .filter(column => column.show !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
);
const buttonProps = computed(
  () =>
    resolvedProps.value.buttons || {
      search: { text: "查询", type: "default", icon: Search, click: submit },
      reset: { text: "重置", type: "default", icon: RotateCcw, click: reset },
    }
);
const contextualButtonProps = computed(() => Object.fromEntries(Object.entries(buttonProps.value).map(([key, button]) => [
  key,
  {
    ...button,
    click: button.click ? () => button.click?.(context.value) : undefined,
    items: button.items?.map((item: FnButtonItem<FnSearchContext>) => ({
      ...item,
      click: item.click ? () => item.click?.(context.value) : undefined,
    })),
  },
])));
function getComponent(column: FnSearchColumnResolved): { name: string | Component; [key: string]: any } {
  const resolvedComponent = resolveComputedValue(column.component || {}, context.value);
  const component = { ...resolvedComponent, name: resolvedComponent.name ?? FnInput };
  if (!column.width) return component;
  const width = typeof column.width === "number" ? `${column.width}px` : column.width;
  return { ...component, style: { ...resolvedComponent.style, width } };
}
function submit(): void {
  searchState.search();
}
function updateField(key: string, value: unknown): void {
  searchState.form[key] = value;
}
function reset(): void {
  for (const column of searchColumns.value) {
    searchState.form[column.key] = "";
  }
  searchState.search();
}
</script>
<style lang="less">
.fn-search {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
  @media (max-width: 650px) {
    flex-wrap: wrap;
    > * {
      flex: 1 1 auto;
      min-width: 120px;
    }
  }
}
</style>
