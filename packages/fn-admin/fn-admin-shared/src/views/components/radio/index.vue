<script setup lang="tsx">
import { reactive } from "vue";
import { DictStore, FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { request, type ComponentDemoRow } from "../shared/api";

const scopeDict = new DictStore({ data: [{ value: "测试", label: "测试" }, { value: "预发布", label: "预发布" }, { value: "生产", label: "生产" }] });
const boolDict = new DictStore({ data: [{ value: true, label: "是" }, { value: false, label: "否" }] });
const limitedScopeDict = new DictStore({ data: [{ value: "测试", label: "测试", disabled: true }, { value: "预发布", label: "预发布" }, { value: "生产", label: "生产" }] });
const state = reactive<FnCrudState<ComponentDemoRow>>({
  id: "shared-component-radio",
  heading: { title: "单选组", description: "在新增或编辑表单中使用字典单选组。" },
  rowHandle: { width: 150 },
  columns: {
    name: { key: "name", title: "名称", type: "text", cell: { width: 180 }, form: { value: "单选示例" } },
    scope: { key: "scope", title: "环境单选", type: "dict-radio", dict: scopeDict, cell: { width: 220 }, form: { value: "测试" } },
    enabled: { key: "enabled", title: "布尔单选", type: "dict-radio", dict: boolDict, cell: { width: 140 }, form: { value: true } },
    scopeDisabled: { key: "scopeDisabled", title: "禁用选项", type: "dict-radio", dict: limitedScopeDict, cell: { width: 220 }, form: { value: "预发布" } },
  },
  request,
  search: { columns: { name: { component: { placeholder: "请输入名称" } }, scope: { component: { placeholder: "请选择环境" } }, enabled: { component: { placeholder: "请选择是否启用" } } } },
});
useFnCrud({ state });
</script>
<template><div class="crud-page showcase-page"><FnCrud v-bind="state" /></div></template>
