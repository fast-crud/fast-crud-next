<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { pageRequest, type LargeTableRow } from "./api"
import { columnKeys } from "./mock"

const state = reactive<FnCrudState<LargeTableRow>>({
  id: "shared-large-table",
  heading: { title: "1000 行 × 100 列", description: "向右滚动查看后续数据列，确认行号停在左侧。切换每页条数可比较不同的数据量。" },
  actionbar: { show: false, buttons: {} },
  rowHandle: { show: false },
  table: { rowKey: "id" },
  pagination: { pageSize: 200, pageSizeOptions: ["20", "50", "100", "200"] },
  columns: {
    id: { key: "id", title: "行号", type: "text", search: { component: { placeholder: "请输入行号" }, width: 160 }, cell: { width: 88, fixed: "left" } },
    ...Object.fromEntries(columnKeys.map((key, index) => [
      key,
      { key, title: `数据列 ${index + 1}`, cell: { width: 112 } },
    ])),
  },
  request: { pageRequest },
})

useFnCrud({ state })
</script>

<template>
  <div class="crud-page showcase-page">
      <FnCrud v-bind="state" />
  </div>
</template>
