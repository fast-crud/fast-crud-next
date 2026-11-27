<script setup lang="tsx">
import { markRaw, reactive } from "vue";
import { FnCrud, FnInput, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { request, type ComponentDemoRow } from "../shared/api";

const state = reactive<FnCrudState<ComponentDemoRow>>({
  id: "shared-component-text",
  heading: { title: "文本输入", description: "在新增或编辑表单中使用文本输入组件。" },
  rowHandle: { width: 150 },
  columns: {
    name: { key: "name", title: "普通文本", type: "text", cell: { width: 180 }, form: { rules: [{ required: true, message: "请输入名称" }] } },
    numberText: { key: "numberText", title: "数字输入", type: "text", cell: { width: 140 }, form: { component: { name: markRaw(FnInput), type: "number" }, value: 10 } },
    longText: { key: "longText", title: "多行文本", type: "textarea", cell: { width: 260, ellipsis: true, tooltip: true }, form: { component: { name: markRaw(FnInput), multiline: true }, value: "请输入多行内容" } },
  },
  request,
  search: { columns: { name: { component: { placeholder: "搜索普通文本" } }, numberText: { component: { placeholder: "搜索数字输入" } } } },
});
useFnCrud({ state });
</script>
<template><div class="crud-page showcase-page"><FnCrud v-bind="state" /></div></template>
