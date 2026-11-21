<template>
  <div class="fn-radio-group" role="radiogroup">
    <label v-for="option in visibleOptions" :key="typeof option.value + ':' + option.value" class="fn-radio-group-option">
      <FnRadio
        :name="name ?? groupName"
        :model-value="modelValue"
        :value="option.value"
        :disabled="disabled || option.disabled"
        @update:model-value="$emit('update:modelValue', $event)"
      />
      {{ option.label }}
    </label>
  </div>
</template>

<script setup lang="tsx">
import { computed, useId } from "vue";
import FnRadio from "./fn-radio.vue";
import type { FnOptionValue, FnSelectOption } from "./types";

const props = withDefaults(defineProps<{
  modelValue?: FnOptionValue;
  options?: FnSelectOption[];
  name?: string;
  disabled?: boolean;
}>(), { modelValue: undefined, options: () => [] });
defineEmits<{ "update:modelValue": [value: FnOptionValue] }>();
const groupName = useId();
const visibleOptions = computed(() => props.options.filter(option => option.show !== false));
</script>

<style lang="less">
.fn-radio-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;

  .fn-radio-group-option {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
}
</style>
