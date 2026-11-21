<script setup lang="tsx">
import { markRaw, reactive } from 'vue'
import { FnCrud, FnInput, FnTooltip, type FnCrudState, type FnRowContext, useFnCrud } from '@fast-crud/fast-crud-next'
import DemoSelect from '@fast-crud/fn-admin-shared/components/DemoSelect.vue'
import { api, type ServiceRecord } from './api'

const environmentOptions = ['生产', '预发布', '测试'].map((value) => ({ label: value, value }))
const statusOptions = ['运行中', '待发布', '已暂停'].map((value) => ({ label: value, value }))

const state = reactive({
  id: 'request-mock-services',
  heading: { title: 'Mock 请求示例', description: '通过 Mock API 演示分页查询、新增、编辑和删除请求。' },
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
        render: ({ row }: FnRowContext<ServiceRecord>) => (
          <FnTooltip content={row.name} v-slots={{
            default: ({ attrs }: { attrs: { 'aria-describedby'?: string } }) => (
              <span {...attrs} class="mock-panel-service-name" tabindex={0}>{row.name}</span>
            ),
          }} />
        ),
      },
    },
    owner: { key: 'owner', title: '负责人', form: { order: 2, rules: [{ required: true, message: '请输入负责人' }] }, cell: { order: 2, width: 120 } },
    environment: { key: 'environment', title: '环境', form: { order: 3, value: '测试', component: { name: markRaw(DemoSelect) as any, vModel: 'modelValue', options: environmentOptions } }, cell: { order: 3, width: 110 } },
    status: {
      key: 'status',
      title: '状态',
      form: { order: 4, value: '待发布', component: { name: markRaw(DemoSelect) as any, vModel: 'modelValue', options: statusOptions } },
      cell: {
        order: 4,
        width: 110,
        filter: { options: statusOptions },
        render: ({ row }: FnRowContext<ServiceRecord>) => (
          <span class={['mock-status', `mock-status--${row.status === '运行中' ? 'active' : row.status === '待发布' ? 'pending' : 'paused'}`]}>{row.status}</span>
        ),
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
  <div class="crud-page mock-panel">
    <FnCrud v-bind="state" />
  </div>
</template>

<style lang="less">
.mock-panel {
  .mock-panel-service-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
