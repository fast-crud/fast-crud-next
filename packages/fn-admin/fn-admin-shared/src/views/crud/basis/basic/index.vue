<script setup lang="tsx">
import { markRaw, reactive } from "vue";
import { FnButton, FnCrud, FnInput, isFnComputeValue, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { api, type ServiceRecord } from "./api";
const crudState = reactive<FnCrudState<ServiceRecord>>({
  id: "shared-basic-services", heading: { title: "基础列表示例", description: "通过服务数据演示搜索、分页、增删改查和列设置。" }, table: { rowKey: "id", minWidth: 820 }, rowHandle: { width: 150 }, rowSelect: { crossPage: true },
  columns: {
    id: { key: "id", title: "编号", cell: { width: 80 } },
    name: { key: "name", title: "服务名称", search: { component: { name: markRaw(FnInput) as any, vModel: "modelValue", placeholder: "搜索服务名称" } }, form: { rules: [{ required: true, message: "请输入服务名称" }] }, cell: { order: 1 } },
    owner: { key: "owner", title: "负责人", form: { rules: [{ required: true, message: "请输入负责人" }] }, cell: { order: 2, width: 120 } },
    environment: { key: "environment", title: "环境", form: { value: "测试" }, cell: { order: 3, width: 100, setting: { show: false } } },
    status: { key: "status", title: "状态", form: { value: "待发布" }, cell: { order: 4, width: 100, setting: { disabled: true } } },
    updatedAt: { key: "updatedAt", title: "最近更新", cell: { order: 5, width: 170 } },
  },
  slots: {
    bodyBottom: () => (
      <div class="column-setting-examples">
        <FnButton type="default" text="切换环境列设置显隐" click={toggleEnvironmentSetting} />
        <FnButton type="default" text="切换状态列设置禁用" click={toggleStatusSetting} />
      </div>
    ),
  },
  request: {
    ...api,
  },
}) as unknown as FnCrudState<ServiceRecord>;
useFnCrud({ state: crudState });
function toggleEnvironmentSetting(): void {
  const cell = crudState.columns.environment.cell;
  if (!cell || isFnComputeValue(cell)) return;
  cell.setting ??= {};
  cell.setting.show = cell.setting.show === false;
}
function toggleStatusSetting(): void {
  const cell = crudState.columns.status.cell;
  if (!cell || isFnComputeValue(cell)) return;
  cell.setting ??= {};
  cell.setting.disabled = cell.setting.disabled !== true;
}
</script>
<template>
  <div class="view-stack">
    <section class="panel">
      <FnCrud v-bind="crudState" />
    </section>
  </div>
</template>

<style lang="less">
.view-stack {
  .column-setting-examples {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
