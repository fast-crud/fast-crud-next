<script setup lang="ts">
import { computed, markRaw, reactive, ref } from "vue";
import { FnButtonBase, FnCrud, FnInput, FnPopover, FnSwitch, FnTooltip, compute, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { api, type Order } from "./api";

const tier = ref("标准");
const disabledRef = ref(false);
const inputComponent = markRaw(FnInput);
const priceSwitch = markRaw(FnSwitch);
const numberInput = { name: inputComponent, vModel: "modelValue", type: "number" };

const crudState = reactive<FnCrudState<Order>>({
  id: "shared-compute-orders",
  heading: { title: "动态计算示例", description: "打开某行的「自定义单价」，修改数量或单价，观察总价实时更新。" },
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
        component: {
          ...numberInput,
          disabled: disabledRef,
        },
      },
    },
    customPrice: {
      key: "customPrice",
      title: "自定义单价",
      form: { value: false, component: { name: priceSwitch } },
      cell: {
        order: 3,
        width: 110,
        component: { name: priceSwitch },
      },
    },
    unitPrice: {
      key: "unitPrice",
      title: "单价",
      form: {
        show: compute(({ form }) => Boolean(form?.customPrice)),
        value: 100,
        component: numberInput,
      },
      cell: {
        order: 4,
        width: 100,
        component: {
          ...numberInput,
          disabled: compute(({ row }: { row?: Order }) => !row?.customPrice),
        },
      },
    },
    tier: { key: "tier", title: "计价层级", form: { value: computed(() => tier.value) }, cell: { order: 5, width: 110 } },
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
        text: computed(() => {
          return disabledRef.value ? "启用数量输入" : "禁用数量输入";
        }),
        type: "default",
        order: 10,
        click: () => {
          disabledRef.value = !disabledRef.value;
        },
      },
    },
  },
  search: { columns: { product: { component: { name: inputComponent, vModel: "modelValue", placeholder: "搜索套餐" } } } },
  request: api,
});
useFnCrud({ state: crudState });
</script>

<template>
  <div class="crud-page compute-page">
    <FnCrud v-bind="crudState">
      <template #actionRight>
        <FnTooltip placement="bottom">
          <template #default="{ attrs }">
            <FnButtonBase v-bind="attrs" text="计价公式" />
          </template>
          <template #content>动态总价 = 数量 × 单价</template>
        </FnTooltip>
        <FnPopover label="计价设置">
          <template #default="{ attrs }">
            <FnButtonBase v-bind="attrs" text="计价设置" />
          </template>
          <template #content="{ close }">
            <label class="compute-page-price-setting">
              计价层级
              <select v-model="tier">
                <option>标准</option>
                <option>高级</option>
              </select>
            </label>
            <FnButtonBase text="完成" @click="close" />
          </template>
        </FnPopover>
      </template>
    </FnCrud>
  </div>
</template>

<style lang="less">
.compute-page-price-setting {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-inline-end: 8px;

  select {
    color: var(--fn-color-text);
    background: var(--fn-color-bg-container);
    border: 1px solid var(--fn-color-border);
  }
}
</style>
