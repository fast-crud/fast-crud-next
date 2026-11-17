<script setup lang="ts">
import { h, markRaw, reactive } from "vue";
import { Tag } from "ant-design-vue";
import { FnCrud, FnInput, DictStore, type FnCrudState, type FnTableRowContext, useFnCrud } from "@fast-crud/fast-crud-next";
import DemoSelect from "@fast-crud/fn-admin-shared/components/DemoSelect.vue";
import { api, type Credential } from "./api";
const statusDict = markRaw(new DictStore({ data: [
  { label: "生效中", value: "active", color: "success" },
  { label: "待审核", value: "review", color: "warning" },
  { label: "已停用", value: "disabled", color: "default" },
] }));
const scopeDict = markRaw(new DictStore({ data: [
  { label: "生产", value: "生产" }, { label: "预发布", value: "预发布" }, { label: "测试", value: "测试" },
] }));
const state = reactive({
  id: "shared-dictionary-credentials",
  heading: { title: "凭证目录", description: "字典值驱动状态显示与快速筛选。" },
  tabs: { refCol: "status" },
  columns: {
    id: { key: "id", title: "编号", cell: { width: 84 } },
    name: { key: "name", title: "凭证名称", search: { component: { name: markRaw(FnInput) as any, vModel: "modelValue", placeholder: "搜索名称或负责人" }, width: 230 }, form: { rules: [{ required: true, message: "请输入凭证名称" }] }, cell: { order: 1 } },
    owner: { key: "owner", title: "负责人", form: { rules: [{ required: true, message: "请输入负责人" }] }, cell: { order: 2, width: 120 } },
    scope: { key: "scope", title: "环境", form: { value: "测试", component: { name: markRaw(DemoSelect) as any, vModel: "modelValue", options: scopeDict.__options.value } }, cell: { order: 3, width: 100, dict: scopeDict, render: ({ row }: FnTableRowContext<Credential>) => scopeDict.__options.value.find(option => option.value === row.scope)?.label || "—" } },
    status: { key: "status", title: "状态", form: { value: "review", component: { name: markRaw(DemoSelect) as any, vModel: "modelValue", options: statusDict.__options.value } }, cell: { order: 4, width: 100, dict: statusDict, render: ({ row }: FnTableRowContext<Credential>) => {
      const option = statusDict.__options.value.find(item => item.value === row.status);
      const label = option?.label || "—";
      return h(Tag, { color: option?.color }, { default: () => label });
    } } },
    expiresAt: { key: "expiresAt", title: "到期日期", form: { rules: [{ required: true, message: "请输入到期日期" }] }, cell: { order: 5, width: 130 } },
  },
  table: { rowKey: "id", minWidth: 800 },
  rowHandle: { width: 140 },
  pagination: { pageSize: 5, pageSizeOptions: ["5", "10", "20"] },
  request: {
    ...api,
  },
}) as unknown as FnCrudState<Credential>;
useFnCrud(state);
</script>

<template>
  <div class="showcase-page"><section class="showcase-panel"><FnCrud v-bind="state" /></section></div>
</template>

<style scoped>
.showcase-page{display:flex;flex:1;min-height:0;width:100%}.showcase-panel{flex:1;min-height:0;overflow:hidden;border:1px solid var(--fn-color-border,#e1e7ef);border-radius:0;background:var(--fn-color-bg-container,#fff)}.showcase-panel :deep(.status-label){display:inline-flex;min-height:22px;align-items:center;padding:0 8px;border-radius:4px;font-size:12px;line-height:1}.showcase-panel :deep(.status-label--success){color:#087443;background:#e7f6ee}.showcase-panel :deep(.status-label--warning){color:#9a6700;background:#fff4d6}.showcase-panel :deep(.status-label--default){color:#667085;background:#f2f4f7}
</style>
