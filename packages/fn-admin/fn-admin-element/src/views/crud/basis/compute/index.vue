<template>
  <div class="view-page crud-page">
    <div class="crud-frame"><FnCrud v-bind="crudState" /></div>
  </div>
</template>

<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { ElTag } from 'element-plus'
import { FnCrud, FnInput, compute, type FnCrudState, type FnTablePageQuery, type FnTablePageResult, useFnCrud } from '@fast-crud/fast-crud-next'

interface TaskRecord { id: number; task: string; owner: string; priority: 'P0' | 'P1' | 'P2'; budget: number; progress: number; status: 'running' | 'blocked' | 'done' }
const rows = ref<TaskRecord[]>([
  { id: 301, task: '生产证书轮换', owner: '平台组', priority: 'P0', budget: 120, progress: 76, status: 'running' },
  { id: 302, task: '边缘节点巡检', owner: '基础设施', priority: 'P1', budget: 80, progress: 48, status: 'running' },
  { id: 303, task: '历史域名归档', owner: '安全组', priority: 'P2', budget: 36, progress: 100, status: 'done' },
  { id: 304, task: 'DNS 故障复盘', owner: '平台组', priority: 'P0', budget: 60, progress: 24, status: 'blocked' },
])
const statusLabel: Record<TaskRecord['status'], string> = { running: '进行中', blocked: '阻塞', done: '已完成' }
const statusType: Record<TaskRecord['status'], 'success' | 'warning' | 'danger'> = { running: 'success', blocked: 'danger', done: 'success' }
const crudState = reactive({
  id: 'element-compute-crud',
  heading: { title: '动态计算示例', description: '根据任务优先级和完成度动态更新单元格展示。' },
  columns: {
    id: { key: 'id', title: '编号', cell: { width: 76 } },
    task: { key: 'task', title: '任务', search: { order: 1, component: { name: FnInput, vModel: 'modelValue', placeholder: '搜索任务或负责人' } }, form: { order: 1, title: compute(({ mode }) => mode === 'edit' ? '调整任务' : '创建任务'), rules: [{ required: true, message: '请输入任务名称' }] }, cell: { order: 1 } },
    owner: { key: 'owner', title: '负责人', form: { order: 2 }, cell: { order: 2, width: 120 } },
    priority: { key: 'priority', title: '优先级', form: { order: 3 }, cell: { order: 3, width: 100, render: compute(({ row }) => () => h(ElTag, { type: row?.priority === 'P0' ? 'danger' : row?.priority === 'P1' ? 'warning' : 'info', effect: 'plain' }, () => String(row?.priority || ''))) } },
    budget: { key: 'budget', title: '预算（小时）', form: { order: 4 }, cell: { order: 4, width: 120, align: 'right' } },
    progress: { key: 'progress', title: '完成度', cell: { order: 5, width: 150, render: compute(({ row }) => () => h('span', { class: row?.progress === 100 ? 'progress-done' : row?.progress < 30 ? 'progress-risk' : 'progress-normal' }, `${row?.progress ?? 0}%`)) } },
    status: { key: 'status', title: '状态', form: { order: 5 }, cell: { order: 6, width: 110, render: compute(({ row }) => () => h(ElTag, { type: statusType[row?.status as TaskRecord['status']] || 'warning', effect: 'light' }, () => statusLabel[row?.status as TaskRecord['status']] || row?.status || '')) } },
  },
  table: { rowKey: 'id', minWidth: 850 },
  rowHandle: { width: 150 },
  pagination: { pageSize: 5, pageSizeOptions: ['5', '10'] },
  request: {
    pageRequest: async ({ page, query }: FnTablePageQuery): Promise<FnTablePageResult<TaskRecord>> => { const keyword = String(query.task || '').trim().toLocaleLowerCase(); const filtered = rows.value.filter((row) => !keyword || `${row.task} ${row.owner}`.toLocaleLowerCase().includes(keyword)); return { records: filtered.slice(page.offset, page.offset + page.limit), total: filtered.length } },
    addRequest: async (form: Record<string, any>) => { rows.value.push({ id: Math.max(...rows.value.map((row) => row.id), 300) + 1, task: String(form.task), owner: String(form.owner || '平台组'), priority: (form.priority as TaskRecord['priority']) || 'P2', budget: Number(form.budget || 0), progress: 0, status: 'running' }) },
    editRequest: async (form: Record<string, any>) => { const id = Number(form.id); rows.value = rows.value.map((row) => row.id === id ? { ...row, task: String(form.task), owner: String(form.owner), priority: (form.priority as TaskRecord['priority']) || row.priority, budget: Number(form.budget || row.budget), status: (form.status as TaskRecord['status']) || row.status } : row) },
    delRequest: async (id: string | number) => { rows.value = rows.value.filter((row) => row.id !== Number(id)) },
  },
}) as unknown as FnCrudState<TaskRecord>
useFnCrud({ state: crudState })
</script>

<style lang="less">
.view-page {
  display: flex;
  flex: 1;
  min-height: 0;
  .crud-frame { flex: 1; min-height: 0; overflow: hidden; border: 1px solid var(--fn-color-border, #e1e7ef); border-radius: 0; background: var(--fn-color-bg-container, #fff); }
  .progress-done { color: #15966b; font-weight: 700; }
  .progress-risk { color: #d85d39; font-weight: 700; }
  .progress-normal { color: #3d6ea8; font-weight: 600; }
}
</style>
