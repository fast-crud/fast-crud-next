<template>
  <div ref="field" class="fn-select" :class="[$attrs.class, { 'is-open': open, 'is-disabled': disabled, 'fn-select--single-line': singleLine }]" :style="[$attrs.style as StyleValue, minWidthStyle]" @click="openFromField" @focusout="handleFocusOut">
    <div ref="content" class="fn-select-content" :class="{ 'fn-select-content--single-line': singleLine }">
      <template v-if="multiple">
        <FnTag
          v-for="(item, index) in selected"
          :key="valueKey(item.value)"
          class="fn-select-tag"
          :class="{ 'fn-select-measure': singleLine && index >= visibleTagCount }"
          :aria-hidden="singleLine && index >= visibleTagCount || undefined"
        >
          <span class="fn-select-tag-label" :title="item.label">{{ item.label }}</span>
          <button v-if="!disabled && !item.disabled" type="button" class="fn-select-remove" tabindex="-1" :aria-label="'移除 ' + item.label" :title="'移除 ' + item.label" @mousedown.prevent @click.stop="remove(item.value)">
            <X :size="12" aria-hidden="true" />
          </button>
        </FnTag>
        <template v-if="singleLine">
          <span v-if="hiddenTags.length" class="fn-select-overflow" :title="hiddenTags.map(item => item.label).join('、')" :aria-label="'另有 ' + hiddenTags.length + ' 个已选项'">+{{ hiddenTags.length }}</span>
          <span v-for="digits in overflowDigits" :key="digits" class="fn-select-overflow fn-select-measure fn-select-overflow-probe" aria-hidden="true">+{{ '0'.repeat(digits) }}</span>
          <span ref="inputProbe" class="fn-select-input-probe fn-select-measure" aria-hidden="true" />
        </template>
      </template>
      <input
        ref="input"
        v-bind="inputAttrs()"
        class="fn-select-input"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        :aria-label="String($attrs['aria-label'] || placeholder)"
        :aria-expanded="open"
        :aria-controls="open ? listId : undefined"
        :aria-activedescendant="open && activeIndex >= 0 ? optionId(activeIndex) : undefined"
        :disabled="disabled"
        :value="inputValue"
        :placeholder="inputPlaceholder"
        @input="handleInput"
        @keydown="handleKeydown"
      />
    </div>
    <div class="fn-select-actions">
      <button v-if="clearable && canClear && !disabled" type="button" class="fn-select-action fn-select-clear" tabindex="-1" aria-label="清空选择" title="清空选择" @mousedown.prevent @click.stop="clear">
        <X :size="14" aria-hidden="true" />
      </button>
      <button type="button" class="fn-select-action fn-select-toggle" tabindex="-1" :disabled="disabled" :aria-label="open ? '收起选项' : '展开选项'" @mousedown.prevent @click.stop="toggle">
        <ChevronDown :size="14" aria-hidden="true" />
      </button>
    </div>
  </div>
  <Teleport to="body">
    <div v-if="open" ref="panel" class="fn-select-panel" :style="panelStyle">
      <div :id="listId" role="listbox" :aria-label="String($attrs['aria-label'] || placeholder)" :aria-multiselectable="multiple || undefined">
        <div
          v-for="(option, index) in filteredOptions"
          :id="optionId(index)"
          :key="valueKey(option.value)"
          class="fn-select-option"
          :class="{ 'is-active': index === activeIndex, 'is-selected': selectedValues.includes(option.value) }"
          role="option"
          :aria-selected="selectedValues.includes(option.value)"
          :aria-disabled="option.disabled || undefined"
          @mousemove="!option.disabled && (activeIndex = index)"
          @mousedown.prevent
          @click="choose(option)"
        >
          <span :title="option.label">{{ option.label }}</span>
          <Check v-if="selectedValues.includes(option.value)" :size="15" aria-hidden="true" />
        </div>
      </div>
      <div v-if="filteredOptions.length === 0" class="fn-select-empty" role="status">无匹配选项</div>
    </div>
  </Teleport>
</template>

<script setup lang="tsx">
import { Check, ChevronDown, X } from "@lucide/vue";
import { computed, nextTick, ref, useAttrs, useId, watch, type CSSProperties, type StyleValue } from "vue";
import FnTag from "../tag/fn-tag.vue";
import { countVisibleTags } from "./select-tag-layout";
import type { FnOptionValue, FnSelectOption } from "./types";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{
  modelValue?: FnOptionValue | FnOptionValue[];
  options?: FnSelectOption[];
  multiple?: boolean;
  wrap?: boolean;
  minWidth?: number | string;
  clearable?: boolean;
  disabled?: boolean;
  placeholder?: string;
}>(), { modelValue: undefined, options: () => [], placeholder: "请选择", wrap: true });
const emit = defineEmits<{ "update:modelValue": [value: FnOptionValue | FnOptionValue[]] }>();

const attrs = useAttrs();
const field = ref<HTMLElement>();
const content = ref<HTMLElement>();
const inputProbe = ref<HTMLElement>();
const input = ref<HTMLInputElement>();
const panel = ref<HTMLElement>();
const open = ref(false);
const query = ref("");
const activeIndex = ref(-1);
const panelStyle = ref<CSSProperties>();
const listId = useId();
const filteredOptions = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase();
  return props.options.filter(option => option.show !== false && option.label.toLocaleLowerCase().includes(keyword));
});
const enabledIndices = computed(() => filteredOptions.value.flatMap((option, index) => option.disabled ? [] : [index]));
const optionsByValue = computed(() => new Map(props.options.map(option => [option.value, option])));
const selectedValues = computed(() => {
  const value = props.modelValue;
  if (Array.isArray(value)) return props.multiple ? value : [];
  return value == null || value === "" ? [] : [value];
});
const selected = computed(() => selectedValues.value.map(value => {
  const option = optionsByValue.value.get(value);
  return { value, label: option?.label ?? String(value), disabled: option?.disabled };
}));
const singleLine = computed(() => props.multiple && !props.wrap);
const minWidthStyle = computed(() => {
  const width = props.minWidth;
  if (width === undefined) return undefined;
  return { minWidth: typeof width === "number" ? width + "px" : width };
});
const visibleTagCount = ref(Infinity);
const hiddenTags = computed(() => singleLine.value ? selected.value.slice(visibleTagCount.value) : []);
const overflowDigits = computed(() => String(selected.value.length).length);
const removable = computed(() => selected.value.filter(item => !item.disabled));
const canClear = computed(() => props.multiple ? removable.value.length > 0 : selected.value.length > 0);
const inputValue = computed(() => open.value ? query.value : props.multiple ? "" : selected.value[0]?.label ?? "");
const inputPlaceholder = computed(() => selected.value.length && props.multiple ? undefined : selected.value[0]?.label ?? props.placeholder);

function inputAttrs() {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
}

function valueKey(value: FnOptionValue): string {
  return typeof value + ":" + value;
}

function optionId(index: number): string {
  return listId + "-" + index;
}

function show(direction: 1 | -1 = 1): void {
  if (props.disabled || open.value) return;
  open.value = true;
  const indices = enabledIndices.value;
  const selectedIndex = props.multiple ? undefined : indices.find(index => filteredOptions.value[index].value === selectedValues.value[0]);
  activeIndex.value = selectedIndex ?? (direction === 1 ? indices[0] : indices.at(-1)) ?? -1;
  scrollToActive();
}

function close(): void {
  open.value = false;
  query.value = "";
  activeIndex.value = -1;
}

function openFromField(): void {
  if (props.disabled) return;
  input.value?.focus();
  show();
}

function toggle(): void {
  if (open.value) close();
  else show();
  input.value?.focus();
}

function handleFocusOut(event: FocusEvent): void {
  if (!field.value?.contains(event.relatedTarget as Node | null)) close();
}

function handleInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  show();
  query.value = value;
  activeIndex.value = enabledIndices.value[0] ?? -1;
  if (panel.value) panel.value.scrollTop = 0;
}

function choose(option: FnSelectOption): void {
  if (props.disabled || option.disabled) return;
  if (!props.multiple) {
    emit("update:modelValue", option.value);
    close();
    return;
  }
  if (selectedValues.value.includes(option.value)) remove(option.value);
  else emit("update:modelValue", [...selectedValues.value, option.value]);
  if (query.value) {
    query.value = "";
    activeIndex.value = filteredOptions.value.findIndex(item => item.value === option.value);
    scrollToActive();
  }
}

function remove(value: FnOptionValue): void {
  if (props.disabled || optionsByValue.value.get(value)?.disabled) return;
  emit("update:modelValue", selectedValues.value.filter(item => item !== value));
  input.value?.focus();
}

function clear(): void {
  if (props.disabled) return;
  emit("update:modelValue", props.multiple ? selected.value.filter(item => item.disabled).map(item => item.value) : "");
  input.value?.focus();
}

function scrollToActive(): void {
  void nextTick(() => {
    const menu = panel.value;
    const item = menu?.ownerDocument.getElementById(optionId(activeIndex.value));
    if (!menu || !item) return;
    const menuRect = menu.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (itemRect.top < menuRect.top) menu.scrollTop += itemRect.top - menuRect.top;
    if (itemRect.bottom > menuRect.bottom) menu.scrollTop += itemRect.bottom - menuRect.bottom;
  });
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.isComposing || props.disabled) return;
  switch (event.key) {
    case "ArrowDown":
    case "ArrowUp": {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      if (!open.value) {
        show(direction);
        break;
      }
      const indices = enabledIndices.value;
      if (indices.length === 0) break;
      const current = indices.indexOf(activeIndex.value);
      const next = current < 0 ? (direction === 1 ? 0 : indices.length - 1) : (current + direction + indices.length) % indices.length;
      activeIndex.value = indices[next];
      scrollToActive();
      break;
    }
    case "Enter": {
      event.preventDefault();
      if (!open.value) show();
      else {
        const option = filteredOptions.value[activeIndex.value];
        if (option) choose(option);
      }
      break;
    }
    case "Escape":
      if (!open.value) break;
      event.preventDefault();
      event.stopPropagation();
      close();
      break;
    case "Backspace": {
      if (!props.multiple || query.value) break;
      const last = removable.value.at(-1);
      if (last) {
        event.preventDefault();
        remove(last.value);
      }
      break;
    }
  }
}

function updatePanelPosition(): void {
  if (!field.value || !panel.value) return;
  const rect = field.value.getBoundingClientRect();
  const gap = 4;
  const margin = 8;
  const below = window.innerHeight - rect.bottom - gap - margin;
  const above = rect.top - gap - margin;
  const upward = below < Math.min(panel.value.scrollHeight, 240) && above > below;
  const width = Math.min(Math.max(rect.width, 160), window.innerWidth - margin * 2);
  panelStyle.value = {
    left: Math.min(Math.max(rect.left, margin), window.innerWidth - width - margin) + "px",
    width: width + "px",
    top: upward ? undefined : rect.bottom + gap + "px",
    bottom: upward ? window.innerHeight - rect.top + gap + "px" : undefined,
    maxHeight: Math.max(0, Math.min(240, upward ? above : below)) + "px",
  };
}

watch([content, selected, singleLine, () => props.disabled], ([element, tags, compact], _previous, onCleanup) => {
  if (!element || !compact || tags.length === 0) {
    visibleTagCount.value = Infinity;
    return;
  }
  const tagElements = Array.from(element.querySelectorAll<HTMLElement>(".fn-select-tag"));
  const probes = Array.from(element.querySelectorAll<HTMLElement>(".fn-select-overflow-probe"));
  const inputSizer = inputProbe.value;
  const update = () => {
    const width = element.getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
    visibleTagCount.value = countVisibleTags(
      tagElements.map(tag => {
        const label = tag.querySelector<HTMLElement>(".fn-select-tag-label");
        const clipped = label ? Math.max(0, label.scrollWidth - label.clientWidth) : 0;
        return tag.getBoundingClientRect().width + clipped;
      }),
      width,
      inputSizer?.getBoundingClientRect().width ?? 0,
      gap,
      probes.map(probe => probe.getBoundingClientRect().width),
    );
  };
  update();
  if (typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", update);
    onCleanup(() => window.removeEventListener("resize", update));
    return;
  }
  const observer = new ResizeObserver(update);
  [element, ...tagElements, ...probes].forEach(item => observer.observe(item));
  if (inputSizer) observer.observe(inputSizer);
  onCleanup(() => observer.disconnect());
}, { flush: "post" });

watch(open, (value, _previous, onCleanup) => {
  if (!value || !field.value) return;
  const element = field.value;
  const document = element.ownerDocument;
  const outside = (event: PointerEvent) => {
    const target = event.target as Node | null;
    if (!element.contains(target) && !panel.value?.contains(target)) close();
  };
  document.addEventListener("pointerdown", outside, true);
  window.addEventListener("scroll", updatePanelPosition, true);
  window.addEventListener("resize", updatePanelPosition);
  const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(updatePanelPosition);
  observer?.observe(element);
  updatePanelPosition();
  onCleanup(() => {
    document.removeEventListener("pointerdown", outside, true);
    window.removeEventListener("scroll", updatePanelPosition, true);
    window.removeEventListener("resize", updatePanelPosition);
    observer?.disconnect();
  });
}, { flush: "post" });

watch(filteredOptions, options => {
  if (!open.value) return;
  if (!options[activeIndex.value] || options[activeIndex.value].disabled) activeIndex.value = enabledIndices.value[0] ?? -1;
  updatePanelPosition();
}, { flush: "post" });
watch(() => props.disabled, disabled => { if (disabled) close(); });
</script>

<style lang="less">
.fn-select {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  min-height: var(--fn-control-height, 32px);
  padding: 2px 4px 2px 8px;
  gap: 2px;
  border: 1px solid var(--fn-color-border, #d0d5dd);
  border-radius: var(--fn-border-radius, 5px);
  background: var(--fn-color-bg-container, #fff);
  color: var(--fn-color-text, #344054);
  font: inherit;
  cursor: text;
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus-within {
    border-color: var(--fn-color-primary, #1677ff);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--fn-color-primary, #1677ff) 20%, transparent);
  }

  &.is-disabled {
    background: var(--fn-color-fill-secondary, #f2f4f7);
    color: var(--fn-color-text-tertiary, #98a2b3);
    cursor: not-allowed;
  }

  &.fn-select--single-line {
    min-width: min(100%, 144px);
  }

  .fn-select-content {
    display: flex;
    flex: 1 1 0;
    flex-wrap: wrap;
    align-items: center;
    min-width: 0;
    gap: 3px;
  }

  .fn-select-input {
    box-sizing: border-box;
    flex: 1 1 2ch;
    min-width: min(2ch, 100%);
    width: 0;
    height: 24px;
    padding: 0 2px;
    border: 0;
    outline: 0;
    color: inherit;
    background: transparent;
    font: inherit;
    text-overflow: ellipsis;
    &::placeholder { color: var(--fn-color-text-tertiary, #8a95a6); }
    &:disabled { cursor: not-allowed; }
  }

  .fn-select-tag {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    padding: 0 3px 0 6px;
    gap: 2px;
    line-height: 20px;
  }

  .fn-select-tag-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .fn-select-content--single-line {
    position: relative;
    flex-wrap: nowrap;
    overflow: hidden;

    .fn-select-tag { flex: none; width: max-content; }
    .fn-select-tag:first-child { flex-shrink: 1; min-width: 40px; }
  }

  .fn-select-measure {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
  }

  .fn-select-input-probe { width: min(2ch, 100%); }

  .fn-select-overflow {
    flex: none;
    width: max-content;
    padding: 0 5px;
    border: 1px solid var(--fn-color-border-secondary, #edf0f4);
    border-radius: 4px;
    background: var(--fn-color-fill-alter, #f5f7fa);
    color: var(--fn-color-text-secondary, #536176);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    line-height: 20px;
    white-space: nowrap;
  }

  .fn-select-actions {
    display: grid;
    flex: none;
    align-items: center;

    .fn-select-action { grid-area: 1 / 1; }
    .fn-select-clear { visibility: hidden; }
  }

  @media (any-hover: hover) {
    &:hover .fn-select-actions {
      .fn-select-clear { visibility: visible; }
      .fn-select-clear + .fn-select-toggle { visibility: hidden; }
    }
  }

  .fn-select-remove,
  .fn-select-action {
    display: inline-grid;
    flex: none;
    place-items: center;
    width: 22px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 4px;
    color: var(--fn-color-text-secondary, #536176);
    background: transparent;
    cursor: pointer;
    &:hover { color: var(--fn-color-text, #172033); background: var(--fn-color-fill-secondary, #edf0f4); }
    &:disabled { opacity: 0.55; cursor: not-allowed; }
  }

  .fn-select-remove { width: 18px; height: 20px; }
  .fn-select-toggle svg { transition: transform 120ms ease; }
  &.is-open .fn-select-toggle svg { transform: rotate(180deg); }
}

.fn-select-panel {
  position: fixed;
  z-index: var(--fn-select-z-index, 1100);
  box-sizing: border-box;
  max-height: 240px;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 4px;
  border: 1px solid var(--fn-color-border-secondary, #e1e6ed);
  border-radius: 7px;
  color: var(--fn-color-text, #344054);
  background: var(--fn-color-bg-elevated, #fff);
  box-shadow: 0 4px 8px rgba(16, 24, 40, 0.08), 0 12px 28px rgba(16, 24, 40, 0.12);
  font-size: 14px;

  .fn-select-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 32px;
    padding: 4px 8px;
    gap: 10px;
    border-radius: 4px;
    cursor: pointer;

    > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    &.is-selected {
      background: color-mix(in srgb, var(--fn-color-primary, #1677ff) 12%, transparent);
      svg { flex: none; color: var(--fn-color-primary, #1677ff); }
    }
    &.is-active { background: var(--fn-color-fill-secondary, #f5f7fa); }
    &[aria-disabled="true"] { color: var(--fn-color-text-tertiary, #8a95a6); cursor: not-allowed; }
  }

  .fn-select-empty {
    padding: 12px 8px;
    text-align: center;
    color: var(--fn-color-text-tertiary, #8a95a6);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fn-select,
  .fn-select .fn-select-toggle svg { transition: none; }
}
</style>
