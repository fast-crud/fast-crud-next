<template>
  <span class="fn-dict-tag" :class="{ 'fn-dict-tag--tags': type === 'tag' }">
    <template v-if="items.length === 0">{{ emptyText }}</template>
    <template v-else-if="type === 'text'">{{ items.map(item => item.label).join(separator) }}</template>
    <template v-else>
      <FnTag v-for="(item, index) in items" :key="index" :color="item.color">{{ item.label }}</FnTag>
    </template>
  </span>
</template>

<script setup lang="tsx">
import { computed } from "vue";
import FnTag from "./fn-tag.vue";
import type { FnOptionValue, FnSelectOption } from "../selection/types";

const props = withDefaults(defineProps<{
  modelValue?: FnOptionValue | FnOptionValue[];
  options?: Array<FnSelectOption & { color?: string }>;
  type?: "tag" | "text";
  separator?: string;
  color?: string;
  emptyText?: string;
}>(), { options: () => [], type: "tag", separator: "、", emptyText: "—" });

const items = computed(() => {
  const values = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
  return values.filter(value => value != null && value !== "").map(value => {
    const option = props.options.find(item => item.value === value)
      ?? props.options.find(item => String(item.value) === String(value));
    return { label: option?.label ?? String(value), color: option?.color ?? props.color };
  });
});
</script>

<style lang="less">
.fn-dict-tag {
  &.fn-dict-tag--tags {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
  }
}
</style>
