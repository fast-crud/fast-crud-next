<template>
  <select v-model="selection" class="fn-select" :multiple="multiple" :disabled="disabled">
    <option v-if="!multiple" value="" :disabled="!clearable">{{ placeholder }}</option>
    <option v-for="option in visibleOptions" :key="String(option.value)" :value="option.value" :disabled="option.disabled">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="tsx">
import { computed } from "vue";

type Value = string | number | boolean;
const props = withDefaults(defineProps<{
  modelValue?: Value | Value[];
  options?: Array<{ value: Value; label: string; show?: boolean; disabled?: boolean }>;
  multiple?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  placeholder?: string;
}>(), { options: () => [], placeholder: "请选择" });
const emit = defineEmits<{ "update:modelValue": [value: Value | Value[]] }>();

const visibleOptions = computed(() => props.options.filter(option => option.show !== false));
const selection = computed({
  get: () => {
    const value = props.modelValue;
    if (props.multiple) return Array.isArray(value) ? value : [];
    return Array.isArray(value) ? "" : value ?? "";
  },
  set: value => emit("update:modelValue", value),
});
</script>

<style lang="less">
.fn-select {
  display: block;
  width: 100%;
  min-height: var(--fn-control-height, 32px);
  padding: 4px 10px;
  border: 1px solid var(--fn-color-border, #d0d5dd);
  border-radius: var(--fn-border-radius, 5px);
  background: var(--fn-color-bg-container, #fff);
  color: var(--fn-color-text, #344054);
  font: inherit;

  &:focus-visible {
    outline: 2px solid var(--fn-color-primary, #1677ff);
    outline-offset: 1px;
  }

  &:disabled {
    background: var(--fn-color-fill-secondary, #f2f4f7);
    color: var(--fn-color-text-tertiary, #98a2b3);
  }
}
</style>
