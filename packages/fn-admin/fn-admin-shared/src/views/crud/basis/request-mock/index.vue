<script setup lang="tsx">
import { markRaw, reactive } from 'vue'
import { DictStore, FnCrud, FnInput, type FnCrudState, type FnRowContext, useFnCrud } from '@fast-crud/fast-crud-next'
import DemoSelect from '@fast-crud/fn-admin-shared/components/DemoSelect.vue'
import { api, type ServiceRecord } from './api'

const environmentOptions = ['生产', '预发布', '测试'].map((value) => ({ label: value, value }))
const statusDict = new DictStore({
  data: [
    { label: '运行中', value: '运行中', color: 'success' },
    { label: '待发布', value: '待发布', color: 'warning' },
    { label: '已暂停', value: '已暂停', color: 'default' },
  ],
})

const state = reactive({
  id: 'request-mock-services',
  heading: { title: 'Mock 请求示例', description: "输入服务名称后查询，或点击「新增」提交记录，观察列表刷新。" },
  columns: {
    id: { key: 'id', title: '编号', cell: { width: 84 } },
    name: {
      key: 'name',
      title: '服务名称',
      search: { order: 1, component: { name: markRaw(FnInput) as any, vModel: 'modelValue', placeholder: '搜索服务名称' }, width: 230 },
      form: { order: 1, rules: [{ required: true, message: '请输入服务名称' }] },
      cell: {
        order: 1,
        width: 230,
        ellipsis: true,
        tooltip: ({ row }: FnRowContext<ServiceRecord>) => row.name,
      },
    },
    owner: { key: 'owner', title: '负责人', form: { order: 2, rules: [{ required: true, message: '请输入负责人' }] }, cell: { order: 2, width: 120 } },
    environment: { key: 'environment', title: '环境', form: { order: 3, value: '测试', component: { name: markRaw(DemoSelect) as any, vModel: 'modelValue', options: environmentOptions } }, cell: { order: 3, width: 110 } },
    status: {
      key: 'status',
      title: '状态',
      type: 'dict-select',
      dict: statusDict,
      search: { show: false },
      form: { order: 4, value: '待发布' },
      cell: {
        order: 4,
        width: 110,
        filter: { options: statusDict.getOptions().value },
      },
    },
    updatedAt: { key: 'updatedAt', title: '最近更新', cell: { order: 5, width: 168, sortable: true } },
  },
  table: { rowKey: 'id', minWidth: 760 },
  rowHandle: { width: 150 },
  request: {
    ...api,
  },
}) as unknown as FnCrudState<ServiceRecord>
useFnCrud({ state })
</script>

<template>
  <div class="crud-page">
    <FnCrud v-bind="state" />
  </div>
</template>
