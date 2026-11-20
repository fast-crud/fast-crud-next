<script setup lang="ts">
import { markRaw, reactive, ref } from "vue";
import { FnCrud, FnInput, compute, type FnCrudState, type FnTablePageQuery, type FnTablePageResult, useFnCrud } from "@fast-crud/fast-crud-next";
import DemoSelect from "../components/DemoSelect.vue";

interface Rotation { id: number; name: string; owner: string; strategy: string; graceDays: number; target: string; status: string }
const records = ref<Rotation[]>([
  { id: 810, name: "生产证书轮换", owner: "平台组", strategy: "自动轮换", graceDays: 14, target: "证书服务", status: "已启用" },
  { id: 804, name: "边缘节点密钥", owner: "基础设施", strategy: "人工审批", graceDays: 7, target: "节点网关", status: "已启用" },
  { id: 792, name: "预发布签名密钥", owner: "安全组", strategy: "自动轮换", graceDays: 30, target: "发布流水线", status: "待启用" },
  { id: 788, name: "支付网关密钥", owner: "平台组", strategy: "人工审批", graceDays: 7, target: "支付服务", status: "已启用" },
  { id: 781, name: "测试域名证书", owner: "运维组", strategy: "自动轮换", graceDays: 14, target: "域名平台", status: "已启用" },
  { id: 775, name: "边缘签名凭证", owner: "基础设施", strategy: "人工审批", graceDays: 3, target: "边缘节点", status: "待启用" },
  { id: 768, name: "内部服务凭证", owner: "安全组", strategy: "自动轮换", graceDays: 21, target: "身份服务", status: "已启用" },
]);
const state = reactive({
  id: "shared-conditional-form-rotation",
  heading: { title: "密钥轮换策略", description: "表单字段与当前轮换策略联动。" },
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
  pagination: { pageSize: 5, pageSizeOptions: ["5", "10"] },
  request: {
    pageRequest: async ({ page, query }: FnTablePageQuery): Promise<FnTablePageResult<Rotation>> => { const keyword = String(query.name || "").trim().toLocaleLowerCase(); const filtered = records.value.filter(row => !keyword || `${row.name} ${row.owner}`.toLocaleLowerCase().includes(keyword)); return { records: filtered.slice(page.offset, page.offset + page.limit), total: filtered.length }; },
    addRequest: async (form: Record<string, any>) => { records.value.unshift({ id: Math.max(...records.value.map(row => row.id), 760) + 1, name: String(form.name), owner: String(form.owner), strategy: String(form.strategy || "自动轮换"), graceDays: Number(form.graceDays || 14), target: String(form.target), status: String(form.status || "待启用") }); },
    editRequest: async (form: Record<string, any>) => { const id = Number(form.id); records.value = records.value.map(row => row.id === id ? { ...row, name: String(form.name), owner: String(form.owner), strategy: String(form.strategy), graceDays: Number(form.graceDays || 0), target: String(form.target), status: String(form.status) } : row); },
    delRequest: async (id: string | number) => { records.value = records.value.filter(row => row.id !== Number(id)); },
  },
}) as unknown as FnCrudState<Rotation>;
useFnCrud({ state });
</script>

<template>
  <div class="showcase-page"><section class="showcase-panel"><FnCrud v-bind="state" /></section></div>
</template>

<style lang="less">
.showcase-page {
  display: flex;
  flex: 1;
  min-height: 0;

  .showcase-panel {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    border: 1px solid var(--fn-color-border, #e1e7ef);
    border-radius: 0;
    background: var(--fn-color-bg-container, #fff);
  }
}
</style>
