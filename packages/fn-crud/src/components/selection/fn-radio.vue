<template>
  <span class="fn-radio-control" :class="{ 'is-disabled': disabled, 'is-checked': Object.is(modelValue, value) }">
    <input
      class="fn-radio"
      type="radio"
      :name="name"
      :value="value"
      :checked="Object.is(modelValue, value)"
      :disabled="disabled"
      :aria-label="label || fieldLabel"
      v-bind="$attrs"
      @change="change"
    />
    <span class="fn-radio-icon" aria-hidden="true"></span>
  </span>
</template>

<script setup lang="tsx">
import { inject } from "vue";
import { fnFieldLabelKey } from "../render/context.ts";
import type { FnOptionValue } from "./types";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{ modelValue?: FnOptionValue; value: FnOptionValue; name?: string; label?: string; disabled?: boolean }>(), { modelValue: undefined, disabled: false });
const fieldLabel = inject(fnFieldLabelKey, undefined);
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
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  flex: none;
  margin: 0;
  appearance: none;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--fn-color-primary, #1677ff) 50%, transparent);
    outline-offset: 2px;
  }
  &:disabled { cursor: not-allowed; }
}

.fn-radio-control {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  flex: none;
  vertical-align: middle;

  .fn-radio-icon {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: 1px solid var(--fn-color-border, #c5ceda);
    border-radius: 50%;
    background: var(--fn-color-bg-container, #fff);
    pointer-events: none;
  }

  &.is-checked .fn-radio-icon {
    border-color: var(--fn-color-primary, #1677ff);

    &::after {
      position: absolute;
      inset: 3px;
      border-radius: 50%;
      background: var(--fn-color-primary, #1677ff);
      content: "";
    }
  }

  &.is-disabled .fn-radio-icon {
    background: var(--fn-color-fill-secondary, #f2f4f7);
    opacity: 0.7;
  }
}
</style>
