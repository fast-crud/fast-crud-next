<template>
  <div v-if="show !== false" class="fn-actionbar">
    <FnButton
      v-for="(button, key) in buttons"
      :key="key"
      v-bind="button"
      @select="emit('select', String(key), $event)"
    />
    <slot name="actionRight" />
  </div>
</template>

<script setup lang="ts">
import FnButton from "../../components/button/fn-button.vue";
import type { FnActionbarProps } from "../../types/index.ts";

defineProps<FnActionbarProps>();
const emit = defineEmits<{ select: [buttonKey: string, itemKey: string] }>();
</script>

<style lang="less">
.fn-actionbar {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
