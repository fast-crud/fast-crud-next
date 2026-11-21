<template>
  <span class="fn-dict-label">{{ label }}</span>
</template>

<script setup lang="tsx">
import { computed } from "vue";
import type { DictOption, DictValue } from "../types";

const props = withDefaults(defineProps<{
  modelValue?: DictValue | DictValue[];
  options?: DictOption[];
}>(), { options: () => [] });

const label = computed(() => {
  const values = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
  return values
    .filter(value => value != null && value !== "")
    .map(value => props.options.find(option => String(option.value) === String(value))?.label ?? String(value))
    .join("、") || "—";
});
</script>
