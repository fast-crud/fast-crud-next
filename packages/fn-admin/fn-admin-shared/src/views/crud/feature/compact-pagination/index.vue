<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

const state = reactive<FnCrudState<DemoRow>>({
  id: "shared-demo-compact-pagination",
  heading: { title: "简洁分页", description: "点击分页箭头逐页查看，或输入页码并按回车直接跳转。" },
  pagination: { simple: true, pageSize: 5, showQuickJumper: true },
  columns: {
    name: { key: "name", title: "审计事件", type: "text", search: { component: { placeholder: "请输入审计事件" }, width: 180 }, cell: { width: 220 } },
    actor: { key: "actor", title: "操作人", cell: { width: 150 } },
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
