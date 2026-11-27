<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

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
  <div class="crud-page showcase-page">
    <FnCrud v-bind="state" />
  </div>
</template>
