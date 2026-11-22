<template>
  <component
    :is="icons[type] ?? icons.info"
    :size="size"
    class="fn-feedback-icon"
    :class="`fn-feedback-icon--${type}`"
    aria-hidden="true"
  />
</template>

<script setup lang="tsx">
import { CircleAlert, CircleCheck, CircleX, Info, LoaderCircle } from "@lucide/vue";
import type { FnFeedbackItem } from "./fn-feedback.ts";

defineProps<{ type: FnFeedbackItem["type"]; size: number }>();

const icons = {
  info: Info,
  success: CircleCheck,
  warning: CircleAlert,
  error: CircleX,
  loading: LoaderCircle,
};
</script>

<style lang="less">
.fn-feedback-icon {
  --fn-feedback-color: var(--fn-color-info, var(--fn-color-primary));
  flex: none;
  fill: var(--fn-feedback-color);
  color: #fff;

  circle {
    stroke: var(--fn-feedback-color);
  }

  &--success {
    --fn-feedback-color: var(--fn-color-success, #168557);
  }

  &--warning {
    --fn-feedback-color: var(--fn-color-warning, #a96206);
  }

  &--error {
    --fn-feedback-color: var(--fn-color-error);
  }

  &--loading {
    --fn-feedback-color: var(--fn-color-primary);
    fill: none;
    color: var(--fn-feedback-color);
    animation: fn-feedback-spin 750ms linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }
}

@keyframes fn-feedback-spin {
  to { transform: rotate(1turn); }
}
</style>
