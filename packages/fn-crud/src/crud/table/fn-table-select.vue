<template>
  <div class="fn-table-select">
    <div class="fn-table-select-control" :class="{ 'is-disabled': disabled }" :role="disabled ? undefined : 'button'" :tabindex="disabled ? -1 : 0" :aria-label="placeholder" aria-haspopup="dialog" :aria-expanded="open" @click="openDialog" @keydown="handleKeydown">
      <span class="fn-table-select-value" :class="{ 'is-placeholder': !displayLabel }">{{ displayLabel || placeholder }}</span>
      <span class="fn-table-select-suffix">
        <button v-if="hasValue && allowClear && !disabled" class="fn-table-select-clear" type="button" aria-label="清除选择" @click.stop="clear"><X :size="14" /></button>
        <Search v-else :size="16" />
      </span>
    </div>
    <Teleport to="body">
      <FnModal v-model:open="open" class="fn-table-select-dialog" role="dialog" aria-modal="true" :aria-label="title" :title="title" :width="920" :buttons="dialogButtons" @confirm="confirm">
        <div class="fn-table-select-content"><FnCrud v-bind="tableOptions" /></div>
        <template #footerLeft><span class="fn-table-select-summary">{{ draft ? `已选择：${getLabel(draft)}` : "请选择一条记录" }}</span></template>
      </FnModal>
    </Teleport>
  </div>
</template>

<script setup lang="tsx">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { Search, X } from "@lucide/vue";
import FnCrud from "../crud/fn-crud.vue";
import FnModal from "../modal/fn-modal.vue";
import { useFnUiServices } from "../use";
import type { FnCrudOptions, FnTablePageQuery, FnTablePageResult, FnTableRow, FnTableSelectProps } from "../types/index";

const props = withDefaults(defineProps<FnTableSelectProps>(), { title: "选择记录", placeholder: "请选择", disabled: false, allowClear: true });
const { notification } = useFnUiServices();
const emit = defineEmits<{
  "update:modelValue": [value: string | number | undefined];
  change: [value: string | number | undefined, row: FnTableRow | undefined];
}>();
const open = ref(false);
const selected = ref<FnTableRow>();
const draft = ref<FnTableRow>();
const hasValue = computed(() => props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== "");
function getKey(row: FnTableRow): string | number | undefined {
  const value = row[props.dict.value || "id"];
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  return undefined;
}
function getLabel(row: FnTableRow): string {
  if (typeof props.dict.label === "function") {
    return props.dict.label(row);
  }
  const label = row[props.dict.label || "label"];
  return typeof label === "string" || typeof label === "number" ? String(label) : String(getKey(row) ?? "");
}
const displayLabel = computed(() => {
  if (selected.value) {
    return getLabel(selected.value);
  }
  return hasValue.value ? String(props.modelValue) : "";
});
let loadId = 0;
watch(
  () => props.modelValue,
  async value => {
    const id = ++loadId;
    if (!hasValue.value) {
      selected.value = undefined;
      return;
    }
    if (selected.value && String(getKey(selected.value)) === String(value)) return;
    selected.value = undefined;
    try {
      if (!props.dict.getNodesByValues) {
        return;
      }
      const rows = await props.dict.getNodesByValues([value]);
      if (id === loadId) {
        selected.value = rows.find(row => String(getKey(row)) === String(value));
        if (open.value && !draft.value) {
          draft.value = selected.value;
        }
      }
    } catch {
      if (id === loadId) notification.error({ message: "已选记录加载失败，请重新选择" });
    }
  },
  { immediate: true }
);
const tableOptions = computed<FnCrudOptions<FnTableRow>>(() => ({
  ...props.crudOptions,
  heading: { show: false },
  actionbar: { show: false, buttons: {} },
  toolbar: { show: false, buttons: {} },
  rowSelect: {
    type: "single",
    crossPage: false,
    onChange: (_keys: Array<string | number>, rows: FnTableRow[]) => {
      draft.value = rows[0];
    },
  },
  rowHandle: { show: false },
  table: { ...props.crudOptions.table, rowKey: props.dict.value || "id" },
  columns: props.crudOptions.columns,
  request: {
    pageRequest: async (query: FnTablePageQuery): Promise<FnTablePageResult<FnTableRow>> => {
      try {
        return await props.crudOptions.request.pageRequest(query);
      } catch {
        notification.error({ message: "列表加载失败，请重新查询" });
        return { records: [], total: 0 };
      }
    },
  },
}));
const dialogButtons = computed(() => ({ reset: { show: false }, confirm: { disabled: !draft.value } }));
function openDialog(): void {
  if (props.disabled) {
    return;
  }
  draft.value = selected.value;
  open.value = true;
}
function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  event.preventDefault();
  openDialog();
}
function confirm(): void {
  if (!draft.value || props.disabled) {
    return;
  }
  const key = getKey(draft.value);
  if (key === undefined) {
    return;
  }
  selected.value = draft.value;
  emit("update:modelValue", key);
  emit("change", key, draft.value);
  open.value = false;
}
function clear(): void {
  selected.value = undefined;
  emit("update:modelValue", undefined);
  emit("change", undefined, undefined);
}
onBeforeUnmount(() => {
  loadId++;
});
</script>

<style lang="less">
.fn-table-select {
  width: 100%;
  .fn-table-select-control {
    display: flex;
    width: 100%;
    min-height: 34px;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0 10px;
    border: 1px solid var(--fn-color-border);
    border-radius: var(--fn-border-radius, 6px);
    background: var(--fn-color-bg-container);
    cursor: pointer;
  }
  .fn-table-select-control:focus-visible { outline: 2px solid var(--fn-color-primary); outline-offset: 2px; }
  .fn-table-select-control.is-disabled { opacity: 0.55; cursor: not-allowed; }
  .fn-table-select-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .fn-table-select-value.is-placeholder { color: var(--fn-color-text-tertiary); }
  .fn-table-select-suffix { display: inline-flex; flex: none; align-items: center; color: var(--fn-color-text-tertiary); }
  .fn-table-select-clear {
    display: flex;
    align-items: center;
    padding: 0;
    border: 0;
    background: transparent;
    color: #8a95a6;
    cursor: pointer;
  }
  .dark & .fn-table-select-clear {
    color: rgba(255, 255, 255, 0.65);
  }
}
.fn-table-select-dialog {
  .fn-table-select-content {
    display: flex;
    height: min(460px, 55vh);
    min-height: 0;
    .fn-crud {
      padding: 0;
    }
    .fn-table {
      margin: 0;
    }
    .fn-crud-header {
      margin-bottom: 12px;
    }
  }
  .fn-table-select-summary {
    color: #8490a3;
    margin-right: auto;
  }
  .dark & {
    background: #1f1f1f;
    color: rgba(255, 255, 255, 0.85);
    .fn-table-select-summary {
      color: rgba(255, 255, 255, 0.65);
    }
  }
}
</style>
