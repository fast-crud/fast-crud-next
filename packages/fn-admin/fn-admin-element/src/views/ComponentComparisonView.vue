<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'

interface ServiceRow { id: number; name: string; owner: string; environment: string; status: '运行中' | '待发布' | '已暂停' }
const initialRows: ServiceRow[] = [
  { id: 1042, name: '证书自动续期', owner: '平台组', environment: '生产', status: '运行中' },
  { id: 1038, name: '边缘节点同步', owner: '基础设施', environment: '生产', status: '运行中' },
  { id: 1029, name: '域名健康检查', owner: '平台组', environment: '预发布', status: '待发布' },
  { id: 1017, name: '旧证书清理', owner: '安全组', environment: '生产', status: '已暂停' },
  { id: 1004, name: '站点可用性巡检', owner: '运维组', environment: '测试', status: '运行中' },
]
const rows = ref<ServiceRow[]>(initialRows.map((row) => ({ ...row })))
function addRow(): void {
  const id = Math.max(...rows.value.map((row) => row.id), 1000) + 1
  rows.value = [{ id, name: '新建服务', owner: '平台组', environment: '测试', status: '待发布' }, ...rows.value]
  ElMessage.success('已新增一条演示记录')
}
function resetRows(): void { rows.value = initialRows.map((row) => ({ ...row })); ElMessage.info('表格已恢复初始数据') }
</script>

<template>
  <div class="comparison-page">
    <header class="page-heading"><div><h2>普通表格与按钮</h2><p>相同数据和操作，使用 Element Plus 原生组件渲染。</p></div><span class="record-count">{{ rows.length }} 条记录</span></header>
    <section class="table-panel">
      <div class="table-toolbar"><strong>服务目录</strong><div class="toolbar-actions"><ElButton @click="resetRows">刷新</ElButton><ElButton type="primary" @click="addRow">新增服务</ElButton></div></div>
      <ElTable :data="rows" row-key="id" size="default" style="width: 100%">
        <ElTableColumn prop="id" label="编号" width="100" />
        <ElTableColumn prop="name" label="服务名称" min-width="190" />
        <ElTableColumn prop="owner" label="负责人" width="140" />
        <ElTableColumn prop="environment" label="环境" width="120" />
        <ElTableColumn prop="status" label="状态" width="130"><template #default="{ row }"><ElTag :type="row.status === '运行中' ? 'success' : row.status === '待发布' ? 'warning' : 'info'" effect="light">{{ row.status }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="112" align="right"><template #default="{ row }"><ElButton link type="primary" @click="ElMessage.info(`${row.name} · ${row.owner}`)">查看</ElButton></template></ElTableColumn>
      </ElTable>
    </section>
  </div>
</template>

<style lang="less">
.comparison-page {
  width: 100%;
  margin: 0;
  .page-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 22px; padding: 20px 24px 0; }
  .page-heading h2 { margin: 0 0 6px; color: #19273a; font-size: 24px; font-weight: 650; }
  .page-heading p { margin: 0; color: #758397; font-size: 13px; }
  .record-count { padding-top: 6px; color: #758397; font-size: 13px; font-variant-numeric: tabular-nums; }
  .table-panel { overflow: hidden; border: 1px solid #e1e7ef; border-radius: 0; background: #fff; }
  .table-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 20px; border-bottom: 1px solid #ebeef5; }
  .table-toolbar strong { color: #26364a; font-size: 14px; }
  .toolbar-actions { display: flex; gap: 10px; }
  @media (max-width: 600px) {
    .table-toolbar { align-items: flex-start; padding: 14px; flex-direction: column; }
    .page-heading { padding: 16px 14px 0; }
    .page-heading h2 { font-size: 21px; }
  }
}
</style>
