<template>
    <FnModalProvider>
      <FnNotificationHost />
      <slot />
    </FnModalProvider>
</template>

<script setup lang="ts">
import FnModalProvider from "../modal/fn-modal-provider.vue";
import FnNotificationHost from "../notification/fn-notification-host.vue";
import { provideFnUiServices } from "./context";

provideFnUiServices();
</script>
