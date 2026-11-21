<template>
  <div class="fn-table" :style="tableDensityStyle" :data-density="density" :aria-busy="loading">
    <FnRender v-if="slots?.top" :render="slots.top" :ctx="{ data, loading }" />
    <div ref="scrollElement" class="fn-table-scroll" @scroll="updateScrollEdge">
      <table :style="tableStyle">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" :class="columnClasses(column)" :style="columnStyle(column, column.key)" :title="column.title" @click="column.resizable === false ? undefined : sortColumn(column.key)">
                <span class="fn-table-heading-content">
                  <FnRender v-if="column.slots?.header" :render="column.slots.header" :ctx="{ column }" />
                  <template v-else>
                  {{ column.title }}
                  </template>
                  <ArrowUp v-if="sort.prop === column.key && sort.asc" class="fn-table-sort-indicator" />
                  <ArrowDown v-else-if="sort.prop === column.key" class="fn-table-sort-indicator" />
                </span>
              <span v-if="column.resizable !== false" class="fn-table-resize-handle" title="调节列宽度" @pointerdown.stop="startResize($event, column)" @click.stop />
            </th>
          </tr>
        </thead>
        <tbody>
          <FnTableRowComponent v-for="(row, index) in data" :key="getRowKey(row, index)" :row="row" :index="index" :columns="columns" :slots="slots" :get-component-ref="key => getCellComponentRef(row, key)" :set-component-ref="(key, instance) => setCellComponentRef(row, key, instance)"  :column-classes="columnClasses" :column-style="columnStyle" />
          <tr v-if="!data.length">
            <td :colspan="columns.length" class="fn-table-empty">
              <FnRender v-if="slots?.empty" :render="slots.empty" :ctx="{ columns, loading }" /><template v-else>{{ emptyText || "暂无数据" }}</template>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="resizeIndicatorLeft !== null" class="fn-table-resize-indicator" :style="{ left: `${resizeIndicatorLeft}px` }" aria-hidden="true"></div>
    </div>
    <FnRender v-if="slots?.bottom" :render="slots.bottom" :ctx="{ data, loading }" />
    <div v-if="loading" class="fn-table-loading" role="status" aria-live="polite">
      <span class="fn-table-spinner" aria-hidden="true"></span>
      <span>加载中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp } from "@lucide/vue";
import { computed, onBeforeUnmount, onMounted, onUpdated, provide, ref, type CSSProperties } from "vue";
import FnTableRowComponent from "./fn-table-row.vue";
import FnRender from "../components/fn-render";
import { isFnComputeValue } from "../use/compute";
import type { FnDynamic, FnTableColumn, FnTableProps, FnTableRow as FnTableRowRecord } from "../types/index";
import { getFnTableRowKey } from "./row-key";
import { fnTableSizeKey } from "../provider/context";

type FnTableColumnConfig = FnTableColumn<FnTableRowRecord> & { key: string; sourceCell: FnDynamic<FnTableColumn<FnTableRowRecord>> };
const props = withDefaults(defineProps<FnTableProps>(), { data: () => [], loading: false, emptyText: "暂无数据", sort: () => ({ prop: "", asc: true }) });
const size = computed(() => props.size ?? 14);
const density = computed(() => props.density ?? "comfort");
provide(
  fnTableSizeKey,
  computed(() => ({ size: props.size, density: props.density }))
);
const tableDensityStyle = computed<CSSProperties>(() => ({ "--fn-table-font-size": `${size.value}px`, "--fn-table-header-font-size": `${size.value}px` }) as CSSProperties);
const slots = computed(() => props.slots);
const columns = computed(() => {
  const result: FnTableColumnConfig[] = [];
  for (const [key, column] of Object.entries(props.columns || {})) {
    // 动态单元格依赖实际 row，由 FnTableRow 在行内解析。
    const cell = column.cell && !isFnComputeValue(column.cell) ? column.cell : {};
    if (column.show === false || (column.show === undefined && cell.show === false)) {
      continue;
    }
    result.push({ ...cell, key, title: cell.title ?? column.title, sourceCell: column.cell || cell });
  }
  return result.sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER));
});
const leftFixedShadowKey = computed(() => {
  const leftFixedColumns = columns.value.filter(column => column.fixed === "left");
  return leftFixedColumns[leftFixedColumns.length - 1]?.key;
});
const rightFixedShadowKey = computed(() => columns.value.find(column => column.fixed === "right")?.key);
const emit = defineEmits<{
  sort: [value: { prop: string; asc: boolean }];
  "column-resize": [value: { key: string; width: number }];
}>();
const scrollElement = ref<HTMLElement | null>(null);
const isAtLeftEdge = ref(true);
const isAtRightEdge = ref(false);
const resizing = ref(false);
const resizeIndicatorLeft = ref<number | null>(null);
const cellComponentRefs = new Map<string, unknown>();
function updateScrollEdge(event?: Event): void {
  const element = (event?.currentTarget as HTMLElement | null) ?? scrollElement.value;
  if (!element) {
    return;
  }
  isAtLeftEdge.value = element.scrollLeft <= 1;
  isAtRightEdge.value = element.scrollWidth <= element.clientWidth || element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
}

onMounted(() => {
  updateScrollEdge();
  window.addEventListener("resize", updateScrollEdge);
});
onUpdated(updateScrollEdge);
onBeforeUnmount(() => window.removeEventListener("resize", updateScrollEdge));

const tableStyle = computed(() => {
  if (typeof props.minWidth === "number") {
    return { minWidth: `${props.minWidth}px` };
  }
  return { minWidth: props.minWidth };
});
function columnStyle(column: FnTableColumnConfig, key: string): CSSProperties {
  const style: CSSProperties = {};
  const width = column.width;
  style.width = width ? (typeof width === "number" ? `${width}px` : width) : "120px";
  if (column.align) {
    style.textAlign = column.align;
  }
  if (column.ellipsis) {
    style.overflow = "hidden";
    style.textOverflow = "ellipsis";
  }
  if (column.fixed === "left") {
    const leftColumns = columns.value.filter(item => item.fixed === "left");
    const columnIndex = leftColumns.findIndex(item => item.key === key);
    let offset = 0;
    for (const leftColumn of leftColumns.slice(0, columnIndex)) {
      offset += getFixedColumnWidth(leftColumn);
    }
    style.left = `${offset}px`;
  } else if (column.fixed === "right") {
    const rightColumns = columns.value.filter(item => item.fixed === "right");
    const columnIndex = rightColumns.findIndex(item => item.key === key);
    let offset = 0;
    for (const rightColumn of rightColumns.slice(columnIndex + 1)) {
      offset += getFixedColumnWidth(rightColumn);
    }
    style.right = `${offset}px`;
  }
  return style;
}

function getFixedColumnWidth(column: FnTableColumnConfig): number {
  const width = column.width;
  if (typeof width === "number") {
    return width;
  }
  if (typeof width === "string" && /^\d+(?:\.\d+)?(?:px)?$/.test(width)) {
    return Number.parseFloat(width);
  }
  return 120;
}

function sortColumn(prop: string): void {
  if (resizing.value) {
    return;
  }
  if (props.sort?.prop !== prop) {
    emit("sort", { prop, asc: true });
  } else if (props.sort.asc) {
    emit("sort", { prop, asc: false });
  } else {
    emit("sort", { prop: "", asc: true });
  }
}

function startResize(event: PointerEvent, column: FnTableColumnConfig) {
  resizing.value = true;
  const startX = event.clientX;
  const initialWidth = getColumnWidth(column.width);
  const scrollElement = (event.currentTarget as HTMLElement | null)?.closest(".fn-table-scroll") as HTMLElement | null;
  const scrollRect = scrollElement?.getBoundingClientRect();
  const initialIndicatorLeft = scrollRect ? event.clientX - scrollRect.left + scrollElement!.scrollLeft : startX;
  let width = initialWidth;
  resizeIndicatorLeft.value = initialIndicatorLeft;
  const onPointerMove = (moveEvent: PointerEvent) => {
    width = Math.max(50, initialWidth + moveEvent.clientX - startX);
    if (scrollRect && scrollElement) {
      resizeIndicatorLeft.value = moveEvent.clientX - scrollRect.left + scrollElement.scrollLeft;
    } else {
      resizeIndicatorLeft.value = initialIndicatorLeft + moveEvent.clientX - startX;
    }
  };
  const finishResize = (commit: boolean) => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerCancel);
    resizeIndicatorLeft.value = null;
    if (commit) {
      emit("column-resize", { key: column.key, width });
    }
    window.setTimeout(() => {
      resizing.value = false;
    });
  };
  const onPointerUp = () => finishResize(true);
  const onPointerCancel = () => finishResize(false);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerCancel);
}

function getColumnWidth(width: number | string | undefined): number {
  if (typeof width === "number") {
    return width;
  }
  if (typeof width === "string") {
    const parsedWidth = Number.parseFloat(width);
    if (!Number.isNaN(parsedWidth)) {
      return parsedWidth;
    }
  }
  return 120;
}

function columnClasses(column: FnTableColumnConfig): Array<string | undefined> {
  return [
    column.class,
    column.resizable === false ? "fn-table-column-unresizable" : undefined,
    column.fixed ? `fn-table-fixed-${column.fixed}` : undefined,
    column.key === leftFixedShadowKey.value && !isAtLeftEdge.value ? "fn-table-fixed-left-shadow" : undefined,
    column.key === rightFixedShadowKey.value && !isAtRightEdge.value ? "fn-table-fixed-right-shadow" : undefined,
  ];
}


function componentRefKey(row: FnTableRowRecord, key?: string): string {
  return `${String(getRowKey(row, props.data.indexOf(row)))}:${key || "default"}`;
}

function setCellComponentRef(row: FnTableRowRecord, key: string, instance: unknown): void {
  const refKey = componentRefKey(row, key);
  if (instance) {
    cellComponentRefs.set(refKey, instance);
  } else {
    cellComponentRefs.delete(refKey);
  }
}

function getCellComponentRef(row: FnTableRowRecord, key?: string): unknown {
  return cellComponentRefs.get(componentRefKey(row, key));
}

function getRowKey(row: FnTableRowRecord, index: number): string | number {
  return getFnTableRowKey(row, index, props.rowKey);
}

</script>

<style lang="less">
.fn-table {
  --fn-table-font-size: 14px;
  --fn-table-header-font-size: 14px;
  --fn-table-cell-padding-y: 12px;
  &[data-density="compact"] {
    --fn-table-cell-padding-y: 6px;
  }
  position: relative;
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  color: var(--fn-color-text);
  margin: 0 -20px;

  .fn-table-loading {
    position: absolute;
    inset: 0;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    color: var(--fn-color-text-secondary);
    background: color-mix(in srgb, var(--fn-color-bg-container) 75%, transparent);
  }

  .fn-table-scroll {
    position: relative;
    min-height: 0;
    flex: 1;
    overflow: auto;
    border-top: 1px solid var(--fn-color-border-secondary);
    border-bottom: 1px solid var(--fn-color-border-secondary);
    margin: 0;
  }
  .fn-table-resize-indicator {
    position: absolute;
    z-index: 5;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--fn-color-primary);
    pointer-events: none;
  }
  table {
    width: 100%;
    height: fit-content;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;

    th,
    td {
      padding: var(--fn-table-cell-padding-y) 12px;
      border-bottom: 1px solid var(--fn-color-border-secondary);
      text-align: left;
      font-size: var(--fn-table-font-size);
      white-space: nowrap;
    }

    .fn-table-selection-column {
      width: 56px;
      min-width: 56px;
      padding-right: 8px;
      padding-left: 8px;
      text-align: center;
    }

    .fn-table-column-unresizable {
      cursor: default;
    }

    .fn-table-checkbox { width: 16px; height: 16px; }

    th {
      position: sticky;
      z-index: 1;
      top: 0;
      cursor: pointer;
      user-select: none;
      color: var(--fn-color-text-secondary);
      background: linear-gradient(var(--fn-color-fill-alter), var(--fn-color-fill-alter)), var(--fn-color-bg-container);
      font-size: var(--fn-table-header-font-size);
      // box-shadow: 0 1px 0 var(--fn-color-border-secondary);
    }

    .fn-table-heading-content {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      gap: 4px;
      svg.fn-table-sort-indicator {
        height: 18px;
      }
    }

    .fn-table-sort-indicator {
      color: var(--fn-color-text-tertiary);
      width: 12px;
    }

    .fn-table-resize-handle {
      position: absolute;
      top: 6px;
      right: 0;
      bottom: 6px;
      width: 8px;
      border-right: 1px solid transparent;
      cursor: col-resize;
    }

    // .fn-table-resize-handle::after {
    //   position: absolute;
    //   top: 50%;
    //   right: -4px;
    //   color: #98a2b1;
    //   content: "↔";
    //   font-size: 11px;
    //   opacity: 0;
    //   transform: translateY(-50%);
    // }

    th:hover .fn-table-resize-handle {
      border-right-color: var(--fn-color-border);
    }

    th:hover .fn-table-resize-handle::after {
      opacity: 1;
    }

    td {
      background: var(--fn-color-bg-container);
      overflow: hidden;
    }
  }
  .fn-table-cell,
  .fn-table-cell .fn-button {
    font-size: var(--fn-table-font-size);
  }
  .fn-table-cell-buttons {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  tbody tr:hover {
    background: var(--fn-color-fill-secondary);
  }
  tbody tr:hover td {
    background: var(--fn-color-fill-secondary);
  }
  .fn-table-fixed-left,
  .fn-table-fixed-right {
    position: sticky;
    z-index: 2;
    isolation: isolate;
    background: var(--fn-color-bg-container);
  }
  .fn-table-fixed-left {
    left: 0;
  }
  .fn-table-fixed-right {
    right: 0;
  }
  .fn-table-fixed-left-shadow {
    overflow: visible;

    .fn-table-cell {
      overflow: hidden;
    }

    &::after {
      position: absolute;
      top: -1px;
      right: -12px;
      bottom: -1px;
      width: 12px;
      background: linear-gradient(to right, rgb(23 32 51 / 18%), transparent);
      content: "";
      pointer-events: none;
    }
  }
  .fn-table-fixed-right-shadow {
    overflow: visible;

    .fn-table-cell {
      overflow: hidden;
    }

    &::before {
      position: absolute;
      top: -1px;
      bottom: -1px;
      left: -12px;
      width: 12px;
      background: linear-gradient(to left, rgb(23 32 51 / 18%), transparent);
      content: "";
      pointer-events: none;
    }
  }
  th.fn-table-fixed-left,
  th.fn-table-fixed-right {
    z-index: 3;
    background: linear-gradient(var(--fn-color-fill-alter), var(--fn-color-fill-alter)), var(--fn-color-bg-container);
  }
  .fn-table-empty {
    padding: 42px !important;
    color: var(--fn-color-text-tertiary);
    text-align: center !important;
  }
  .dark & {
    color: var(--fn-color-text);

    .fn-table-loading {
      color: var(--fn-color-text);
      background: color-mix(in srgb, var(--fn-color-bg-container) 75%, transparent);
    }

    .fn-table-scroll,
    th,
    td {
      border-color: var(--fn-color-border-secondary);
    }

    th,
    th.fn-table-fixed-left,
    th.fn-table-fixed-right {
      color: var(--fn-color-text-secondary);
      background: linear-gradient(var(--fn-color-fill-alter), var(--fn-color-fill-alter)), var(--fn-color-bg-container);
      box-shadow: 0 1px 0 var(--fn-color-border-secondary);
    }

    td {
      background: var(--fn-color-bg-container);
    }

    .fn-table-fixed-left,
    .fn-table-fixed-right {
      background: var(--fn-color-bg-container);
    }

    .fn-table-fixed-left-shadow {
      &::after {
        background: linear-gradient(to right, rgb(0 0 0 / 55%), transparent);
      }
    }

    .fn-table-fixed-right-shadow {
      &::before {
        background: linear-gradient(to left, rgb(0 0 0 / 55%), transparent);
      }
    }

    th.fn-table-fixed-left,
    th.fn-table-fixed-right {
      background: linear-gradient(var(--fn-color-fill-alter), var(--fn-color-fill-alter)), var(--fn-color-bg-container);
    }

    tbody tr:hover {
      background: var(--fn-color-fill-secondary);

      .fn-table-fixed-left,
      .fn-table-fixed-right {
        background: var(--fn-color-fill-secondary);
      }
    }

    tbody tr:hover td {
      background: var(--fn-color-fill-secondary);
    }
  }

  .fn-table-spinner {
    width: 22px;
    height: 22px;
    border: 2px solid var(--fn-color-border-secondary);
    border-top-color: var(--fn-color-primary);
    border-radius: 50%;
    animation: fn-table-spin 700ms linear infinite;
  }
}

@keyframes fn-table-spin {
  to { transform: rotate(360deg); }
}
</style>
