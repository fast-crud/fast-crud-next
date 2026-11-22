<template>
  <span
    ref="anchor"
    class="fn-floating-anchor"
    @pointerenter="showTooltip"
    @pointerleave="hideTooltip"
    @focusin="showTooltip"
    @focusout="hideTooltip"
    @click="togglePopover"
  >
    <slot :attrs="triggerAttrs" />
  </span>
  <Teleport to="body">
    <Transition name="fn-floating-panel">
      <div
        v-if="open"
        :id="id"
        ref="panel"
        class="fn-floating-panel"
        :class="`fn-floating-panel--${kind}`"
        :data-placement="actualPlacement"
        :role="kind === 'tooltip' ? 'tooltip' : 'dialog'"
        :aria-label="kind === 'popover' ? label : undefined"
        :tabindex="kind === 'popover' ? -1 : undefined"
        :style="style"
        @pointerenter="showTooltip"
        @pointerleave="hideTooltip"
      >
        <slot name="content" :close="closeAndRestoreFocus" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="tsx">
import { computed, nextTick, onBeforeUnmount, ref, useId, useTemplateRef, watch, type CSSProperties } from "vue";
import { getFloatingPosition, type FnFloatingPlacement } from "./floating-position";

const props = defineProps<{
  kind: "tooltip" | "popover";
  placement: FnFloatingPlacement;
  label?: string;
  disabled?: boolean;
}>();
const open = defineModel<boolean>("open", { default: false });
const anchor = useTemplateRef<HTMLElement>("anchor");
const panel = useTemplateRef<HTMLElement>("panel");
const id = useId();
const style = ref<CSSProperties>({ visibility: "hidden" });
const actualPlacement = ref(props.placement);
let trigger: HTMLElement | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;
const triggerAttrs = computed(() => props.kind === "tooltip"
  ? { "aria-describedby": open.value ? id : undefined }
  : { "aria-haspopup": "dialog" as const, "aria-expanded": open.value, "aria-controls": open.value ? id : undefined });

function showTooltip(event: PointerEvent | FocusEvent): void {
  if (props.kind !== "tooltip" || props.disabled || ("pointerType" in event && event.pointerType === "touch")) return;
  clearTimeout(hideTimer);
  open.value = true;
}

function hideTooltip(): void {
  if (props.kind !== "tooltip") return;
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (!anchor.value?.matches(":hover, :focus-within") && !panel.value?.matches(":hover")) open.value = false;
  }, 100);
}

function togglePopover(event: MouseEvent): void {
  if (props.kind !== "popover" || props.disabled || event.defaultPrevented) return;
  trigger = document.activeElement instanceof HTMLElement && anchor.value?.contains(document.activeElement)
    ? document.activeElement
    : undefined;
  open.value = !open.value;
}

function closeAndRestoreFocus(): void {
  open.value = false;
  if (props.kind === "popover") trigger?.focus();
}

function updatePosition(): void {
  if (!anchor.value || !panel.value) return;
  const position = getFloatingPosition(
    anchor.value.getBoundingClientRect(),
    panel.value.getBoundingClientRect(),
    { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight },
    props.placement,
    props.kind === "tooltip" ? 12 : 6,
  );
  actualPlacement.value = position.side;
  style.value = {
    left: `${position.left}px`,
    top: `${position.top}px`,
    "--fn-tooltip-arrow-offset": `${position.arrowOffset}px`,
  };
}

function dismissOutside(event: Event): void {
  if (event.target instanceof Node && !anchor.value?.contains(event.target) && !panel.value?.contains(event.target)) {
    open.value = false;
  }
}

function dismissOnEscape(event: KeyboardEvent): void {
  if (!open.value || event.key !== "Escape" || event.defaultPrevented) return;
  event.preventDefault();
  clearTimeout(hideTimer);
  closeAndRestoreFocus();
}

watch(() => props.disabled, (disabled) => {
  if (disabled) open.value = false;
});
watch(() => props.placement, updatePosition, { flush: "post" });
onBeforeUnmount(() => clearTimeout(hideTimer));
watch(panel, (element, _, onCleanup) => {
  if (!element || !anchor.value) return;
  updatePosition();
  if (props.kind === "popover") {
    trigger ??= document.activeElement instanceof HTMLElement && anchor.value.contains(document.activeElement)
      ? document.activeElement
      : undefined;
    void nextTick(() => {
      if (open.value && panel.value === element) element.focus({ preventScroll: true });
    });
    document.addEventListener("pointerdown", dismissOutside, true);
    document.addEventListener("focusin", dismissOutside);
  }
  document.addEventListener("keydown", dismissOnEscape);
  window.addEventListener("resize", updatePosition);
  window.addEventListener("scroll", updatePosition, true);
  const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(updatePosition);
  observer?.observe(anchor.value);
  observer?.observe(element);
  onCleanup(() => {
    trigger = undefined;
    observer?.disconnect();
    document.removeEventListener("pointerdown", dismissOutside, true);
    document.removeEventListener("focusin", dismissOutside);
    document.removeEventListener("keydown", dismissOnEscape);
    window.removeEventListener("resize", updatePosition);
    window.removeEventListener("scroll", updatePosition, true);
  });
}, { flush: "post" });
</script>

<style lang="less">
.fn-floating-anchor {
  display: inline-flex;
  max-width: 100%;
  vertical-align: middle;
}

.fn-floating-panel {
  position: fixed;
  z-index: 2200;
  box-sizing: border-box;
  max-width: min(320px, calc(100vw - 16px));
  max-height: calc(100vh - 16px);
  overflow: auto;
  overflow-wrap: anywhere;
  border: 1px solid var(--fn-color-border-secondary);
  border-radius: var(--fn-border-radius, 6px);
  background: var(--fn-color-bg-elevated);
  box-shadow: 0 4px 16px rgb(0 0 0 / 14%);
  color: var(--fn-color-text);
  font-size: 13px;
  line-height: 1.5;
  white-space: normal;

  &--tooltip {
    max-width: min(280px, calc(100vw - 16px));
    overflow: visible;
    max-height: none;
    padding: 8px 12px;
    border: 0;
    background: var(--fn-tooltip-bg);
    color: var(--fn-tooltip-text);
    font-size: 14px;
    line-height: 22px;

    &::after {
      position: absolute;
      border: 5px solid transparent;
      content: "";
    }

    &[data-placement="top"]::after,
    &[data-placement="bottom"]::after {
      left: var(--fn-tooltip-arrow-offset, 50%);
      transform: translateX(-50%);
    }

    &[data-placement="left"]::after,
    &[data-placement="right"]::after {
      top: var(--fn-tooltip-arrow-offset, 50%);
      transform: translateY(-50%);
    }

    &[data-placement="top"]::after {
      top: 100%;
      border-top-color: var(--fn-tooltip-bg);
    }

    &[data-placement="bottom"]::after {
      bottom: 100%;
      border-bottom-color: var(--fn-tooltip-bg);
    }

    &[data-placement="left"]::after {
      left: 100%;
      border-left-color: var(--fn-tooltip-bg);
    }

    &[data-placement="right"]::after {
      right: 100%;
      border-right-color: var(--fn-tooltip-bg);
    }
  }

  &--popover {
    padding: 12px;
    outline: none;
  }

  &-leave-active {
    pointer-events: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    &-enter-active {
      transition: opacity 160ms ease-out, translate 160ms ease-out;
    }

    &-leave-active {
      transition: opacity 120ms ease-in, translate 120ms ease-in;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;

      &[data-placement="top"] { translate: 0 4px; }
      &[data-placement="bottom"] { translate: 0 -4px; }
      &[data-placement="left"] { translate: 4px 0; }
      &[data-placement="right"] { translate: -4px 0; }
    }
  }
}
</style>
