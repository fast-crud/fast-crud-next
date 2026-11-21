<template>
  <button
    class="fn-switch"
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  ></button>
</template>

<script setup lang="tsx">
const props = withDefaults(defineProps<{ modelValue?: boolean; disabled?: boolean }>(), {
  modelValue: false,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [value: boolean, event: MouseEvent];
}>();

function toggle(event: MouseEvent): void {
  if (props.disabled) return;

  const checked = !props.modelValue;
  emit("update:modelValue", checked);
  emit("change", checked, event);
}
</script>

<style lang="less">
.fn-switch {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  inline-size: 36px;
  block-size: 22px;
  flex: none;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--fn-color-text-quaternary, #8b95a5);
  cursor: pointer;
  vertical-align: middle;

  &::before {
    position: absolute;
    inset-block-start: 3px;
    inset-inline-start: 3px;
    inline-size: 16px;
    block-size: 16px;
    border-radius: 50%;
    background: #fff;
    content: "";
  }

  &[aria-checked="true"] {
    background: var(--fn-color-primary, #1677ff);

    &::before {
      inset-inline-start: 17px;
    }
  }

  &:focus-visible {
    outline: 2px solid var(--fn-color-primary, #1677ff);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: background-color 150ms ease;

    &::before {
      transition: inset-inline-start 150ms ease;
    }
  }
}
</style>
