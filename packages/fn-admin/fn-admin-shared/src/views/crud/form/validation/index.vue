<script setup lang="tsx">
import { reactive } from "vue"
import { FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

const state = reactive<FnCrudState<DemoRow>>({
  id: "shared-demo-validation",
  heading: { title: "表单校验与布局", description: "点击「新增」，清空名称或输入无效邮箱后提交，查看字段下方的校验提示。" },
  rowHandle: { width: 150 },
  form: { dialog: { title: "值班联系人", width: 520 } },
  columns: {
    name: { key: "name", title: "值班联系人", type: "text", search: { component: { placeholder: "请输入值班联系人" }, width: 180 }, cell: { width: 220 }, form: { span: 24, rules: [{ required: true, message: "请输入名称" }] } },
    email: { key: "email", title: "通知邮箱", form: { span: 24, rules: [
        { required: true, message: "请输入通知邮箱" },
        { type: "email", message: "请输入有效的邮箱地址" },
      ] } },
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
