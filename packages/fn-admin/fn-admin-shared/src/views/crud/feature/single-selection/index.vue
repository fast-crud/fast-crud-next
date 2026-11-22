<script setup lang="tsx">
import { reactive, ref } from "vue"
import { DictStore, FnCrud, FnTableSelect, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

const selectedReleaseId = ref<number>()
const releaseDict = new DictStore({ value: "id", label: "name" })
const releaseSelectOptions = {
  columns: {
    name: { key: "name", title: "发布单", cell: { width: 220 } },
    version: { key: "version", title: "版本", cell: { width: 140 } },
  },
  request: { pageRequest: api.pageRequest },
}

const state = reactive<FnCrudState<DemoRow>>({
  id: "shared-demo-single-selection",
  heading: { title: "单选记录", description: "依次点击两行的单选框，确认只有最后选中的一行保持选中。" },
  actionbar: { show: false, buttons: {} },
  rowSelect: { type: "single" },
  columns: {
    name: { key: "name", title: "发布单", type: "text", search: { component: { placeholder: "请输入发布单" }, width: 180 }, cell: { width: 220 } },
    version: { key: "version", title: "版本", cell: { width: 140 } },
  },
  request: { pageRequest: api.pageRequest },
})

useFnCrud({ state })
</script>

<template>
  <div class="crud-page showcase-page single-selection-demo">
    <div class="table-select-demo">
      <label for="release-table-select">发布单</label>
      <FnTableSelect
        id="release-table-select"
        v-model="selectedReleaseId"
        :dict="releaseDict"
        :crud-options="releaseSelectOptions"
        :dialog="{ width: '72vw', title: '选择发布单' }"
      />
      <span v-if="selectedReleaseId !== undefined">已选记录 ID：{{ selectedReleaseId }}</span>
    </div>
    <FnCrud v-bind="state" />
  </div>
</template>

<style lang="less">
.table-select-demo {
  display: grid;
  max-width: 520px;
  grid-template-columns: auto minmax(240px, 1fr);
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 16px;

  span {
    grid-column: 2;
    color: var(--fn-color-text-secondary);
    font-size: 13px;
  }
}
</style>
