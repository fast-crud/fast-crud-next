<script setup lang="tsx">
import { reactive } from "vue";
import { DictStore, FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { request, type ComponentDemoRow } from "../shared/api";

const tagsDict = new DictStore({ data: [{ value: "基础", label: "基础" }, { value: "需要复核", label: "需要复核" }, { value: "高优先级", label: "高优先级" }] });
const permissionDict = new DictStore({ data: [{ value: "读取", label: "读取" }, { value: "编辑", label: "编辑" }, { value: "发布", label: "发布", disabled: true }] });
const state = reactive<FnCrudState<ComponentDemoRow>>({
  id: "shared-component-checkbox",
  heading: { title: "复选组", description: "在新增或编辑表单中使用字典复选组。" },
  rowHandle: { width: 150 },
  columns: {
    name: { key: "name", title: "名称", type: "text", cell: { width: 180 }, form: { value: "复选示例" } },
    tags: { key: "tags", title: "标签多选", type: "dict-checkbox", dict: tagsDict, cell: { width: 240 }, form: { value: [] } },
    scopeMultiple: { key: "scopeMultiple", title: "权限多选", type: "dict-checkbox", dict: permissionDict, cell: { width: 220 }, form: { value: [] } },
  },
  request,
  search: { columns: { name: { component: { placeholder: "请输入名称" } }, tags: { component: { placeholder: "请选择标签" } }, scopeMultiple: { component: { placeholder: "请选择权限" } } } },
});
useFnCrud({ state });
</script>
<template><div class="crud-page showcase-page"><FnCrud v-bind="state" /></div></template>
