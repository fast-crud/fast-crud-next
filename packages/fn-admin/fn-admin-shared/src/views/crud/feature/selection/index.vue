<script setup lang="ts">
import { computed, markRaw, reactive, ref } from "vue";
import { FnCrud, FnInput, type FnCrudExpose, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { api, type ChangeRequest } from "./api";
const crud = ref<FnCrudExpose<ChangeRequest>>();
const state = reactive({
  id: "shared-selection-change-requests",
  heading: { title: "跨页选择示例", description: "跨页保留已选变更，并对所选记录执行批量发布。" },
  rowSelect: { crossPage: true, selectedRowKeys: [] },
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
  request: {
    pageRequest: api.pageRequest,
    addRequest: api.addRequest,
    editRequest: api.editRequest,
    delRequest: api.delRequest,
  },
}) as unknown as FnCrudState<ChangeRequest>;
useFnCrud({ state, crudRef: crud });
const selectedKeys = computed(() => state.rowSelect?.selectedRowKeys || []);
async function publishSelected(): Promise<void> { await api.publish(selectedKeys.value); state.rowSelect!.selectedRowKeys = []; await crud.value?.table.refresh(); }
</script>

<template>
  <div class="crud-page showcase-page"><header class="showcase-actions"><span>已选 {{ selectedKeys.length }} 条</span><button type="button" :disabled="!selectedKeys.length" @click="publishSelected">批量发布</button></header><section class="showcase-panel"><FnCrud ref="crud" v-bind="state" /></section></div>
</template>

<style lang="less">
.showcase-page {
 
}
</style>
