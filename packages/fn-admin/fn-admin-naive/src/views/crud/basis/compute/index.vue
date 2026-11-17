<script setup lang="ts">
import { markRaw, reactive } from "vue";
import { NInput, NSelect } from "naive-ui";
import { FnCrud, FnInput, compute, type FnCrudState, type FnTablePageQuery, type FnTablePageResult, useFnCrud } from "../../../../fn-crud/src/crud";
interface RuleRecord { id: number; name: string; scope: string; mode: string; threshold: number; enabled: boolean; }
const records = reactive<RuleRecord[]>([{ id: 1, name: "生产证书临期提醒", scope: "生产", mode: "邮件", threshold: 14, enabled: true }, { id: 2, name: "预发布域名巡检", scope: "预发布", mode: "Webhook", threshold: 30, enabled: true }, { id: 3, name: "测试环境清理", scope: "测试", mode: "站内信", threshold: 7, enabled: false }]);
const scopeOptions = [{ label: "生产", value: "生产" }, { label: "预发布", value: "预发布" }, { label: "测试", value: "测试" }];
const state = reactive<FnCrudState<RuleRecord>>({ id: "naive-compute-rules", heading: { title: "动态通知规则", description: "字段与单元格展示会根据当前规则动态计算。" }, table: { rowKey: "id", minWidth: 760 }, pagination: { pageSize: 5 }, rowHandle: { width: 148 }, columns: {
  id: { key: "id", title: "编号", cell: { width: 76 } },
  name: { key: "name", title: "规则名称", search: compute(() => ({ component: { name: markRaw(FnInput) as any, vModel: "modelValue", placeholder: "输入规则名称" }, width: 220 })), form: { rules: [{ required: true, message: "请输入规则名称" }] }, cell: { order: 1 } },
  scope: { key: "scope", title: "作用域", form: { component: { name: markRaw(NSelect) as any, vModel: "value", options: scopeOptions }, value: "生产" }, cell: { width: 110 } },
  mode: { key: "mode", title: "通知方式", form: compute(({ form }) => ({ component: { name: markRaw(NSelect) as any, vModel: "value", options: form?.scope === "生产" ? [{ label: "邮件", value: "邮件" }, { label: "Webhook", value: "Webhook" }] : [{ label: "站内信", value: "站内信" }, { label: "Webhook", value: "Webhook" }] } })), cell: compute(({ row }) => ({ render: () => `${row?.mode || "—"} · ${row?.scope === "生产" ? "高优先级" : "标准"}` })) },
  threshold: { key: "threshold", title: "阈值（天）", form: compute(({ form }) => ({ show: form?.scope !== "测试", component: { name: markRaw(NInput) as any, vModel: "value", type: "number" } })), cell: { width: 110 } },
  enabled: { key: "enabled", title: "状态", form: { component: { name: markRaw(NSelect) as any, vModel: "value", options: [{ label: "启用", value: true }, { label: "停用", value: false }] }, value: true }, cell: compute(({ row }) => ({ render: () => row?.enabled ? "启用" : "停用" })) },
}, request: {
  pageRequest: async ({ page, query }: FnTablePageQuery): Promise<FnTablePageResult<RuleRecord>> => { const term = String(query.name || "").toLowerCase(); const filtered = records.filter(item => !term || item.name.toLowerCase().includes(term)); return { records: filtered.slice(page.offset, page.offset + page.limit), total: filtered.length }; },
  addRequest: async form => { records.unshift({ id: Math.max(...records.map(item => item.id), 0) + 1, name: String(form.name), scope: String(form.scope || "生产"), mode: String(form.mode || "邮件"), threshold: Number(form.threshold || 14), enabled: form.enabled !== false }); },
  editRequest: async form => { const item = records.find(row => row.id === Number(form.id)); if (item) Object.assign(item, { ...form, threshold: Number(form.threshold) }); },
  delRequest: async id => { const index = records.findIndex(row => row.id === Number(id)); if (index >= 0) records.splice(index, 1); },
}});
useFnCrud(state as any);
const crudState = state as any;
</script>
<template><section class="crud-panel"><FnCrud v-bind="crudState" /></section></template>
<style scoped>.crud-panel{flex:1;min-height:0;border:1px solid var(--fn-color-border,#e0e6ef);border-radius:0;background:var(--fn-color-bg-container,#fff);overflow:hidden}</style>
