<template>
  <div v-if="show !== false" class="fn-actionbar">
    <FnButton
      v-for="(button, key) in buttons"
      :key="key"
      v-bind="button"
      :disabled="String(key) === 'batch' ? button.disabled || !canBatchDelete : button.disabled"
      @select="emit('select', String(key), $event)"
    />
  </div>
</template>

<script setup lang="ts">
import FnButton from "../../components/button/fn-button.vue";
import type { FnActionbarProps } from "../../types/index.ts";

withDefaults(defineProps<FnActionbarProps & { canBatchDelete?: boolean }>(), { canBatchDelete: false });
const emit = defineEmits<{ select: [buttonKey: string, itemKey: string] }>();
</script>

<style lang="less">
.fn-actionbar {
  display: flex;
  gap: 8px;
}
</style>
