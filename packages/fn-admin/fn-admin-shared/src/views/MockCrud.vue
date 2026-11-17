<script setup lang="ts">
import { h, markRaw, reactive } from 'vue'
import { FnCrud, FnInput, type FnCrudState, type FnTablePageQuery, type FnTablePageResult, type FnTableRowContext, useFnCrud } from '@fast-crud/fn-crud/crud'
import DemoSelect from '../components/DemoSelect.vue'
import type { ServiceRecord } from '../mock/types'
import { requestMock } from '../mock/http'
import '../mock'

const environmentOptions = ['生产', '预发布', '测试'].map((value) => ({ label: value, value }))
const statusOptions = ['运行中', '待发布', '已暂停'].map((value) => ({ label: value, value }))

const state = reactive({
  id: 'request-mock-services',
  heading: { title: '服务目录', description: '分页查询、新增、编辑和删除均通过独立 Mock API 请求完成。' },
  columns: {
    id: { key: 'id', title: '编号', cell: { width: 84 } },
    name: { key: 'name', title: '服务名称', search: { order: 1, component: { name: markRaw(FnInput) as any, vModel: 'modelValue', placeholder: '搜索服务或负责人' }, width: 230 }, form: { order: 1, rules: [{ required: true, message: '请输入服务名称' }] }, cell: { order: 1 } },
    owner: { key: 'owner', title: '负责人', form: { order: 2, rules: [{ required: true, message: '请输入负责人' }] }, cell: { order: 2, width: 120 } },
    environment: { key: 'environment', title: '环境', form: { order: 3, value: '测试', component: { name: markRaw(DemoSelect) as any, vModel: 'modelValue', options: environmentOptions } }, cell: { order: 3, width: 110 } },
    status: { key: 'status', title: '状态', form: { order: 4, value: '待发布', component: { name: markRaw(DemoSelect) as any, vModel: 'modelValue', options: statusOptions } }, cell: { order: 4, width: 110, render: ({ row }: FnTableRowContext<ServiceRecord>) => h('span', { class: ['mock-status', `mock-status--${row.status === '运行中' ? 'active' : row.status === '待发布' ? 'pending' : 'paused'}`] }, row.status) } },
    updatedAt: { key: 'updatedAt', title: '最近更新', cell: { order: 5, width: 168 } },
  },
  table: { rowKey: 'id', minWidth: 760 },
  rowHandle: { width: 150 },
  pagination: { pageSize: 5, pageSizeOptions: ['5', '10', '20'] },
  request: {
    pageRequest: (query: FnTablePageQuery): Promise<FnTablePageResult<ServiceRecord>> => requestMock({ method: 'get', url: '/mock/FnCrudServices/page', data: { ...query, sort: query.sort || { prop: '', asc: true } } }),
    addRequest: (form: Record<string, any>) => requestMock({ method: 'post', url: '/mock/FnCrudServices/add', data: form }),
    editRequest: (form: Record<string, any>) => requestMock({ method: 'post', url: '/mock/FnCrudServices/update', data: form }),
    delRequest: (id: string | number) => requestMock({ method: 'post', url: '/mock/FnCrudServices/delete', params: { id }, data: {} }),
  },
}) as unknown as FnCrudState<ServiceRecord>
useFnCrud(state)
</script>

<template>
  <div class="mock-page">
    <div class="mock-intro"><div><p class="eyebrow">FN CRUD / REQUEST MOCK</p><h1>请求式 Mock</h1><p>与基础列表相同的服务数据，通过 Vite Mock API 完成读写。</p></div><span class="api-badge"><i></i> MOCK API</span></div>
    <section class="mock-panel"><FnCrud v-bind="state" /></section>
  </div>
</template>

<style scoped>
.mock-page{width:100%;margin:0;padding:24px}.mock-intro{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:22px}.eyebrow{margin:0 0 6px;color:#e1782d;font-size:11px;font-weight:700}.mock-intro h1{margin:0 0 6px;color:#19273a;font-size:25px}.mock-intro p:last-child{margin:0;color:#758397}.api-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid #dce7df;border-radius:5px;color:#34704c;background:#f5faf6;font-size:11px;font-weight:700}.api-badge i{width:7px;height:7px;border-radius:50%;background:#36a269}.mock-panel{min-height:560px;overflow:hidden;border:1px solid #e1e7ef;border-radius:0;background:#fff}.mock-status{display:inline-flex;align-items:center;min-height:22px;padding:0 8px;border-radius:4px;font-size:12px}.mock-status--active{color:#087443;background:#e7f6ee}.mock-status--pending{color:#9a6700;background:#fff4d6}.mock-status--paused{color:#667085;background:#f2f4f7}
</style>
