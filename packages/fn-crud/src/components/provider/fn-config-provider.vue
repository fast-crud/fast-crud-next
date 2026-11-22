<template>
    <FnModalProvider class="fn-config-provider">
      <FnNotificationHost />
      <slot />
    </FnModalProvider>
</template>

<script setup lang="ts">
import FnModalProvider from "../overlay/fn-modal-provider.vue";
import FnNotificationHost from "../feedback/fn-notification-host.vue";
import { provideFnUiServices } from "./context.ts";

provideFnUiServices();
</script>
