<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string;
  options: Array<{ label: string; value: string }>;
}>(), { modelValue: "" });
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <select class="demo-select" :value="modelValue" @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
    <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
  </select>
</template>

<style scoped>
.demo-select { width: 100%; min-height: 34px; padding: 0 9px; border: 1px solid var(--fn-color-border, #d0d5dd); border-radius: 5px; color: var(--fn-color-text, #344054); background: var(--fn-color-bg-container, #fff); font: inherit; }
.demo-select:focus-visible { outline: 2px solid color-mix(in srgb, var(--fn-color-primary, #315efb) 35%, transparent); outline-offset: 1px; }
</style>
