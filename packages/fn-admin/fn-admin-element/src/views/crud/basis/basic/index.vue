<template>
  <section class="crud-frame"><FnCrud v-bind="crudState" /></section>
</template>

<script setup lang="ts">
import { h, markRaw, reactive, ref } from 'vue'
import { ElTag } from 'element-plus'
import { FnCrud, FnInput, type FnCrudState, type FnTablePageQuery, type FnTablePageResult, type FnRowContext, DictStore, useFnCrud } from '@fast-crud/fast-crud-next'
import DemoSelect from '@fast-crud/fn-admin-shared/components/DemoSelect.vue'
import { copyDemoRows } from '@fast-crud/fn-admin-shared/mock/copy-demo-rows'

interface ServiceRecord { id: number; name: string; owner: string; environment: string; status: string; updatedAt: string }
const statusDict = markRaw(new DictStore({ data: [
  { label: '运行中', value: 'running', color: 'success' },
  { label: '待发布', value: 'staged', color: 'warning' },
  { label: '已暂停', value: 'paused', color: 'default' },
] }))
const environmentOptions = ['生产', '预发布', '测试'].map((value) => ({ label: value, value }))
const rows = ref<ServiceRecord[]>(copyDemoRows([
  { id: 1042, name: '证书自动续期', owner: '平台组', environment: '生产', status: 'running', updatedAt: '2026-11-16 10:42' },
  { id: 1038, name: '边缘节点同步', owner: '基础设施', environment: '生产', status: 'running', updatedAt: '2026-11-16 09:18' },
  { id: 1029, name: '域名健康检查', owner: '平台组', environment: '预发布', status: 'staged', updatedAt: '2026-11-15 17:36' },
  { id: 1017, name: '旧证书清理', owner: '安全组', environment: '生产', status: 'paused', updatedAt: '2026-11-15 14:05' },
  { id: 1004, name: '站点可用性巡检', owner: '运维组', environment: '测试', status: 'running', updatedAt: '2026-11-14 11:27' },
  { id: 998, name: 'DNS 配置核验', owner: '基础设施', environment: '预发布', status: 'staged', updatedAt: '2026-11-13 16:50' },
]))
const crudState = reactive({
  id: 'element-basic-crud',
  heading: { title: '基础列表示例', description: '通过服务数据演示搜索、分页和增删改查。' },
  columns: {
    id: { key: 'id', title: '编号', cell: { width: 84 } },
    name: { key: 'name', title: '服务名称', search: { order: 1, component: { name: FnInput, vModel: 'modelValue', placeholder: '搜索服务名称或负责人' }, width: 240 }, form: { order: 1, rules: [{ required: true, message: '请输入服务名称' }] }, cell: { order: 1 } },
    owner: { key: 'owner', title: '负责人', form: { order: 2, rules: [{ required: true, message: '请输入负责人' }] }, cell: { order: 2, width: 120 } },
    environment: { key: 'environment', title: '环境', form: { order: 3, value: '测试', component: { name: markRaw(DemoSelect), vModel: 'modelValue', options: environmentOptions } }, cell: { order: 3, width: 110 } },
    status: { key: 'status', title: '状态', form: { order: 4, value: 'staged', component: { name: markRaw(DemoSelect), vModel: 'modelValue', options: statusDict.__options.value } }, cell: { order: 4, width: 110, dict: statusDict, render: ({ row }: FnRowContext<ServiceRecord>) => {
      const option = statusDict.__options.value.find((item) => item.value === row.status)
      return h(ElTag, { type: option?.color === 'success' ? 'success' : option?.color === 'warning' ? 'warning' : 'info', effect: 'light' }, () => option?.label || '—')
    } } },
    updatedAt: { key: 'updatedAt', title: '最近更新', cell: { order: 5, width: 168 } },
  },
  table: { rowKey: 'id', minWidth: 760 },
  rowHandle: { width: 150 },
  request: {
    pageRequest: async ({ page, query, sort }: FnTablePageQuery): Promise<FnTablePageResult<ServiceRecord>> => {
      const keyword = String(query.name || '').trim().toLocaleLowerCase()
      let filtered = rows.value.filter((record) => !keyword || `${record.name} ${record.owner}`.toLocaleLowerCase().includes(keyword))
      if (sort?.prop) filtered = [...filtered].sort((a, b) => String(a[sort.prop as keyof ServiceRecord]).localeCompare(String(b[sort.prop as keyof ServiceRecord])) * (sort.asc ? 1 : -1))
      return { records: filtered.slice(page.offset, page.offset + page.limit), total: filtered.length }
    },
    addRequest: async (form: Record<string, any>) => { rows.value.unshift({ id: Math.max(...rows.value.map((row) => row.id), 0) + 1, name: String(form.name), owner: String(form.owner), environment: String(form.environment || '测试'), status: String(form.status || 'staged'), updatedAt: now() }) },
    editRequest: async (form: Record<string, any>) => { const id = Number(form.id); rows.value = rows.value.map((row) => row.id === id ? { ...row, name: String(form.name), owner: String(form.owner), environment: String(form.environment), status: String(form.status), updatedAt: now() } : row) },
    delRequest: async (id: string | number) => { rows.value = rows.value.filter((row) => row.id !== Number(id)) },
  },
}) as unknown as FnCrudState<ServiceRecord>
useFnCrud({ state: crudState })
function now(): string { return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'short', hour12: false }).format(new Date()) }
</script>

<style lang="less">
.crud-frame { flex: 1; min-height: 0; overflow: hidden; border: 1px solid var(--fn-color-border, #e1e7ef); border-radius: 0; background: var(--fn-color-bg-container, #fff); }
</style>
