<template>
  <div class="fn-button-group" role="group" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="{ active: Object.is(modelValue, option.value) }"
      :disabled="disabled || option.disabled"
      :aria-label="option.ariaLabel || option.label || option.title || String(option.value)"
      :aria-pressed="Object.is(modelValue, option.value)"
      :title="option.title || option.label"
      @click="select(option.value)"
    >
      <FnIcon v-if="option.icon" :icon="option.icon" />
      <span v-if="option.label" class="fn-button-group-label">{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import FnIcon from "./fn-icon.vue";

export interface FnButtonGroupOption {
  value: string | number;
  label?: string;
  title?: string;
  ariaLabel?: string;
  icon?: Component;
  disabled?: boolean;
}

const props = withDefaults(defineProps<{ modelValue?: string | number; options: FnButtonGroupOption[]; label: string; disabled?: boolean }>(), { disabled: false });
const emit = defineEmits<{ "update:modelValue": [value: string | number]; change: [value: string | number] }>();

function select(value: string | number): void {
  const option = props.options.find(item => Object.is(item.value, value));
  if (props.disabled || option?.disabled) return;
  emit("update:modelValue", value);
  emit("change", value);
}
</script>

<style lang="less">
.fn-button-group {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid var(--fn-color-border, #d7dee8);
  border-radius: 6px;
  vertical-align: middle;
  button {
    display: inline-flex;
    width: 30px;
    min-height: 30px;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0 7px;
    border: 0;
    border-right: 1px solid var(--fn-color-border-secondary, #e4e8ee);
    color: var(--fn-color-text-secondary, #667085);
    background: var(--fn-color-bg-container, #fff);
    cursor: pointer;
    font: inherit;
    &:last-child { border-right: 0; }
    &:hover:enabled:not(.active) { background: var(--fn-color-fill-secondary, #f2f4f7); }
    &.active { color: #fff; background: var(--fn-color-primary, #1677ff); }
    &:disabled { color: var(--fn-color-text-tertiary, #98a2b1); cursor: not-allowed; }
    &:disabled.active { background: var(--fn-color-fill-secondary, #f2f4f7); }
    &:focus-visible { position: relative; z-index: 1; outline: 2px solid var(--fn-color-primary, #1677ff); outline-offset: -2px; }
  }
  .fn-button-group-label { white-space: nowrap; }
  .dark & {
    border-color: #424b59;
    button { border-color: #424b59; background: #232a34; }
  }
}
</style>
