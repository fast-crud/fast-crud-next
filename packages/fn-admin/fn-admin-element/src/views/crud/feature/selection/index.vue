<script setup lang="ts">
import { markRaw, reactive, ref } from "vue";
import { FnCrud, FnInput, type FnCrudExpose, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { api, type ChangeRequest } from "./api";
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
    pageRequest: api.pageRequest,
    addRequest: api.addRequest,
    editRequest: api.editRequest,
    delRequest: api.delRequest,
  },
}) as unknown as FnCrudState<ChangeRequest>;
useFnCrud(state);
async function publishSelected(): Promise<void> { await api.publish(selectedKeys.value); selectedKeys.value = []; crud.value?.table.clearSelection(); await crud.value?.table.refresh(); }
</script>

<template>
  <div class="showcase-page"><header class="showcase-actions"><span>已选 {{ selectedKeys.length }} 条</span><button type="button" :disabled="!selectedKeys.length" @click="publishSelected">批量发布</button></header><section class="showcase-panel"><FnCrud ref="crud" v-bind="state" /></section></div>
</template>

<style scoped>
.showcase-page{display:flex;flex:1;min-height:0;flex-direction:column}.showcase-actions{display:flex;align-items:center;justify-content:flex-end;gap:12px;padding:8px 16px;color:#667085;font-size:13px}.showcase-actions button{min-height:34px;padding:0 13px;border:1px solid var(--fn-color-primary,#315efb);border-radius:5px;color:#fff;background:var(--fn-color-primary,#315efb);font:inherit;cursor:pointer}.showcase-actions button:disabled{border-color:var(--fn-color-border,#d0d5dd);color:var(--fn-color-text-quaternary,#98a2b3);background:var(--fn-color-fill-secondary,#f2f4f7);cursor:not-allowed}.showcase-panel{flex:1;min-height:0;overflow:hidden;border:1px solid var(--fn-color-border,#e1e7ef);border-radius:0;background:var(--fn-color-bg-container,#fff)}@media(max-width:600px){.showcase-actions{justify-content:space-between}}
</style>
