<template>
  <FnDrawer v-model:open="open" title="列设置" :width="460">
    <div class="fn-column-settings-content">
      <div class="fn-column-settings-list">
        <div class="fn-column-settings-list-header">
          <label class="fn-column-settings-select-all">
            <FnCheckbox :model-value="allVisible" :indeterminate="someVisible && !allVisible" :disabled="editableRows.length === 0" aria-label="全选可设置列" @change="toggleAll" />
            <span>{{ visibleCount }} / {{ visibleRows.length }}</span>
          </label>
          <span class="fn-column-settings-label">固定 / 排序</span>
        </div>
        <div
          v-for="column in visibleRows"
          :key="column.key"
          class="fn-column-settings-row"
          :class="{ 'is-dragging': draggingKey === column.key, 'is-over': overKey === column.key, 'is-disabled': isDisabled(column) }"
          @dragover.prevent="overKey = column.key"
          @drop.prevent="dropColumn(column.key)"
        >
          <label class="fn-column-settings-name">
            <FnCheckbox v-model="column.show" :disabled="isDisabled(column)" :aria-label="`显示${column.title}`" />
            <span :title="column.title">{{ column.title }}</span>
          </label>
          <div class="fn-column-settings-actions">
            <FnButtonGroup
              :model-value="column.fixed || ''"
              class="fn-column-settings-fixed"
              :label="`${column.title}固定位置`"
              :disabled="isDisabled(column)"
              :options="fixedPositionOptions(column.title)"
              @update:model-value="value => setFixed(column, value === 'left' || value === 'right' ? value : undefined)"
            />
            <button
              class="fn-column-settings-grip"
              type="button"
              :disabled="isDisabled(column)"
              :draggable="!isDisabled(column)"
              :aria-label="`拖动排序：${column.title}`"
              title="拖动排序"
              @dragstart="startDrag($event, column.key)"
              @dragend="clearDrag"
              @keydown="moveWithKeyboard($event, column.key)"
            >
              <GripVertical :size="16" />
            </button>
          </div>
        </div>
      </div>
      <div v-if="props.slots?.bodyBottom" class="fn-column-settings-body-bottom"><FnRender :render="props.slots.bodyBottom" /></div>
    </div>
    <template #footer>
      <div class="fn-column-settings-footer">
        <button class="fn-column-settings-reset" type="button" @click="reset"><RotateCcw :size="16" />还原</button>
        <div class="fn-column-settings-confirm"><FnButtonBase type="primary" text="确定" :icon="Check" @click="confirm" /></div>
      </div>
    </template>
  </FnDrawer>
</template>

<script setup lang="ts">
import { Check, ChevronLeft, ChevronRight, GripVertical, RotateCcw, X } from "@lucide/vue";
import { computed, ref, watch } from "vue";
import FnButtonBase from "./fn-button-base.vue";
import FnButtonGroup, { type FnButtonGroupOption } from "./fn-button-group.vue";
import FnCheckbox from "./fn-checkbox.vue";
import FnDrawer from "./fn-drawer.vue";
import FnRender from "./fn-render";
import type { FnColumnSettingsColumn, FnSlots } from "../types/index";

const props = defineProps<{ modelValue: boolean; columns: FnColumnSettingsColumn[]; slots?: FnSlots }>();
const emit = defineEmits<{ "update:modelValue": [value: boolean]; "update:columns": [columns: FnColumnSettingsColumn[]]; reset: [] }>();
const open = computed({ get: () => props.modelValue, set: value => emit("update:modelValue", value) });
const rows = ref<FnColumnSettingsColumn[]>([]);
const visibleRows = computed(() => rows.value.filter(column => column.setting?.show !== false));
const editableRows = computed(() => visibleRows.value.filter(column => !isDisabled(column)));
const draggingKey = ref<string>();
const overKey = ref<string>();
const visibleCount = computed(() => visibleRows.value.filter(column => column.show).length);
const allVisible = computed(() => editableRows.value.length > 0 && editableRows.value.every(column => column.show));
const someVisible = computed(() => editableRows.value.some(column => column.show));
const committedRows = computed(() => props.columns.map(column => (column.setting ? { ...column, setting: { ...column.setting } } : { ...column })));
function fixedPositionOptions(title: string): FnButtonGroupOption[] {
  return [
    { value: "left", icon: ChevronLeft, title: "固定到左侧", ariaLabel: `${title}固定到左侧` },
    { value: "", icon: X, title: "取消固定", ariaLabel: `${title}取消固定` },
    { value: "right", icon: ChevronRight, title: "固定到右侧", ariaLabel: `${title}固定到右侧` },
  ];
}

watch(
  [() => props.modelValue, committedRows],
  ([isOpen, columns], [wasOpen, previous]) => {
    if (!isOpen || !wasOpen || !previous || columns.length !== previous.length || columns.some((column, index) => {
      const old = previous[index];
      return column.key !== old.key || column.show !== old.show || column.fixed !== old.fixed;
    })) {
      copyCommittedRows();
      clearDrag();
      return;
    }

    // 抽屉打开时更新列配置，保留仍可编辑的草稿。
    const byKey = new Map(columns.map(column => [column.key, column]));
    rows.value = rows.value.map(draft => {
      const column = byKey.get(draft.key)!;
      return isDisabled(column) ? { ...column } : { ...column, show: draft.show, fixed: draft.fixed };
    });
  },
  { immediate: true }
);
function copyCommittedRows(): void {
  rows.value = committedRows.value.map(column => ({ ...column }));
}

function reset(): void {
  copyCommittedRows();
  clearDrag();
  emit("reset");
}

function confirm(): void {
  emit("update:columns", rows.value.map(column => ({ ...column })));
  open.value = false;
}

function isDisabled(column: FnColumnSettingsColumn): boolean {
  return column.dynamic === true || column.setting?.disabled === true || column.setting?.show === false;
}

function toggleAll(visible: boolean): void {
  for (const column of editableRows.value) {
    column.show = visible;
  }
}

function setFixed(column: FnColumnSettingsColumn, fixed: "left" | "right" | undefined): void {
  if (isDisabled(column)) return;
  const oldFixed = column.fixed;
  const oldIndex = rows.value.findIndex(item => item.key === column.key);
  column.fixed = fixed;
  const [movingColumn] = rows.value.splice(oldIndex, 1);

  if (fixed === "right") {
    const firstRightIndex = rows.value.findIndex(item => item.fixed === "right");
    rows.value.splice(firstRightIndex < 0 ? rows.value.length : firstRightIndex, 0, movingColumn);
  } else if (fixed === "left") {
    const firstNonLeftIndex = rows.value.findIndex(item => item.fixed !== "left");
    rows.value.splice(firstNonLeftIndex < 0 ? rows.value.length : firstNonLeftIndex, 0, movingColumn);
  } else if (oldFixed === "right") {
    const firstRightIndex = rows.value.findIndex(item => item.fixed === "right");
    rows.value.splice(firstRightIndex < 0 ? oldIndex : firstRightIndex, 0, movingColumn);
  } else {
    rows.value.splice(oldIndex, 0, movingColumn);
  }
}

function startDrag(event: DragEvent, key: string): void {
  const column = rows.value.find(item => item.key === key);
  if (!column || isDisabled(column)) {
    event.preventDefault();
    return;
  }
  draggingKey.value = key;
  event.dataTransfer?.setData("text/plain", key);
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
  }
}

function dropColumn(targetKey: string): void {
  const sourceKey = draggingKey.value;
  if (!sourceKey || sourceKey === targetKey) {
    clearDrag();
    return;
  }
  const sourceIndex = rows.value.findIndex(column => column.key === sourceKey);
  const targetIndex = rows.value.findIndex(column => column.key === targetKey);
  if (sourceIndex < 0 || targetIndex < 0) {
    clearDrag();
    return;
  }
  const sourceColumn = rows.value[sourceIndex];
  const targetColumn = rows.value[targetIndex];
  const start = Math.min(sourceIndex, targetIndex);
  const end = Math.max(sourceIndex, targetIndex);
  if (isDisabled(sourceColumn) || isDisabled(targetColumn) || rows.value.slice(start, end + 1).some(isDisabled)) {
    clearDrag();
    return;
  }

  if ((sourceColumn.fixed === "right" || targetColumn.fixed === "right") && (sourceColumn.fixed !== "right" || targetColumn.fixed !== "right")) {
    clearDrag();
    return;
  }

  if (sourceColumn.fixed === "right") {
    const rightPositions = rows.value.map((column, index) => (column.fixed === "right" ? index : -1)).filter(index => index >= 0);
    const rightColumns = rightPositions.map(index => rows.value[index]);
    const sourceGroupIndex = rightColumns.findIndex(column => column.key === sourceKey);
    const [movingColumn] = rightColumns.splice(sourceGroupIndex, 1);
    const targetGroupIndex = rightColumns.findIndex(column => column.key === targetKey);
    rightColumns.splice(targetGroupIndex, 0, movingColumn);
    const reorderedRows = [...rows.value];
    for (let index = 0; index < rightPositions.length; index++) {
      reorderedRows[rightPositions[index]] = rightColumns[index];
    }
    rows.value = reorderedRows;
    clearDrag();
    return;
  }

  rows.value.splice(sourceIndex, 1);

  let insertIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  if (sourceColumn.fixed === "left" && targetColumn.fixed === "left") {
    const firstLeftIndex = rows.value.findIndex(column => column.fixed === "left");
    if (targetColumn.key === rows.value[firstLeftIndex]?.key && firstLeftIndex >= 0) {
      insertIndex = firstLeftIndex + 1;
    }
  }
  rows.value.splice(insertIndex, 0, sourceColumn);
  clearDrag();
}

function moveWithKeyboard(event: KeyboardEvent, key: string): void {
  if (!event.altKey || !["ArrowUp", "ArrowDown"].includes(event.key)) {
    return;
  }
  event.preventDefault();
  const index = rows.value.findIndex(column => column.key === key);
  if (index < 0) return;
  const targetIndex = event.key === "ArrowUp" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= rows.value.length || isDisabled(rows.value[index]) || isDisabled(rows.value[targetIndex])) {
    return;
  }
  const [column] = rows.value.splice(index, 1);
  rows.value.splice(targetIndex, 0, column);
}

function clearDrag(): void {
  draggingKey.value = undefined;
  overKey.value = undefined;
}
</script>

<style lang="less">
.fn-column-settings-content {
  padding: 28px 22px 18px;
  font-size: 14px;
}

.fn-column-settings-body-bottom {
  margin-top: 16px;
}

.fn-column-settings-list {
  overflow: hidden;
  border: 1px solid var(--fn-color-border-secondary);
  border-radius: 8px;
  background: var(--fn-color-bg-container);
}

.fn-column-settings-list-header,
.fn-column-settings-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 158px;
  align-items: center;
  column-gap: 12px;
}

.fn-column-settings-list-header {
  min-height: 48px;
  padding: 0 14px;
  color: var(--fn-color-text-secondary);
  font-size: 13px;
}

.fn-column-settings-select-all,
.fn-column-settings-name {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.fn-column-settings-select-all {
  gap: 12px;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

.fn-column-settings-label {
  text-align: center;
  white-space: nowrap;
}

.fn-column-settings-row {
  min-height: 46px;
  padding: 0 8px 0 14px;
  transition: background-color 120ms ease;
  &.is-over {
    background: color-mix(in srgb, var(--fn-color-primary) 9%, transparent);
  }
  &.is-dragging {
    opacity: 0.45;
  }
}

.fn-column-settings-name {
  overflow: hidden;
  span {
    overflow: hidden;
    color: var(--fn-color-text);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.fn-column-settings-select-all .fn-checkbox,
.fn-column-settings-name .fn-checkbox {
  width: 18px;
  height: 18px;
}

.fn-column-settings-select-all .fn-checkbox-control,
.fn-column-settings-name .fn-checkbox-control {
  width: 18px;
  height: 18px;
}

.fn-column-settings-row.is-disabled .fn-column-settings-name span {
  color: var(--fn-color-text-tertiary);
}

.fn-column-settings-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
}

.fn-column-settings-fixed {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid var(--fn-color-border);
  border-radius: 7px;
  button {
    display: inline-flex;
    width: 25px;
    height: 25px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-right: 1px solid var(--fn-color-border-secondary);
    color: var(--fn-color-text-secondary);
    background: transparent;
    cursor: pointer;
    &:last-child {
      border-right: 0;
    }
    &:hover:enabled:not(.active) {
      background: var(--fn-color-fill-secondary);
    }
    &.active {
      color: #fff;
      background: var(--fn-color-primary);
    }
    &:disabled {
      color: var(--fn-color-text-tertiary);
      cursor: not-allowed;
      &.active {
        background: var(--fn-color-fill-secondary);
      }
    }
    &:focus-visible {
      position: relative;
      z-index: 1;
      outline: 2px solid var(--fn-color-primary);
      outline-offset: -2px;
    }
  }
}

.fn-column-settings-grip {
  display: inline-flex;
  width: 28px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 5px;
  color: var(--fn-color-text-tertiary);
  background: transparent;
  cursor: grab;
  &:hover:enabled {
    color: var(--fn-color-text);
    background: var(--fn-color-fill-secondary);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
  &:active {
    cursor: grabbing;
  }
  &:focus-visible {
    outline: 2px solid var(--fn-color-primary);
  }
}

.fn-column-settings-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.fn-column-settings-reset {
  display: inline-flex;
  min-width: 0;
  height: 40px;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--fn-color-border);
  border-radius: 7px;
  color: var(--fn-color-text);
  background: var(--fn-color-bg-container);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  &:hover {
    border-color: var(--fn-color-primary);
    color: var(--fn-color-primary);
  }
  &:focus-visible {
    outline: 2px solid var(--fn-color-primary);
    outline-offset: 2px;
  }
}

.fn-column-settings-confirm {
  flex: 1;
  .fn-button-wrap {
    display: flex;
    width: 100%;
  }
  .fn-button {
    width: 100%;
    height: 40px;
    min-height: 40px;
  }
}

@media (max-width: 460px) {
  .fn-column-settings-list-header,
  .fn-column-settings-row {
    grid-template-columns: minmax(0, 1fr) 148px;
    column-gap: 4px;
  }
  .fn-column-settings-content {
    padding-right: 12px;
    padding-left: 12px;
  }
}
</style>
