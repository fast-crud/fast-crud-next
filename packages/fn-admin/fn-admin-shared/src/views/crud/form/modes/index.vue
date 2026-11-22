<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

const state = reactive<FnCrudState<DemoRow>>({
  id: "shared-demo-modes",
  heading: { title: "新增与编辑配置", description: "分别打开「新增」和任意行的「编辑」，对比弹窗标题、默认值和确认按钮。" },
  rowHandle: { width: 150 },
  form: { dialog: { title: "维护窗口", width: 620 } },
  addForm: { dialog: { title: "安排维护窗口", buttons: { confirm: { text: "创建窗口" } } } },
  editForm: { dialog: { title: "修改维护窗口", buttons: { confirm: { text: "保存修改" } } } },
  columns: {
    name: { key: "name", title: "维护窗口", type: "text", search: { component: { placeholder: "请输入维护窗口" }, width: 180 }, cell: { width: 220 }, form: { span: 24, rules: [{ required: true, message: "请输入名称" }] } },
    window: { key: "window", title: "维护时段", form: { value: "周六" } },
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
