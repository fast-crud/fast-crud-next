<script setup lang="ts">
import { markRaw, reactive, ref } from "vue";
import { FnCrud, FnInput, compute, type FnCrudState, useFnCrud } from "../../../../../../../fn-crud/src/crud";
import { api, type Order } from "./api";
const tier = ref("标准");
const crudState = reactive<FnCrudState<Order>>({
  id: "antdv-compute-orders", heading: { title: "套餐动态计价", description: "总价随数量、单价和计价层级动态更新。" }, table: { rowKey: "id", minWidth: 780 }, rowHandle: { width: 140 },
  columns: {
    id: { key: "id", title: "订单号", cell: { width: 85 } },
    product: { key: "product", title: "套餐", form: { rules: [{ required: true, message: "请输入套餐名称" }] }, cell: { order: 1 } },
    quantity: { key: "quantity", title: "数量", form: { value: 1, component: { name: markRaw(FnInput) as any, vModel: "modelValue", type: "number" } }, cell: { order: 2, width: 90 } },
    unitPrice: { key: "unitPrice", title: "单价", form: { value: 100, component: { name: markRaw(FnInput) as any, vModel: "modelValue", type: "number" } }, cell: { order: 3, width: 100 } },
    tier: { key: "tier", title: "计价层级", form: compute(() => ({ value: tier.value })), cell: { order: 4, width: 110 } },
    total: { key: "total", title: "动态总价", cell: compute(({ row }) => ({ order: 5, width: 120, render: () => `¥${(Number(row?.quantity || 0) * Number(row?.unitPrice || 0)).toLocaleString()}` })) },
  },
  search: { columns: { product: { component: { name: markRaw(FnInput) as any, vModel: "modelValue", placeholder: "搜索套餐" } } } }, pagination: { pageSize: 5 },
  request: {
    ...api,
  },
}) as unknown as FnCrudState<Order>;
useFnCrud(crudState);
</script>
<template><div class="view-stack"><div class="tier-switch"><span>计价层级</span><select v-model="tier"><option>标准</option><option>批量</option><option>企业</option></select></div><section class="panel"><FnCrud v-bind="crudState" /></section></div></template>
<style scoped>.tier-switch { display: flex; align-items: center; justify-content:flex-end; gap: 8px; padding:8px 12px; color: #667085; font-size: 13px; } .tier-switch select { min-height: 32px; padding: 0 10px; border: 1px solid #d0d5dd; border-radius: 6px; color: #344054; background: #fff; }</style>
