<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

const state = reactive<FnCrudState<DemoRow>>({
  id: "shared-demo-column-preferences",
  heading: { title: "列配置偏好", description: "打开「列设置」调整显隐和顺序，拖动列边缘调整宽度，刷新后查看保存结果。" },
  table: { density: "compact" },
  columns: {
    name: { key: "name", title: "资产", type: "text", search: { component: { placeholder: "请输入资产" }, width: 180 }, cell: { width: 220 } },
    region: { key: "region", title: "区域", cell: { width: 160 } },
    note: { key: "note", title: "用途", cell: { width: 180 } },
    owner: { key: "owner", title: "责任人", cell: { width: 180 } },
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
