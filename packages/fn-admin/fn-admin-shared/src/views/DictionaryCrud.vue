<script setup lang="ts">
import { h, markRaw, reactive, ref } from "vue";
import type { Component } from "vue";
import { FnCrud, FnInput, DictStore, type FnCrudState, type FnTablePageQuery, type FnTablePageResult, type FnTableRowContext, useFnCrud } from "@fast-crud/fn-crud/crud";
import DemoSelect from "../components/DemoSelect.vue";

interface Credential { id: number; name: string; owner: string; scope: string; status: string; expiresAt: string }
const props = defineProps<{ tagComponent?: Component }>();
const records = ref<Credential[]>([
  { id: 4102, name: "生产证书轮换", owner: "平台组", scope: "生产", status: "active", expiresAt: "2026-12-18" },
  { id: 4096, name: "边缘节点 API", owner: "基础设施", scope: "生产", status: "active", expiresAt: "2027-02-03" },
  { id: 4081, name: "预发布域名校验", owner: "平台组", scope: "预发布", status: "review", expiresAt: "2026-11-29" },
  { id: 4054, name: "旧系统同步", owner: "安全组", scope: "测试", status: "disabled", expiresAt: "2026-10-30" },
  { id: 4027, name: "站点可用性巡检", owner: "运维组", scope: "生产", status: "active", expiresAt: "2027-01-15" },
  { id: 4018, name: "测试环境 DNS 校验", owner: "基础设施", scope: "测试", status: "review", expiresAt: "2026-12-05" },
  { id: 3996, name: "归档系统凭证", owner: "安全组", scope: "预发布", status: "disabled", expiresAt: "2026-10-12" },
  { id: 3988, name: "应用网关证书", owner: "平台组", scope: "生产", status: "active", expiresAt: "2027-03-22" },
]);
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
      if (props.tagComponent) {
        return h(props.tagComponent, { type: option?.color || "default", size: "small", bordered: false }, { default: () => label });
      }
      return h("span", { class: ["status-label", `status-label--${option?.color || "default"}`] }, label);
    } } },
    expiresAt: { key: "expiresAt", title: "到期日期", form: { rules: [{ required: true, message: "请输入到期日期" }] }, cell: { order: 5, width: 130 } },
  },
  table: { rowKey: "id", minWidth: 800 },
  rowHandle: { width: 140 },
  pagination: { pageSize: 5, pageSizeOptions: ["5", "10", "20"] },
  request: {
    pageRequest: async ({ page, query }: FnTablePageQuery): Promise<FnTablePageResult<Credential>> => {
      const keyword = String(query.name || "").trim().toLocaleLowerCase();
      const filtered = records.value.filter(row => (!keyword || `${row.name} ${row.owner}`.toLocaleLowerCase().includes(keyword)) && (!query.status || row.status === query.status));
      return { records: filtered.slice(page.offset, page.offset + page.limit), total: filtered.length, tabsCounts: Object.fromEntries(statusDict.__options.value.map(option => [option.value, records.value.filter(row => row.status === option.value).length])) };
    },
    addRequest: async (form: Record<string, any>) => { records.value.unshift({ id: Math.max(...records.value.map(row => row.id), 4000) + 1, name: String(form.name), owner: String(form.owner), scope: String(form.scope || "测试"), status: String(form.status || "review"), expiresAt: String(form.expiresAt || "2027-01-01") }); },
    editRequest: async (form: Record<string, any>) => { const id = Number(form.id); records.value = records.value.map(row => row.id === id ? { ...row, name: String(form.name), owner: String(form.owner), scope: String(form.scope), status: String(form.status), expiresAt: String(form.expiresAt) } : row); },
    delRequest: async (id: string | number) => { records.value = records.value.filter(row => row.id !== Number(id)); },
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
