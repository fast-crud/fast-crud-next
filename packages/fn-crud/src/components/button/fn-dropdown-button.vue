<template>
  <span class="fn-dropdown-button">
    <FnButtonBase
      ref="buttonComponentRef"
      v-bind="buttonProps"
      :aria-expanded="menuOpen"
      aria-haspopup="menu"
      @click="toggleMenu"
    >
      <ChevronDown :size="14" />
    </FnButtonBase>
    <Teleport to="body">
      <template v-if="menuOpen">
        <div class="fn-button-menu-mask" aria-hidden="true" @click="closeMenu"></div>
        <div ref="menuRef" class="fn-button-menu" :style="menuStyle" role="menu">
          <button v-for="item in visibleItems" :key="item.key" class="fn-button-menu-item" :class="{ danger: item.danger }" type="button" role="menuitem" :disabled="item.disabled" @click="handleMenuClick(item)">
            {{ item.label }}
          </button>
        </div>
      </template>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { ChevronDown } from "@lucide/vue";
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref, toValue, watch, type CSSProperties } from "vue";
import FnButtonBase from "./fn-button-base.vue";
import type { FnButtonItem, FnDropdownButtonProps } from "./types";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<FnDropdownButtonProps<void>>(), { type: "primary", shape: "default", loading: false, disabled: false, danger: false });
const emit = defineEmits<{ select: [key: string] }>();
const buttonComponentRef = ref<{ getElement: () => HTMLElement | undefined }>();
const visibleItems = computed(() => (props.items || []).filter(item => item.show !== false));
const menuOpen = ref(false);
const menuRef = ref<HTMLElement>();
const menuStyle = ref<CSSProperties>({});
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

function toggleMenu(): void {
  if (!props.disabled && !props.loading) {
    menuOpen.value = !menuOpen.value;
  }
}
function closeMenu(): void {
  menuOpen.value = false;
}
function updateMenuPosition(): void {
  const button = buttonComponentRef.value?.getElement();
  if (!button) {
    return;
  }
  const rect = button.getBoundingClientRect();
  const itemHeight = 32;
  const estimatedHeight = Math.max(1, visibleItems.value.length) * itemHeight + 10;
  const opensUpward = rect.bottom + 5 + estimatedHeight > window.innerHeight && rect.top - 5 - estimatedHeight >= 0;
  const top = opensUpward ? rect.top - estimatedHeight - 5 : rect.bottom + 5;
  const width = menuRef.value?.offsetWidth || 144;
  const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8);
  menuStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  } as CSSProperties;
}
function handleViewportChange(): void {
  if (menuOpen.value) {
    updateMenuPosition();
  }
}
watch(menuOpen, async open => {
  if (open) {
    await nextTick();
    updateMenuPosition();
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);
  } else {
    window.removeEventListener("scroll", handleViewportChange, true);
    window.removeEventListener("resize", handleViewportChange);
  }
});
if (getCurrentInstance()) {
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleViewportChange, true);
    window.removeEventListener("resize", handleViewportChange);
  });
}
function handleMenuClick(item: FnButtonItem<void>): void {
  if (item.disabled) {
    return;
  }
  menuOpen.value = false;
  item.click?.();
  emit("select", item.key);
}
</script>

<style lang="less">
.fn-dropdown-button {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}
.fn-button-menu {
  position: fixed;
  z-index: 50;
  min-width: 144px;
  max-height: calc(100vh - 16px);
  overflow-y: auto;
  padding: 4px;
  border: 1px solid #e1e6ed;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.14);
}
.fn-button-menu-mask {
  position: fixed;
  z-index: 49;
  inset: 0;
  background: transparent;
}
.fn-button-menu-item {
  display: flex;
  width: 100%;
  min-height: var(--fn-button-menu-item-height, 32px);
  align-items: center;
  padding: 0 9px;
  border: 0;
  border-radius: 4px;
  color: #344054;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font: inherit;
  &:hover:not(:disabled) {
    background: #f2f4f7;
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  &.danger {
    color: #c82333;
  }
}
body.dark .fn-button-menu {
  border-color: #414a58;
  background: #232a34;
}
body.dark .fn-button-menu-item {
  color: #d8dee8;
  &:hover:not(:disabled) {
    background: #303946;
  }
  &.danger {
    color: #ff7b87;
  }
}
</style>
