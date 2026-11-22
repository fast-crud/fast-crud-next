<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

const state = reactive<FnCrudState<DemoRow>>({
  id: "shared-demo-quick-search",
  heading: { title: "快捷搜索", description: "点击「仅看待处理」应用状态条件，再点击「清空」恢复全部记录。" },
  search: { buttons: {
    search: { text: "查询", click: ctx => ctx.search() },
    reset: { text: "清空", click: ctx => ctx.reset() },
    pending: { text: "仅看待处理", click: ctx => { ctx.form.status = "待处理"; ctx.search() } },
  } },
  columns: {
    name: { key: "name", title: "工单", cell: { width: 220 } },
    status: { key: "status", title: "状态", type: "text", search: { component: { placeholder: "请输入状态" }, width: 180 } },
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
