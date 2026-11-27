<script setup lang="tsx">
import { markRaw, reactive } from "vue";
import { FnCrud, FnSwitch, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { request, type ComponentDemoRow } from "../shared/api";

const state = reactive<FnCrudState<ComponentDemoRow>>({
  id: "shared-component-switch",
  heading: { title: "开关", description: "在新增或编辑表单中使用 FnSwitch。" },
  rowHandle: { width: 150 },
  columns: {
    name: { key: "name", title: "名称", type: "text", cell: { width: 220 }, form: { value: "开关示例" } },
    enabled: { key: "enabled", title: "启用开关", cell: { width: 130, component: { name: markRaw(FnSwitch) } }, form: { value: true, component: { name: markRaw(FnSwitch) } } },
    switchValue: { key: "switchValue", title: "第二个开关", cell: { width: 130, component: { name: markRaw(FnSwitch) } }, form: { value: false, component: { name: markRaw(FnSwitch) } } },
  },
  request,
  search: { columns: { name: { component: { placeholder: "请输入名称" } }, enabled: { component: { placeholder: "筛选启用状态" } } } },
});
useFnCrud({ state });
</script>
<template><div class="crud-page showcase-page"><FnCrud v-bind="state" /></div></template>
