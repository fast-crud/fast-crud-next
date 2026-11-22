<template>
  <TransitionGroup name="fn-feedback" tag="div" class="fn-notification fn-feedback-stack" aria-live="polite">
    <div v-for="item in items" :key="item.id" class="fn-feedback-entry">
      <div class="fn-notification-item">
        <FnFeedbackIcon :type="item.type" :size="24" />
        <div class="fn-notification-item__content">
          <div class="fn-notification-item__message">{{ item.message }}</div>
          <div v-if="item.description" class="fn-notification-item__description">{{ item.description }}</div>
        </div>
        <button
          type="button"
          class="fn-notification-item__close"
          :aria-label="fnCrudContext.t('fnCrud.components.closeNotification')"
          @click="emit('dismiss', item.id)"
        >
          <X :size="16" aria-hidden="true" />
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="tsx">
import { X } from "@lucide/vue";
import { fnCrudContext } from "../provider/context.ts";
import FnFeedbackIcon from "./fn-feedback-icon.vue";
import type { FnFeedbackItem } from "./fn-feedback.ts";

defineProps<{ items: FnFeedbackItem[] }>();
const emit = defineEmits<{ dismiss: [id: number] }>();
</script>

<style lang="less">
.fn-notification {
  --fn-feedback-slide-x: 16px;
  --fn-feedback-gap: 12px;
  right: 16px;
  width: min(368px, calc(100% - 32px));

  .fn-notification-item {
    position: relative;
    align-self: start;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 17px 48px 18px 18px;
    border: 1px solid var(--fn-color-border-secondary);
    border-radius: var(--fn-notification-border-radius, var(--fn-feedback-border-radius, var(--fn-border-radius)));
    background: var(--fn-feedback-bg, var(--fn-color-bg-elevated));
    color: var(--fn-color-text);
    box-shadow: 0 4px 10px rgb(16 24 40 / 8%), 0 12px 28px rgb(16 24 40 / 12%);
    pointer-events: auto;

    &__content {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    &__message {
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }

    &__description {
      margin-top: 8px;
      color: var(--fn-color-text-secondary);
      font-size: 14px;
      line-height: 1.55;
      white-space: pre-line;
    }

    &__close {
      position: absolute;
      top: 9px;
      right: 5px;
      display: grid;
      width: 40px;
      height: 40px;
      place-items: center;
      padding: 0;
      border: 0;
      border-radius: var(--fn-feedback-close-border-radius, var(--fn-border-radius));
      background: transparent;
      color: var(--fn-color-text-secondary);
      cursor: pointer;

      &:hover {
        background: var(--fn-color-fill-alter);
        color: var(--fn-color-text);
      }

      &:focus-visible {
        outline: 2px solid var(--fn-color-primary);
        outline-offset: -3px;
      }
    }
  }

  .fn-feedback-leave-active .fn-notification-item {
    pointer-events: none;
  }
}
</style>
