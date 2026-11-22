<script setup lang="ts">
import { computed, markRaw, reactive, ref } from "vue";
import { FnButtonBase, FnCrud, FnInput, type FnCrudExpose, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { api, type ChangeRequest } from "./api";
const crud = ref<FnCrudExpose<ChangeRequest>>();
const showRowSelection = ref(true);
const state = reactive({
  id: "shared-selection-change-requests",
  heading: { title: "跨页选择示例", description: "在两页各勾选一条记录，确认选中数累加，再点击「批量发布」或从「批量操作」中选择「批量删除」。" },
  rowSelect: { show: showRowSelection, crossPage: true, selectedRowKeys: [] },
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
    batchDelRequest: api.batchDelRequest,
  },
}) as unknown as FnCrudState<ChangeRequest>;
useFnCrud({ state, crudRef: crud });
const selectedKeys = computed(() => state.rowSelect?.selectedRowKeys || []);
async function publishSelected(): Promise<void> { await api.publish(selectedKeys.value); state.rowSelect!.selectedRowKeys = []; await crud.value?.table.refresh(); }
</script>

<template>
  <div class="crud-page showcase-page">
      <FnCrud ref="crud" v-bind="state">
        <template #actionRight="{ selectedRowKeys }">
          <FnButtonBase type="default" :text="showRowSelection ? '隐藏选择列' : '显示选择列'" @click="showRowSelection = !showRowSelection" />
          <span>已选 {{ selectedRowKeys.length }} 条</span>
          <FnButtonBase type="default" text="批量发布" :disabled="!selectedRowKeys.length" @click="publishSelected" />
        </template>
      </FnCrud>
  </div>
</template>
