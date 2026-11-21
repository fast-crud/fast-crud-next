<template>
  <input
    class="fn-radio"
    type="radio"
    :name="name"
    :value="value"
    :checked="Object.is(modelValue, value)"
    :disabled="disabled"
    v-bind="$attrs"
    @change="change"
  />
</template>

<script setup lang="ts">
import type { FnOptionValue } from "./types";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{ modelValue?: FnOptionValue; value: FnOptionValue; name?: string; disabled?: boolean }>(), { modelValue: undefined, disabled: false });
const emit = defineEmits<{ "update:modelValue": [value: FnOptionValue]; change: [value: FnOptionValue, event: Event] }>();

function change(event: Event): void {
  if ((event.target as HTMLInputElement).checked) {
    emit("update:modelValue", props.value);
    emit("change", props.value, event);
  }
}
</script>

<style lang="less">
.fn-radio {
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  flex: none;
  margin: 0;
  appearance: none;
  border: 1px solid var(--fn-color-border, #c5ceda);
  border-radius: 50%;
  background: var(--fn-color-bg-container, #fff);
  cursor: pointer;
  vertical-align: middle;
  &:checked { border-color: var(--fn-color-primary, #1677ff); }
  &:checked::after {
    display: block;
    width: 8px;
    height: 8px;
    margin: 3px;
    border-radius: 50%;
    background: var(--fn-color-primary, #1677ff);
    content: "";
  }
  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--fn-color-primary, #1677ff) 50%, transparent);
    outline-offset: 2px;
  }
  &:disabled { background: var(--fn-color-fill-secondary, #f2f4f7); cursor: not-allowed; }
}
</style>
