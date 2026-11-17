<template>
  <input class="fn-input" :value="modelValue" :disabled="disabled" :placeholder="placeholder" :type="type" v-bind="$attrs" @input="handleInput" @blur="$emit('blur', $event)" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ modelValue?: string | number; disabled?: boolean; placeholder?: string; type?: string }>(), { type: "text" });
const emit = defineEmits<{ "update:modelValue": [value: string]; blur: [event: FocusEvent] }>();

function handleInput(event: Event): void {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>

<style lang="less">
.fn-input {
  display: block;
  width: 100%;
  min-height: 32px;
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
