<template>
  <div v-if="show !== false" class="fn-toolbar">
    <FnButtonBase
      type="default"
      :icon="density === 'compact' ? Rows3 : Rows2"
      :tooltip="density === 'compact' ? '当前紧凑模式，点击切换宽松' : '当前宽松模式，点击切换紧凑'"
      :disabled="disabled"
      @click="emit('update:density', density === 'compact' ? 'comfort' : 'compact')"
    />
    <FnButtonBase type="default" :icon="Columns3" tooltip="列设置" :disabled="disabled" @click="openColumnSettings" />
    <FnButton v-for="(button, key) in buttons" :key="key" v-bind="button" />
    <FnColumnSettings v-bind="columnSettingsProps" />
  </div>
</template>

<script setup lang="ts">
import { Columns3, Rows2, Rows3 } from "@lucide/vue";
import FnButton from "./fn-button.vue";
import FnButtonBase from "./fn-button-base.vue";
import FnColumnSettings from "./fn-column-settings.vue";
import type { FnButtonProps, FnColumnSettingsColumn, FnSlots } from "../types/index";

const props = defineProps<{
  show?: boolean;
  density: "compact" | "comfort";
  disabled?: boolean;
  buttons?: Record<string, FnButtonProps<void>>;
  columnSettingsProps: {
    modelValue: boolean;
    columns: FnColumnSettingsColumn[];
    "onUpdate:modelValue": (value: boolean) => void;
    "onUpdate:columns": (columns: FnColumnSettingsColumn[]) => void;
    onReset: () => void;
    slots?: FnSlots;
  };
}>();
const emit = defineEmits<{ "update:density": [density: "compact" | "comfort"] }>();

function openColumnSettings(): void {
  props.columnSettingsProps["onUpdate:modelValue"](true);
}
</script>

<style lang="less">
.fn-toolbar {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 8px;
}
</style>
