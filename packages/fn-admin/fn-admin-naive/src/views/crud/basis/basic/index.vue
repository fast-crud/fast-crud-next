<script setup lang="ts">
import { markRaw, reactive } from "vue";
import { NSelect } from "naive-ui";
import { FnCrud, FnInput, type FnCrudState, type FnTablePageQuery, type FnTablePageResult, useFnCrud } from "../../../../../../../fn-crud/src/crud";
interface ServiceRecord { id: number; name: string; owner: string; environment: string; status: string; updatedAt: string; }
const records = reactive<ServiceRecord[]>([
  { id: 1042, name: "证书自动续期", owner: "平台组", environment: "生产", status: "运行中", updatedAt: "2026-11-16 10:42" },
  { id: 1038, name: "边缘节点同步", owner: "基础设施", environment: "生产", status: "运行中", updatedAt: "2026-11-16 09:18" },
  { id: 1029, name: "域名健康检查", owner: "平台组", environment: "预发布", status: "待发布", updatedAt: "2026-11-15 17:36" },
  { id: 1017, name: "旧证书清理", owner: "安全组", environment: "生产", status: "已暂停", updatedAt: "2026-11-15 14:05" },
  { id: 1004, name: "站点可用性巡检", owner: "运维组", environment: "测试", status: "运行中", updatedAt: "2026-11-14 11:27" },
]);
const selectOptions = [{ label: "生产", value: "生产" }, { label: "预发布", value: "预发布" }, { label: "测试", value: "测试" }];
const statusOptions = [{ label: "运行中", value: "运行中" }, { label: "待发布", value: "待发布" }, { label: "已暂停", value: "已暂停" }];
const state = reactive<FnCrudState<ServiceRecord>>({ id: "naive-basic-services", heading: { title: "服务目录", description: "支持搜索、分页、新增、编辑和删除。" }, rowSelect: { crossPage: true }, table: { rowKey: "id", minWidth: 760 }, pagination: { pageSize: 5 }, rowHandle: { width: 148 }, columns: {
  id: { key: "id", title: "编号", cell: { width: 90 } },
  name: { key: "name", title: "服务名称", search: { component: { name: markRaw(FnInput) as any, vModel: "modelValue", placeholder: "搜索名称或负责人" }, width: 220 }, form: { rules: [{ required: true, message: "请输入服务名称" }] }, cell: { order: 1 } },
  owner: { key: "owner", title: "负责人", form: { rules: [{ required: true, message: "请输入负责人" }] }, cell: { width: 120 } },
  environment: { key: "environment", title: "环境", form: { component: { name: markRaw(NSelect) as any, vModel: "value", options: selectOptions }, value: "测试" }, cell: { width: 110 } },
  status: { key: "status", title: "状态", form: { component: { name: markRaw(NSelect) as any, vModel: "value", options: statusOptions }, value: "待发布" }, cell: { width: 110 } },
  updatedAt: { key: "updatedAt", title: "最近更新", cell: { width: 170 } },
}, request: {
  pageRequest: async ({ page, query }: FnTablePageQuery): Promise<FnTablePageResult<ServiceRecord>> => { const term = String(query.name || "").toLowerCase(); const filtered = records.filter(item => !term || `${item.name}${item.owner}`.toLowerCase().includes(term)); return { records: filtered.slice(page.offset, page.offset + page.limit), total: filtered.length }; },
  addRequest: async form => { records.unshift({ id: Math.max(...records.map(item => item.id), 0) + 1, name: String(form.name), owner: String(form.owner), environment: String(form.environment || "测试"), status: String(form.status || "待发布"), updatedAt: new Date().toISOString().slice(0, 16).replace("T", " ") }); },
  editRequest: async form => { const item = records.find(row => row.id === Number(form.id)); if (item) Object.assign(item, form); },
  delRequest: async id => { const index = records.findIndex(row => row.id === Number(id)); if (index >= 0) records.splice(index, 1); },
}});
useFnCrud(state as any);
const crudState = state as any;
</script>
<template><section class="crud-panel"><FnCrud v-bind="crudState" /></section></template>
<style scoped>.crud-panel{flex:1;min-height:0;border:1px solid #e0e6ef;border-radius:0;background:#fff;overflow:hidden}</style>
