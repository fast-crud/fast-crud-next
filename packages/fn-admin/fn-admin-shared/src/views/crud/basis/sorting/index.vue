<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

const state = reactive<FnCrudState<DemoRow>>({
  id: "shared-demo-sorting",
  heading: { title: "表头排序", description: "连续点击「耗时（毫秒）」表头，依次查看升序、降序和取消排序。" },
  columns: {
    name: { key: "name", title: "接口调用", type: "text", search: { component: { placeholder: "请输入接口调用" }, width: 180 }, cell: { width: 220 } },
    latency: { key: "latency", title: "耗时（毫秒）", cell: { sortable: true, width: 150 } },
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
