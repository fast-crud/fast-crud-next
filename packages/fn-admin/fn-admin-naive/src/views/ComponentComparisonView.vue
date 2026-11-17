<script setup lang="ts">
import { h, ref } from 'vue'
import { NButton, NDataTable, NTag, useMessage, type DataTableColumns } from 'naive-ui'

interface ServiceRow { id: number; name: string; owner: string; environment: string; status: '运行中' | '待发布' | '已暂停' }
const initialRows: ServiceRow[] = [
  { id: 1042, name: '证书自动续期', owner: '平台组', environment: '生产', status: '运行中' },
  { id: 1038, name: '边缘节点同步', owner: '基础设施', environment: '生产', status: '运行中' },
  { id: 1029, name: '域名健康检查', owner: '平台组', environment: '预发布', status: '待发布' },
  { id: 1017, name: '旧证书清理', owner: '安全组', environment: '生产', status: '已暂停' },
  { id: 1004, name: '站点可用性巡检', owner: '运维组', environment: '测试', status: '运行中' },
]
const rows = ref<ServiceRow[]>(initialRows.map((row) => ({ ...row })))
const message = useMessage()
const columns: DataTableColumns<ServiceRow> = [
  { title: '编号', key: 'id', width: 100 },
  { title: '服务名称', key: 'name', minWidth: 190 },
  { title: '负责人', key: 'owner', width: 140 },
  { title: '环境', key: 'environment', width: 120 },
  { title: '状态', key: 'status', width: 130, render: (row) => h(NTag, { type: row.status === '运行中' ? 'success' : row.status === '待发布' ? 'warning' : 'default', bordered: false, size: 'small' }, { default: () => row.status }) },
  { title: '操作', key: 'actions', width: 112, align: 'right', render: (row) => h(NButton, { text: true, type: 'primary', size: 'small', onClick: () => message.info(`${row.name} · ${row.owner}`) }, { default: () => '查看' }) },
]
function addRow(): void {
  const id = Math.max(...rows.value.map((row) => row.id), 1000) + 1
  rows.value = [{ id, name: '新建服务', owner: '平台组', environment: '测试', status: '待发布' }, ...rows.value]
  message.success('已新增一条演示记录')
}
function resetRows(): void { rows.value = initialRows.map((row) => ({ ...row })); message.info('表格已恢复初始数据') }
</script>

<template>
  <div class="comparison-page">
    <header class="page-heading"><div><h1>普通表格与按钮</h1><p>相同数据和操作，使用 Naive UI 原生组件渲染。</p></div><span class="record-count">{{ rows.length }} 条记录</span></header>
    <section class="table-panel">
      <div class="table-toolbar"><strong>服务目录</strong><div class="toolbar-actions"><NButton secondary @click="resetRows">刷新</NButton><NButton type="primary" @click="addRow">新增服务</NButton></div></div>
      <NDataTable :columns="columns" :data="rows" :row-key="(row: ServiceRow) => row.id" :single-line="false" />
    </section>
  </div>
</template>

<style scoped>
.comparison-page{width:100%;margin:0}.page-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:22px;padding:20px 24px 0}.page-heading h1{margin:0 0 6px;color:var(--n-text-color,#19273a);font-size:24px;font-weight:650}.page-heading p{margin:0;color:var(--n-text-color-3,#758397);font-size:13px}.record-count{padding-top:6px;color:var(--n-text-color-3,#758397);font-size:13px;font-variant-numeric:tabular-nums}.table-panel{overflow:hidden;border:1px solid var(--n-border-color,#e1e7ef);border-radius:0;background:var(--n-color,#fff)}.table-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;border-bottom:1px solid var(--n-border-color,#e1e7ef)}.table-toolbar strong{color:var(--n-text-color,#26364a);font-size:14px}.toolbar-actions{display:flex;gap:10px}@media(max-width:600px){.table-toolbar{align-items:flex-start;padding:14px;flex-direction:column}.page-heading{padding:16px 14px 0}.page-heading h1{font-size:21px}}
</style>
