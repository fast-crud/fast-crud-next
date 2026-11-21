<template>
  <span class="fn-icon">
    <component :is="icon" :size="size" />
  </span>
</template>

<script setup lang="tsx">
import type { PropType } from "vue";
import type { FnIconProps } from "./types";

defineProps({
  icon: { type: [Object, Function] as PropType<FnIconProps["icon"]>, required: true },
  size: { type: [Number, String], default: "1em" },
});
</script>

<style lang="less">
.fn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
