<template>
  <textarea v-if="multiline" class="fn-input" :value="modelValue" :disabled="disabled" :placeholder="placeholder" :aria-label="label || fieldLabel || placeholder" @input="handleInput" @blur="$emit('blur', $event)" />
  <input v-else class="fn-input" :value="modelValue" :disabled="disabled" :placeholder="placeholder" :aria-label="label || fieldLabel || placeholder" :type="type" @input="handleInput" @blur="$emit('blur', $event)" />
</template>

<script setup lang="ts">
import { inject } from "vue";
import { fnFieldLabelKey } from "../render/context.ts";

const props = withDefaults(defineProps<{ modelValue?: string | number; disabled?: boolean; label?: string; placeholder?: string; type?: string; multiline?: boolean }>(), { type: "text" });
const fieldLabel = inject(fnFieldLabelKey, undefined);
const emit = defineEmits<{ "update:modelValue": [value: string | number | undefined]; blur: [event: FocusEvent] }>();

function handleInput(event: Event): void {
  const input = event.target as HTMLInputElement | HTMLTextAreaElement;
  if (!props.multiline && props.type === "number") {
    const number = (input as HTMLInputElement).valueAsNumber;
    emit("update:modelValue", Number.isNaN(number) ? undefined : number);
    return;
  }
  emit("update:modelValue", input.value);
}
</script>

<style lang="less">
.fn-input {
  display: block;
  width: 100%;
  min-height: var(--fn-control-height, 32px);
  padding: 4px 10px;
  border: 1px solid var(--fn-color-border, #d0d5dd);
  border-radius: var(--fn-border-radius, 5px);
  outline: none;
  color: var(--fn-color-text, #344054);
  background: var(--fn-color-bg-container, #fff);
  font: inherit;

  &:focus {
    border-color: var(--fn-color-primary, #1677ff);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--fn-color-primary, #1677ff) 18%, transparent);
  }

  &:disabled {
    color: var(--fn-color-text-tertiary, #98a2b1);
    background: var(--fn-color-fill-secondary, #f2f4f7);
    cursor: not-allowed;
  }

}
</style>
