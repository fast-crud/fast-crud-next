<template>
  <FnFloatingPanel v-model:open="open" kind="popover" :placement="placement" :disabled="disabled" :label="label">
    <template #default="{ attrs }"><slot :attrs="attrs" /></template>
    <template #content="{ close }"><slot name="content" :close="close">{{ content }}</slot></template>
  </FnFloatingPanel>
</template>

<script setup lang="tsx">
import FnFloatingPanel from "./fn-floating-panel.vue";
import type { FnFloatingPlacement } from "./floating-position";

withDefaults(defineProps<{
  label: string;
  content?: string;
  placement?: FnFloatingPlacement;
  disabled?: boolean;
}>(), { placement: "bottom" });

const open = defineModel<boolean>("open", { default: false });
</script>
