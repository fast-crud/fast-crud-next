<template>
  <FnDropdownButton v-if="resolvedProps.show !== false && buttonType === 'dropdown'" v-bind="props" @select="emit('select', $event)" />
  <span v-else-if="resolvedProps.show !== false" class="fn-button-wrap" :style="buttonStyle">
    <button
      v-if="buttonType !== 'dropdown'"
      class="fn-button"
      :class="buttonClasses"
      :type="nativeType"
      :disabled="disabled || loading"
      :aria-busy="loading || undefined"
      :aria-label="!text ? tooltipTitle : undefined"
      :title="tooltipTitle"
      @click="handleClick"
    >
      <span v-for="ripple in ripples" :key="ripple.id" class="fn-button-ripple" :class="{ 'fn-button-ripple-active': ripple.active }" :style="ripple.style" aria-hidden="true" @transitionend.self="handleRippleTransitionEnd($event, ripple.id)"></span>
      <span v-if="loading" class="fn-button-spinner" aria-hidden="true"></span>
      <FnIcon v-else-if="iconComponent" :icon="iconComponent" />
      <span v-if="text" class="fn-button-label">{{ text }}</span>
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CSSProperties } from "vue";
import FnIcon from "./fn-icon.vue";
import FnDropdownButton from "./fn-dropdown-button.vue";
import { useFnButtonRipple } from "./use-fn-button-ripple";
import type { FnButtonProps } from "../types/index";

const props = withDefaults(defineProps<FnButtonProps>(), { show: undefined, type: "primary", shape: "default", buttonType: "button", loading: false, disabled: false, danger: false, items: () => [] });
const emit = defineEmits<{ click: []; select: [key: string] }>();
const context = computed(() => props.context || { type: "row" as const });
const resolvedProps = computed(() => ({ show: props.show, text: props.text, disabled: props.disabled, danger: props.danger, items: props.items || [] }));
const tooltipTitle = computed(() => (typeof props.tooltip === "string" ? props.tooltip : props.tooltip?.title));
const iconComponent = computed(() => props.icon);
const text = computed(() => resolvedProps.value.text);
const buttonType = computed(() => props.buttonType);
const nativeType = computed(() => (props.type === "submit" || props.type === "reset" ? props.type : "button"));
const { ripples, createRipple, removeRipple } = useFnButtonRipple();
const buttonClasses = computed(() => ({
  [`fn-button-${props.type}`]: true,
  [`fn-button-shape-${props.shape}`]: true,
  "fn-button-danger": props.danger,
  "fn-button-disabled": props.disabled || props.loading,
  "fn-button-icon-only": !text.value && Boolean(iconComponent.value),
}));
const buttonStyle = computed<CSSProperties>(() => (props.primaryColor ? ({ "--fn-button-primary": props.primaryColor } as CSSProperties) : {}));

function handleClick(event?: MouseEvent): void {
  if (props.disabled || props.loading) {
    return;
  }
  createRipple(event?.currentTarget as HTMLElement);
  const onClick = props.click || props.onClick;
  if (onClick) {
    onClick(context.value);
  } else {
    emit("click");
  }
}

function handleRippleTransitionEnd(event: TransitionEvent, id: number): void {
  if (event.propertyName === "opacity") removeRipple(id);
}
</script>

<style lang="less">
.fn-button-wrap {
  --fn-button-primary: var(--fn-color-primary, #1677ff);
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  .fn-button {
    display: inline-flex;
    min-height: var(--fn-control-height, 32px);
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: var(--fn-border-radius, 6px);
    color: var(--fn-color-text, #344054);
    background: transparent;
    isolation: isolate;
    overflow: visible;
    position: relative;
    cursor: pointer;
    font: inherit;
    line-height: 1.4;
    white-space: nowrap;
    transition:
      color 140ms ease,
      background-color 140ms ease,
      border-color 140ms ease,
      box-shadow 140ms ease;
    &:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--fn-button-primary) 45%, transparent);
      outline-offset: 2px;
    }
    &:disabled {
      opacity: 0.48;
      cursor: not-allowed;
    }
  }
  .fn-button-label {
    display: inline-block;
  }
  .fn-button-ripple {
    position: absolute;
    z-index: 2;
    box-sizing: border-box;
    color: var(--fn-wave-color, var(--fn-button-primary));
    background: transparent;
    box-shadow: 0 0 0 0 currentColor;
    opacity: 0.2;
    pointer-events: none;
    transition: box-shadow 0.4s cubic-bezier(0.08, 0.82, 0.17, 1), opacity 2s cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .fn-button-ripple-active {
    box-shadow: 0 0 0 6px currentColor;
    opacity: 0;
  }
  .fn-button > :not(.fn-button-ripple) {
    position: relative;
    z-index: 1;
  }
  .fn-button-primary {
    border-color: var(--fn-button-primary);
    color: hsl(var(--primary-foreground, 0 0% 98%));
    background: var(--fn-button-primary);
    box-shadow: var(--fn-button-shadow, 0 1px 2px color-mix(in srgb, var(--fn-button-primary) 22%, transparent));
    &:hover:not(:disabled) {
      filter: var(--fn-button-hover-filter, brightness(1.08));
      box-shadow: var(--fn-button-hover-shadow, 0 3px 9px color-mix(in srgb, var(--fn-button-primary) 30%, transparent));
    }
  }
  .fn-button-default {
    border-color: var(--fn-color-border, #d7dee8);
    color: var(--fn-color-text, inherit);
    background: var(--fn-color-bg-container, #fff);
    &:hover:not(:disabled) {
      border-color: var(--fn-button-primary);
      color: var(--fn-button-primary);
      background: color-mix(in srgb, var(--fn-button-primary) 5%, white);
    }
  }
  .fn-button-dashed {
    border: 1px dashed var(--fn-color-border, #c5ceda);
    background: transparent;
    &:hover:not(:disabled) {
      border-color: var(--fn-button-primary);
      color: var(--fn-button-primary);
      background: color-mix(in srgb, var(--fn-button-primary) 5%, transparent);
    }
  }
  .fn-button-text,
  .fn-button-link {
    color: var(--fn-button-primary);
    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--fn-button-primary) 9%, transparent);
    }
  }
  .fn-button-link {
    min-height: auto;
    padding: 0;
    text-decoration: none;
  }
  .fn-button-shape-round {
    border-radius: 999px;
  }
  .fn-button-shape-circle {
    width: 32px;
    padding: 0;
    border-radius: 50%;
  }
  .fn-button-icon-only {
    width: 32px;
    padding: 0;
  }
  .fn-button-danger {
    --fn-ripple-color: var(--fn-color-error, #dc3545);
    border-color: var(--fn-color-error, #dc3545);
    color: #fff;
    background: var(--fn-color-error, #dc3545);
    &:hover:not(:disabled) {
      border-color: color-mix(in srgb, var(--fn-color-error, #dc3545) 84%, black);
      background: color-mix(in srgb, var(--fn-color-error, #dc3545) 84%, black);
    }
  }
  .fn-button-text.fn-button-danger,
  .fn-button-link.fn-button-danger {
    border-color: transparent;
    color: var(--fn-color-error, #dc3545);
    background: transparent;
    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--fn-color-error, #dc3545) 9%, transparent);
    }
  }
  .fn-button-default.fn-button-danger {
    border-color: color-mix(in srgb, var(--fn-color-error, #dc3545) 35%, white);
    color: var(--fn-color-error, #dc3545);
    background: transparent;
  }
  .fn-button-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: fn-button-spin 700ms linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .fn-button {
      transition: none;
    }
    .fn-button-ripple {
      transition: none;
      opacity: 0;
    }
  }
  .dark & {
    .fn-button {
      // color: #d8dee8;
    }
    .fn-button-default {
      border-color: #424b59;
      background: #232a34;
      &:hover:not(:disabled) {
        color: var(--fn-button-primary);
      }
    }
    .fn-button-dashed {
      border-color: #505a68;
    }
    .fn-button-text,
    .fn-button-link {
      color: color-mix(in srgb, var(--fn-button-primary) 76%, white);
    }
    .fn-button-danger {
      border-color: #c83b4a;
      color: #fff;
      background: #c83b4a;
    }
    .fn-button-default.fn-button-danger {
      color: #ff7b87;
      background: transparent;
    }
  }
}
@keyframes fn-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
