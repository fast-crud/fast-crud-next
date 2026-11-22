<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

const state = reactive<FnCrudState<DemoRow>>({
  id: "shared-demo-fixed-columns",
  heading: { title: "左右固定列", description: "横向滚动表格，确认「任务名称」固定在左侧，「状态」固定在右侧。" },
  table: { minWidth: 1300 },
  columns: {
    name: { key: "name", title: "任务名称", type: "text", search: { component: { placeholder: "请输入任务名称" }, width: 180 }, cell: { fixed: "left", width: 160 } },
    region: { key: "region", title: "区域", cell: { width: 200 } },
    owner: { key: "owner", title: "负责人", cell: { width: 220 } },
    schedule: { key: "schedule", title: "巡检周期", cell: { width: 240 } },
    note: { key: "note", title: "检查项", cell: { width: 320 } },
    status: { key: "status", title: "状态", cell: { fixed: "right", width: 110 } },
  },
  request: api,
})

useFnCrud({ state })
</script>

<template>
  <div class="crud-page showcase-page">
    <FnCrud v-bind="state" />
  </div>
</template>
