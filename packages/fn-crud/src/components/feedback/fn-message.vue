<template>
  <TransitionGroup name="fn-feedback" tag="div" class="fn-message fn-feedback-stack" aria-live="polite">
    <div v-for="item in items" :key="item.id" class="fn-feedback-entry">
      <div class="fn-message-item" :data-type="item.type">
        <FnFeedbackIcon :type="item.type" :size="18" />
        <span>{{ item.message }}</span>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="tsx">
import FnFeedbackIcon from "./fn-feedback-icon.vue";
import type { FnFeedbackItem } from "./fn-feedback.ts";

defineProps<{ items: FnFeedbackItem[] }>();
</script>

<style lang="less">
.fn-message {
  --fn-feedback-slide-y: -8px;
  inset-inline: 16px;
  width: min(480px, calc(100% - 32px));
  margin-inline: auto;

  .fn-message-item {
    box-sizing: border-box;
    justify-self: center;
    align-self: start;
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 100%;
    padding: 9px 14px;
    border: 1px solid var(--fn-message-border, var(--fn-color-border-secondary));
    border-radius: var(--fn-feedback-border-radius, var(--fn-border-radius));
    background: var(--fn-message-background, var(--fn-feedback-bg, var(--fn-color-bg-elevated)));
    color: var(--fn-message-text, var(--fn-color-text));
    box-shadow: 0 4px 16px rgb(16 24 40 / 14%);
    font-size: 14px;
    line-height: 20px;
    overflow-wrap: anywhere;

    span {
      min-width: 0;
    }
  }
}
</style>
