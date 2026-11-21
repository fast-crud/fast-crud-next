<template>
  <span class="fn-checkbox-control" :class="{ 'is-disabled': disabled }">
    <input
      ref="input"
      class="fn-checkbox"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      v-bind="$attrs"
      @change="change"
    />
    <Minus v-if="indeterminate" class="fn-checkbox-icon" :size="11" :stroke-width="3" aria-hidden="true" />
    <Check v-else-if="modelValue" class="fn-checkbox-icon" :size="11" :stroke-width="3" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import { Check, Minus } from "@lucide/vue";
import { useTemplateRef, watchPostEffect } from "vue";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{ modelValue?: boolean; disabled?: boolean; indeterminate?: boolean }>(), { modelValue: false, disabled: false, indeterminate: false });
const emit = defineEmits<{ "update:modelValue": [value: boolean]; change: [value: boolean, event: Event] }>();
const input = useTemplateRef<HTMLInputElement>("input");

watchPostEffect(() => {
  if (input.value) input.value.indeterminate = props.indeterminate;
});

function change(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  emit("update:modelValue", checked);
  emit("change", checked, event);
}
</script>

<style lang="less">
.fn-checkbox {
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  flex: none;
  margin: 0;
  appearance: none;
  border: 1px solid var(--fn-color-border, #c5ceda);
  border-radius: 4px;
  background: var(--fn-color-bg-container, #fff);
  cursor: pointer;
  vertical-align: middle;
  &:checked,
  &:indeterminate {
    border-color: var(--fn-color-primary, #1677ff);
    background: var(--fn-color-primary, #1677ff);
  }
  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--fn-color-primary, #1677ff) 50%, transparent);
    outline-offset: 2px;
  }
  &:disabled {
    border-color: var(--fn-color-border-secondary, #e4e8ee);
    background: var(--fn-color-fill-secondary, #f2f4f7);
    cursor: not-allowed;
  }
}

.fn-checkbox-control {
  position: relative;
  display: inline-flex;
  width: 16px;
  height: 16px;
  flex: none;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  .fn-checkbox-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    color: #fff;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }
  &.is-disabled .fn-checkbox-icon {
    color: var(--fn-color-text-tertiary, #98a2b1);
  }
}
</style>
