<script setup lang="ts">
import { markRaw, reactive } from "vue";
import { FnCrud, FnInput, type FnCrudState, useFnCrud } from "../../../../../../../fn-crud/src/crud";
import { api, type ServiceRecord } from "./api";
const crudState = reactive<FnCrudState<ServiceRecord>>({
  id: "antdv-basic-services", heading: { title: "服务目录", description: "支持搜索、分页、新增、编辑和删除。" }, table: { rowKey: "id", minWidth: 820 }, rowHandle: { width: 150 }, rowSelect: { crossPage: true },
  columns: {
    id: { key: "id", title: "编号", cell: { width: 80 } },
    name: { key: "name", title: "服务名称", search: { component: { name: markRaw(FnInput) as any, vModel: "modelValue", placeholder: "搜索服务名称" } }, form: { rules: [{ required: true, message: "请输入服务名称" }] }, cell: { order: 1 } },
    owner: { key: "owner", title: "负责人", form: { rules: [{ required: true, message: "请输入负责人" }] }, cell: { order: 2, width: 120 } },
    environment: { key: "environment", title: "环境", form: { value: "测试" }, cell: { order: 3, width: 100, setting: { show: false } } },
    status: { key: "status", title: "状态", form: { value: "待发布" }, cell: { order: 4, width: 100, setting: { disabled: true } } },
    updatedAt: { key: "updatedAt", title: "最近更新", cell: { order: 5, width: 170 } },
  },
  pagination: { pageSize: 5, pageSizeOptions: ["5", "10", "20"] },
  request: {
    ...api,
  },
}) as unknown as FnCrudState<ServiceRecord>;
useFnCrud(crudState);
</script>
<template><div class="view-stack"><section class="panel"><FnCrud v-bind="crudState" /></section></div></template>
