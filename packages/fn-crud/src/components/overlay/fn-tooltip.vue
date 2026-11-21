<template>
  <FnFloatingPanel v-model:open="open" kind="tooltip" :placement="placement" :disabled="disabled">
    <template #default="{ attrs }"><slot :attrs="attrs" /></template>
    <template #content><slot name="content">{{ content }}</slot></template>
  </FnFloatingPanel>
</template>

<script setup lang="tsx">
import FnFloatingPanel from "./fn-floating-panel.vue";
import type { FnFloatingPlacement } from "./floating-position";

withDefaults(defineProps<{
  content?: string;
  placement?: FnFloatingPlacement;
  disabled?: boolean;
}>(), { placement: "top" });

const open = defineModel<boolean>("open", { default: false });
</script>
