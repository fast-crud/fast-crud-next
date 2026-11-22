<script setup lang="ts">
import { markRaw, reactive } from "vue";
import { FnCrud, FnInput, compute, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import DemoSelect from "@fast-crud/fn-admin-shared/components/DemoSelect.vue";
import { api, type Rotation } from "./api";
const state = reactive({
  id: "shared-conditional-form-rotation",
  heading: { title: "条件表单示例", description: "打开任意行的「编辑」，切换轮换方式，观察宽限天数字段的显隐。" },
  columns: {
    id: { key: "id", title: "编号", cell: { width: 78 } },
    name: { key: "name", title: "策略名称", search: { component: { name: markRaw(FnInput) as any, vModel: "modelValue", placeholder: "搜索策略名称" }, width: 220 }, form: { rules: [{ required: true, message: "请输入策略名称" }] }, cell: { order: 1 } },
    owner: { key: "owner", title: "负责人", form: { rules: [{ required: true, message: "请输入负责人" }] }, cell: { order: 2, width: 110 } },
    strategy: { key: "strategy", title: "轮换方式", form: { value: "自动轮换", component: { name: markRaw(DemoSelect) as any, vModel: "modelValue", options: [{ label: "自动轮换", value: "自动轮换" }, { label: "人工审批", value: "人工审批" }] }, rules: [{ required: true, message: "请选择轮换方式" }] }, cell: { order: 3, width: 110 } },
    graceDays: { key: "graceDays", title: "宽限天数", form: { show: compute(({ form }) => form?.strategy !== "人工审批"), value: 14, component: { name: markRaw(FnInput) as any, vModel: "modelValue", type: "number", min: 1 } }, cell: { order: 4, width: 100 } },
    target: { key: "target", title: "目标系统", form: { rules: [{ required: true, message: "请输入目标系统" }] }, cell: { order: 5 } },
    status: { key: "status", title: "状态", form: { value: "待启用" }, cell: { order: 6, width: 100 } },
  },
  table: { rowKey: "id", minWidth: 800 },
  rowHandle: { width: 140 },
  request: {
    ...api,
  },
}) as unknown as FnCrudState<Rotation>;
useFnCrud({ state });
</script>

<template>
  <div class="crud-page showcase-page"><FnCrud v-bind="state" /></div>
</template>

<style lang="less">
.showcase-page {
}
</style>
