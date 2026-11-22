<template>
  <div class="fn-checkbox-group" role="group" :aria-label="label || fieldLabel">
    <label v-for="option in visibleOptions" :key="typeof option.value + ':' + option.value" class="fn-checkbox-group-option">
      <FnCheckbox
        :model-value="selectedValues.includes(option.value)"
        :text="option.label"
        :disabled="disabled || option.disabled"
        @update:model-value="toggle(option.value, $event)"
      />
      {{ option.label }}
    </label>
  </div>
</template>

<script setup lang="tsx">
import { computed, inject } from "vue";
import { fnFieldLabelKey } from "../render/context.ts";
import FnCheckbox from "./fn-checkbox.vue";
import type { FnOptionValue, FnSelectOption } from "./types";

const props = withDefaults(defineProps<{
  modelValue?: FnOptionValue | FnOptionValue[];
  options?: FnSelectOption[];
  label?: string;
  disabled?: boolean;
}>(), { options: () => [] });
const emit = defineEmits<{ "update:modelValue": [value: FnOptionValue[]] }>();
const fieldLabel = inject(fnFieldLabelKey, undefined);
const selectedValues = computed(() => {
  const value = props.modelValue;
  if (Array.isArray(value)) return value;
  return value == null || value === "" ? [] : [value];
});
const visibleOptions = computed(() => props.options.filter(option => option.show !== false));

function toggle(value: FnOptionValue, checked: boolean): void {
  const current = selectedValues.value;
  if (checked === current.includes(value)) return;
  emit("update:modelValue", checked ? [...current, value] : current.filter(item => item !== value));
}
</script>

<style lang="less">
.fn-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;

  .fn-checkbox-group-option {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
}
</style>
