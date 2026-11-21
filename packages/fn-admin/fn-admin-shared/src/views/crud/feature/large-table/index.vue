<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { pageRequest, type LargeTableRow } from "./api"
import { columnKeys } from "./mock"

const state = reactive<FnCrudState<LargeTableRow>>({
  id: "shared-large-table",
  heading: { title: "200 行 × 100 列" },
  actionbar: { show: false, buttons: {} },
  rowHandle: { show: false },
  table: { rowKey: "id" },
  pagination: { pageSize: 20, pageSizeOptions: ["20", "50", "100", "200"] },
  columns: {
    __fn_blank_column: { key: "__fn_blank_column", title: "", show: false, cell: { show: false } },
    id: { key: "id", title: "行号", cell: { width: 88, fixed: "left" } },
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
