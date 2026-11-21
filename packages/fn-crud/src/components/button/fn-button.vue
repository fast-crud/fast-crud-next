<template>
  <FnDropdownButton v-if="props.show !== false && buttonType === 'dropdown'" v-bind="dropdownProps" @select="emit('select', $event)" />
  <FnButtonBase v-else-if="props.show !== false" v-bind="buttonProps" @click="handleClick" />
</template>

<script setup lang="ts">
import { computed, toValue } from "vue";
import FnButtonBase from "./fn-button-base.vue";
import FnDropdownButton from "./fn-dropdown-button.vue";
import type { FnButtonProps } from "../../types/index.ts";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FnButtonProps<void>>(), { show: true, type: "primary", shape: "default", buttonType: "button", loading: false, disabled: false, danger: false, items: () => [] });
const emit = defineEmits<{ select: [key: string] }>();
const buttonType = computed(() => props.buttonType);
const buttonProps = computed(() => ({
  type: props.type,
  text: toValue(props.text),
  icon: props.icon,
  shape: props.shape,
  tooltip: props.tooltip,
  primaryColor: props.primaryColor,
  loading: props.loading,
  disabled: props.disabled,
  danger: props.danger,
}));
const dropdownProps = computed(() => ({ ...buttonProps.value, items: props.items || [] }));

function handleClick(): void {
  props.click?.();
}
</script>
