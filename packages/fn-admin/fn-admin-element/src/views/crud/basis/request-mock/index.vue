<script setup lang="ts">
import { h, markRaw, reactive } from 'vue'
import { FnCrud, FnInput, type FnCrudState, type FnRowContext, useFnCrud } from '@fast-crud/fast-crud-next'
import DemoSelect from '@fast-crud/fn-admin-shared/components/DemoSelect.vue'
import { api, type ServiceRecord } from './api'

const environmentOptions = ['生产', '预发布', '测试'].map((value) => ({ label: value, value }))
const statusOptions = ['运行中', '待发布', '已暂停'].map((value) => ({ label: value, value }))

const state = reactive({
  id: 'request-mock-services',
  heading: { title: 'Mock 请求示例', description: '通过 Mock API 演示分页查询、新增、编辑和删除请求。' },
  columns: {
    id: { key: 'id', title: '编号', cell: { width: 84 } },
    name: { key: 'name', title: '服务名称', search: { order: 1, component: { name: markRaw(FnInput) as any, vModel: 'modelValue', placeholder: '搜索服务名称' }, width: 230 }, form: { order: 1, rules: [{ required: true, message: '请输入服务名称' }] }, cell: { order: 1 } },
    owner: { key: 'owner', title: '负责人', form: { order: 2, rules: [{ required: true, message: '请输入负责人' }] }, cell: { order: 2, width: 120 } },
    environment: { key: 'environment', title: '环境', form: { order: 3, value: '测试', component: { name: markRaw(DemoSelect) as any, vModel: 'modelValue', options: environmentOptions } }, cell: { order: 3, width: 110 } },
    status: { key: 'status', title: '状态', form: { order: 4, value: '待发布', component: { name: markRaw(DemoSelect) as any, vModel: 'modelValue', options: statusOptions } }, cell: { order: 4, width: 110, render: ({ row }: FnRowContext<ServiceRecord>) => h('span', { class: ['mock-status', `mock-status--${row.status === '运行中' ? 'active' : row.status === '待发布' ? 'pending' : 'paused'}`] }, row.status) } },
    updatedAt: { key: 'updatedAt', title: '最近更新', cell: { order: 5, width: 168 } },
  },
  table: { rowKey: 'id', minWidth: 760 },
  rowHandle: { width: 150 },
  pagination: { pageSize: 5, pageSizeOptions: ['5', '10', '20'] },
  request: {
    ...api,
  },
}) as unknown as FnCrudState<ServiceRecord>
useFnCrud({ state })
</script>

<template>
  <section class="mock-panel"><FnCrud v-bind="state" /></section>
</template>

<style lang="less">
.mock-panel {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border: 1px solid #e1e7ef;
  border-radius: 0;
  background: #fff;
  .mock-status { display: inline-flex; align-items: center; min-height: 22px; padding: 0 8px; border-radius: 4px; font-size: 12px; }
  .mock-status--active { color: #087443; background: #e7f6ee; }
  .mock-status--pending { color: #9a6700; background: #fff4d6; }
  .mock-status--paused { color: #667085; background: #f2f4f7; }
}
</style>
