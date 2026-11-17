<script setup lang="ts">
import { markRaw, reactive, ref } from "vue";
import { FnCrud, FnInput, type FnCrudExpose, type FnCrudState, type FnTablePageQuery, type FnTablePageResult, useFnCrud } from "@fast-crud/fast-crud-next";

interface ChangeRequest { id: number; title: string; requester: string; environment: string; status: string; createdAt: string }
const records = ref<ChangeRequest[]>([
  { id: 7301, title: "生产证书续期", requester: "平台组", environment: "生产", status: "待发布", createdAt: "2026-11-16 10:42" },
  { id: 7294, title: "边缘节点配置同步", requester: "基础设施", environment: "预发布", status: "待发布", createdAt: "2026-11-16 09:18" },
  { id: 7286, title: "域名检查规则更新", requester: "平台组", environment: "测试", status: "待发布", createdAt: "2026-11-15 17:36" },
  { id: 7260, title: "旧凭证停用", requester: "安全组", environment: "生产", status: "待发布", createdAt: "2026-11-15 14:05" },
  { id: 7218, title: "站点探测频率调整", requester: "运维组", environment: "生产", status: "待发布", createdAt: "2026-11-14 11:27" },
  { id: 7199, title: "DNS 记录校验", requester: "基础设施", environment: "预发布", status: "待发布", createdAt: "2026-11-13 16:50" },
]);
const selectedKeys = ref<Array<string | number>>([]);
const crud = ref<FnCrudExpose<ChangeRequest>>();
const state = reactive({
  id: "shared-selection-change-requests",
  heading: { title: "变更审批队列", description: "跨页保留选择，批量发布所选变更。" },
  rowSelect: { crossPage: true, onChange: (keys: Array<string | number>) => { selectedKeys.value = keys; } },
  columns: {
    id: { key: "id", title: "变更单", cell: { width: 90 } },
    title: { key: "title", title: "变更内容", search: { component: { name: markRaw(FnInput) as any, vModel: "modelValue", placeholder: "搜索变更内容" }, width: 230 }, form: { rules: [{ required: true, message: "请输入变更内容" }] }, cell: { order: 1 } },
    requester: { key: "requester", title: "申请团队", form: { rules: [{ required: true, message: "请输入申请团队" }] }, cell: { order: 2, width: 120 } },
    environment: { key: "environment", title: "环境", form: { value: "测试" }, cell: { order: 3, width: 100 } },
    status: { key: "status", title: "状态", form: { value: "待发布" }, cell: { order: 4, width: 100 } },
    createdAt: { key: "createdAt", title: "提交时间", cell: { order: 5, width: 170 } },
  },
  table: { rowKey: "id", minWidth: 820 },
  rowHandle: { width: 140 },
  pagination: { pageSize: 5, pageSizeOptions: ["5", "10"] },
  request: {
    pageRequest: async ({ page, query }: FnTablePageQuery): Promise<FnTablePageResult<ChangeRequest>> => { const keyword = String(query.title || "").trim().toLocaleLowerCase(); const filtered = records.value.filter(row => !keyword || `${row.title} ${row.requester}`.toLocaleLowerCase().includes(keyword)); return { records: filtered.slice(page.offset, page.offset + page.limit), total: filtered.length }; },
    addRequest: async (form: Record<string, any>) => { records.value.unshift({ id: Math.max(...records.value.map(row => row.id), 7100) + 1, title: String(form.title), requester: String(form.requester), environment: String(form.environment || "测试"), status: "待发布", createdAt: now() }); },
    editRequest: async (form: Record<string, any>) => { const id = Number(form.id); records.value = records.value.map(row => row.id === id ? { ...row, title: String(form.title), requester: String(form.requester), environment: String(form.environment), status: String(form.status) } : row); },
    delRequest: async (id: string | number) => { records.value = records.value.filter(row => row.id !== Number(id)); },
  },
}) as unknown as FnCrudState<ChangeRequest>;
useFnCrud(state);
function publishSelected(): void { const ids = new Set(selectedKeys.value.map(String)); records.value = records.value.map(row => ids.has(String(row.id)) ? { ...row, status: "已发布" } : row); selectedKeys.value = []; crud.value?.table.clearSelection(); void crud.value?.table.refresh(); }
function now(): string { return new Intl.DateTimeFormat("zh-CN", { dateStyle: "short", timeStyle: "short", hour12: false }).format(new Date()); }
</script>

<template>
  <div class="showcase-page"><header class="showcase-actions"><span>已选 {{ selectedKeys.length }} 条</span><button type="button" :disabled="!selectedKeys.length" @click="publishSelected">批量发布</button></header><section class="showcase-panel"><FnCrud ref="crud" v-bind="state" /></section></div>
</template>

<style scoped>
.showcase-page{display:flex;flex:1;min-height:0;flex-direction:column}.showcase-actions{display:flex;align-items:center;justify-content:flex-end;gap:12px;padding:8px 16px;color:#667085;font-size:13px}.showcase-actions button{min-height:34px;padding:0 13px;border:1px solid var(--fn-color-primary,#315efb);border-radius:5px;color:#fff;background:var(--fn-color-primary,#315efb);font:inherit;cursor:pointer}.showcase-actions button:disabled{border-color:var(--fn-color-border,#d0d5dd);color:var(--fn-color-text-quaternary,#98a2b3);background:var(--fn-color-fill-secondary,#f2f4f7);cursor:not-allowed}.showcase-panel{flex:1;min-height:0;overflow:hidden;border:1px solid var(--fn-color-border,#e1e7ef);border-radius:0;background:var(--fn-color-bg-container,#fff)}@media(max-width:600px){.showcase-actions{justify-content:space-between}}
</style>
