<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

const state = reactive<FnCrudState<DemoRow>>({
  id: "shared-demo-header-filters",
  heading: { title: "组合表头筛选", description: "分别点击「区域」和「状态」表头的筛选图标，确认条件后查看交集，再重置其中一列。" },
  columns: {
    name: { key: "name", title: "节点", type: "text", search: { component: { placeholder: "请输入节点" }, width: 180 }, cell: { width: 220 } },
    region: { key: "region", title: "区域", cell: { filter: { options: ["华北", "华东"].map(value => ({ label: value, value })) } } },
    status: { key: "status", title: "状态", cell: { filter: { options: ["在线", "离线", "维护"].map(value => ({ label: value, value })) } } },
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
