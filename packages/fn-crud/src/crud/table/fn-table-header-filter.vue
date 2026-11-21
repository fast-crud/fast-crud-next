<template>
  <FnPopover v-model:open="open" :label="label">
    <template #default="{ attrs }">
      <button v-bind="attrs" type="button" class="fn-table-header-filter" :class="{ 'is-active': values.length > 0 }" :aria-label="label" @click.stop="open = !open">
        <ListFilter :size="14" aria-hidden="true" />
      </button>
    </template>
    <template #content="{ close }">
      <div class="fn-table-header-filter-panel" @click.stop>
        <FnCheckboxGroup v-model="selection" :options="options" :aria-label="label" />
        <div class="fn-table-header-filter-actions">
          <FnButtonBase type="default" text="重置" @click="submit([], close)" />
          <FnButtonBase text="确认" @click="submit(selection, close)" />
        </div>
      </div>
    </template>
  </FnPopover>
</template>

<script setup lang="tsx">
import { ListFilter } from "@lucide/vue";
import { computed, ref, watch } from "vue";
import FnButtonBase from "../../components/button/fn-button-base.vue";
import FnPopover from "../../components/overlay/fn-popover.vue";
import FnCheckboxGroup from "../../components/selection/fn-checkbox-group.vue";
import type { FnOptionValue, FnSelectOption } from "../../components/selection/types";

const props = defineProps<{ options: FnSelectOption[]; value?: unknown; title: string }>();
const emit = defineEmits<{ change: [values: FnOptionValue[]] }>();
const open = ref(false);
const draft = ref<FnOptionValue[]>();
const label = computed(() => `筛选${props.title}`);
const values = computed(() => {
  const value = props.value;
  if (Array.isArray(value)) return value as FnOptionValue[];
  return typeof value === "boolean" || typeof value === "number" || (typeof value === "string" && value !== "") ? [value] : [];
});

const selection = computed({
  get: () => draft.value ?? values.value,
  set: value => { draft.value = value; },
});

watch(open, (value) => {
  if (!value) draft.value = undefined;
});

function submit(selected: FnOptionValue[], close: () => void): void {
  emit("change", [...selected]);
  close();
}
</script>

<style lang="less">
.fn-table-header-filter {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--fn-color-text-quaternary);
  cursor: pointer;

  &:hover,
  &[aria-expanded="true"] {
    background: var(--fn-color-fill-alter);
  }

  &.is-active {
    color: var(--fn-color-primary);
  }
}

.fn-table-header-filter-panel {
  .fn-checkbox-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .fn-table-header-filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--fn-color-border-secondary);
  }
}
</style>
