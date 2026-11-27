<script setup lang="tsx">
import { reactive } from "vue";
import { DictStore, FnCrud, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { request, type ComponentDemoRow } from "../shared/api";

const scopeDict = new DictStore({ data: [{ value: "测试", label: "测试" }, { value: "预发布", label: "预发布" }, { value: "生产", label: "生产" }] });
const disabledScopeDict = new DictStore({ data: [{ value: "测试", label: "测试", disabled: true }, { value: "预发布", label: "预发布" }, { value: "生产", label: "生产" }] });
const state = reactive<FnCrudState<ComponentDemoRow>>({
  id: "shared-component-select",
  heading: { title: "下拉选择", description: "在新增或编辑表单中使用字典下拉组件。" },
  rowHandle: { width: 150 },
  columns: {
    name: { key: "name", title: "单选下拉", type: "dict-select", dict: scopeDict, cell: { width: 140 }, form: { value: "测试" } },
    scopeMultiple: { key: "scopeMultiple", title: "多选下拉", type: "dict-select", dict: scopeDict, cell: { width: 220 }, form: { value: [], component: { multiple: true } } },
    scopeTags: { key: "scopeTags", title: "多选可清除", type: "dict-select", dict: scopeDict, cell: { width: 180 }, form: { value: [], component: { multiple: true, clearable: true } } },
    scopeDisabled: { key: "scopeDisabled", title: "禁用选项", type: "dict-select", dict: disabledScopeDict, cell: { width: 140 }, form: { value: "预发布" } },
  },
  request,
  search: { columns: { scope: { component: { placeholder: "请选择环境" } }, scopeMultiple: { component: { multiple: true, placeholder: "筛选多个环境" } } } },
});
useFnCrud({ state });
</script>
<template><div class="crud-page showcase-page"><FnCrud v-bind="state" /></div></template>
