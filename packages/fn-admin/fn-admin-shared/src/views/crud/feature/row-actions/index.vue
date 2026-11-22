<script setup lang="tsx">
import { reactive, ref } from "vue"
import { FnCrud, type FnCrudExpose, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next"
import { api, type DemoRow } from "./api"

const crud = ref<FnCrudExpose<DemoRow>>()
const state = reactive<FnCrudState<DemoRow>>({
  id: "shared-demo-row-actions",
  heading: { title: "行操作菜单", description: "打开任意行的「更多」，选择「复制为新记录」，检查弹窗是否已带入名称和渠道。" },
  rowHandle: { width: 220, buttons: {
    more: {
      text: "更多",
      buttonType: "dropdown",
      items: [{
        key: "copy",
        label: "复制为新记录",
        click: ({ row }) => { void crud.value?.form.openAddForm({ name: row.name + "（副本）", channel: row.channel }) },
      }],
    },
  } },
  columns: {
    name: { key: "name", title: "通知规则", type: "text", search: { component: { placeholder: "请输入通知规则" }, width: 180 }, cell: { width: 220 }, form: { span: 24, rules: [{ required: true, message: "请输入名称" }] } },
    channel: { key: "channel", title: "渠道", form: { rules: [{ required: true, message: "请输入通知渠道" }] } },
  },
  request: api,
})

useFnCrud({ state, crudRef: crud })
</script>

<template>
  <div class="crud-page showcase-page">
    <FnCrud ref="crud" v-bind="state" />
  </div>
</template>
