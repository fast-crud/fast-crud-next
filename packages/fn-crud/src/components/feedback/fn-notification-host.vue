<template>
  <FnNotification :items="items" />
</template>

<script setup lang="ts">
import FnNotification from "./fn-notification.vue";
import { uiContext } from "../provider/context.ts";

const items = uiContext.notificationItems;
</script>
