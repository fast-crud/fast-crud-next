<script setup lang="ts">
import { defineComponent, h, markRaw, reactive, ref } from "vue";
import { FnCrud, FnInput, compute, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { api, type Order } from "./api";

const tier = ref("标准");
const disabledRef = ref(false);
const PriceSwitch = markRaw(defineComponent({
  props: { modelValue: Boolean },
  emits: { "update:modelValue": (value: boolean) => typeof value === "boolean" },
  setup: (props, { emit }) => () => h("input", {
    class: "compute-price-switch",
    type: "checkbox",
    role: "switch",
    "aria-label": "自定义单价",
    checked: props.modelValue,
    onChange: (event: Event) => emit("update:modelValue", (event.target as HTMLInputElement).checked),
  }),
}));
const inputComponent = markRaw(FnInput);
const numberInput = { name: inputComponent, vModel: "modelValue", type: "number" };

const crudState = reactive<FnCrudState<Order>>({
  id: "antdv-compute-orders",
  heading: { title: "套餐动态计价", description: "切换自定义单价可编辑本行单价，总价随数量和单价实时更新。" },
  table: { rowKey: "id", minWidth: 920 },
  rowHandle: { width: 140 },
  columns: {
    id: { key: "id", title: "订单号", cell: { width: 85 } },
    product: { key: "product", title: "套餐", form: { rules: [{ required: true, message: "请输入套餐名称" }] }, cell: { order: 1 } },
    quantity: {
      key: "quantity",
      title: "数量",
      form: { value: 1, component: numberInput },
      cell: {
        order: 2,
        width: 90,
        component: compute(({ row }: { row?: Order }) => ({
          ...numberInput,
          modelValue: row?.quantity,
          "aria-label": "数量",
          disabled: disabledRef.value,
          "onUpdate:modelValue": (value: string) => {
            if (row) row.quantity = Number(value);
          },
        })),
      },
    },
    customPrice: {
      key: "customPrice",
      title: "自定义单价",
      form: { value: false, component: { name: PriceSwitch, id: "customPrice" } },
      cell: {
        order: 3,
        width: 110,
        component: compute(({ row }: { row?: Order }) => ({
          name: PriceSwitch,
          modelValue: Boolean(row?.customPrice),
          "onUpdate:modelValue": (value: boolean) => {
            if (row) row.customPrice = value;
          },
        })),
      },
    },
    unitPrice: {
      key: "unitPrice",
      title: "单价",
      form: compute(({ form }) => ({
        show: Boolean(form?.customPrice),
        value: 100,
        component: { ...numberInput, id: "unitPrice" },
      })),
      cell: {
        order: 4,
        width: 100,
        component: compute(({ row }: { row?: Order }) => ({
          ...numberInput,
          modelValue: row?.unitPrice,
          "aria-label": "单价",
          disabled: !row?.customPrice,
          "onUpdate:modelValue": (value: string) => {
            if (row) row.unitPrice = Number(value);
          },
        })),
      },
    },
    tier: { key: "tier", title: "计价层级", form: compute(() => ({ value: tier.value })), cell: { order: 5, width: 110 } },
    total: {
      key: "total",
      title: "动态总价",
      cell: {
        order: 6,
        width: 120,
        render: ({ row }) => `¥${(Number(row.quantity || 0) * Number(row.unitPrice || 0)).toLocaleString()}`,
      },
    },
  },
  actionbar: {
    buttons: {
      toggleQuantity: {
        get text() {
          return disabledRef.value ? "启用数量输入" : "禁用数量输入";
        },
        type: "default",
        onClick: () => {
          disabledRef.value = !disabledRef.value;
        },
      },
    },
  },
  search: { columns: { product: { component: { name: inputComponent, vModel: "modelValue", placeholder: "搜索套餐" } } } },
  pagination: { pageSize: 5 },
  request: api,
});
useFnCrud(crudState);
</script>

<template>
  <div class="view-stack compute-page">
    <label class="tier-switch">
      <span>计价层级</span>
      <select v-model="tier">
        <option>标准</option>
        <option>批量</option>
        <option>企业</option>
      </select>
    </label>
    <section class="panel"><FnCrud v-bind="crudState" /></section>
  </div>
</template>

<style lang="less" scoped>
.compute-page {
  .tier-switch {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 8px 12px;
    color: var(--fn-color-text-secondary);
    font-size: 13px;

    select {
      min-height: 32px;
      padding: 0 10px;
      border: 1px solid var(--fn-color-border);
      border-radius: 6px;
      color: var(--fn-color-text);
      background: var(--fn-color-bg-container);
    }
  }

  :deep(.compute-price-switch) {
    appearance: none;
    display: inline-flex;
    align-items: center;
    width: 36px;
    height: 22px;
    padding: 2px;
    margin: 0;
    border-radius: 999px;
    background: var(--fn-color-text-tertiary);
    cursor: pointer;
    vertical-align: middle;

    &::before {
      content: "";
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
    }

    &:checked {
      justify-content: flex-end;
      background: var(--fn-color-primary);
    }

    &:focus-visible {
      outline: 2px solid var(--fn-color-primary);
      outline-offset: 2px;
    }
  }
}
</style>
