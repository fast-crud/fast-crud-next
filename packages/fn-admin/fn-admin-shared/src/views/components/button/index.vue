<script setup lang="tsx">
import { markRaw, reactive } from "vue";
import { FnButton, FnCrud, type FnCrudState, useFnCrud, useFnUiServices } from "@fast-crud/fast-crud-next";
import { request, type ComponentDemoRow } from "../shared/api";

const { message } = useFnUiServices();
const state = reactive<FnCrudState<ComponentDemoRow>>({
  id: "shared-component-button",
  heading: { title: "按钮", description: "在表单列表中使用 FnButton 触发操作反馈。" },
  actionbar: {
    buttons: {
      add: { text: "新增", show: false },
      notice: { text: "显示消息", click: () => message.success("按钮操作已触发") },
    },
  },
  rowHandle: { width: 150 },
  columns: {
    name: { key: "name", title: "按钮名称", type: "text", cell: { width: 180 }, form: { value: "按钮示例" } },
    buttonText: { key: "buttonText", title: "普通按钮", type: "text", cell: { width: 130, component: { name: markRaw(FnButton), vModel: "text", type: "primary", click: () => message.success("cell 按钮已点击") } }, form: { value: "查看" } },
    linkText: { key: "linkText", title: "Link 模式", type: "text", cell: { width: 130, component: { name: markRaw(FnButton), vModel: "text", type: "link", click: () => message.success("link 按钮已点击") } }, form: { value: "打开链接" } },
  },
  request,
  search: { columns: { name: { component: { placeholder: "请输入按钮名称" } }, buttonText: { component: { placeholder: "请输入按钮文案" } } } },
});
useFnCrud({ state });
</script>
<template>
  <div class="crud-page showcase-page">
    <FnCrud v-bind="state" />
  </div>
</template>
