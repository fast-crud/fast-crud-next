<template>
  <FnNotification :items="notificationItems" @dismiss="dismissNotification" />
  <FnMessage :items="messageItems" />
</template>

<script setup lang="tsx">
import FnNotification from "./fn-notification.vue";
import FnMessage from "./fn-message.vue";
import { uiContext } from "../provider/context.ts";

const { notificationItems, messageItems, dismissNotification } = uiContext;
</script>

<style lang="less">
.fn-feedback-stack {
  position: fixed;
  z-index: 3000;
  top: 16px;
  pointer-events: none;

  .fn-feedback-entry {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    margin-block-end: var(--fn-feedback-gap, 10px);
  }

  .fn-feedback-enter-active {
    transition: opacity 240ms ease-out, transform 240ms cubic-bezier(0.2, 0.75, 0.25, 1);
  }

  .fn-feedback-leave-active {
    transition: opacity 160ms ease-in, transform 180ms ease-in, grid-template-rows 200ms ease, margin-block-end 200ms ease;
  }

  .fn-feedback-enter-from,
  .fn-feedback-leave-to {
    opacity: 0;
    transform: translate(var(--fn-feedback-slide-x, 0), var(--fn-feedback-slide-y, 0));
  }

  .fn-feedback-leave-to {
    grid-template-rows: minmax(0, 0fr);
    margin-block-end: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .fn-feedback-enter-active,
    .fn-feedback-leave-active {
      transition: none;
    }
  }
}
</style>
