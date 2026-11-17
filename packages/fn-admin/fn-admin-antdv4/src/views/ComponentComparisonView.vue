<script setup lang="ts">
import { ref } from "vue";
import { Button, Space, Table, Tag, message } from "ant-design-vue";

interface ServiceRow {
  id: number;
  name: string;
  owner: string;
  environment: string;
  status: "运行中" | "待发布" | "已暂停";
}

const initialRows: ServiceRow[] = [
  { id: 1042, name: "证书自动续期", owner: "平台组", environment: "生产", status: "运行中" },
  { id: 1038, name: "边缘节点同步", owner: "基础设施", environment: "生产", status: "运行中" },
  { id: 1029, name: "域名健康检查", owner: "平台组", environment: "预发布", status: "待发布" },
  { id: 1017, name: "旧证书清理", owner: "安全组", environment: "生产", status: "已暂停" },
  { id: 1004, name: "站点可用性巡检", owner: "运维组", environment: "测试", status: "运行中" },
];
const rows = ref<ServiceRow[]>(initialRows.map((row) => ({ ...row })));
const columns = [
  { title: "编号", dataIndex: "id", key: "id", width: 100 },
  { title: "服务名称", dataIndex: "name", key: "name" },
  { title: "负责人", dataIndex: "owner", key: "owner", width: 140 },
  { title: "环境", dataIndex: "environment", key: "environment", width: 120 },
  { title: "状态", dataIndex: "status", key: "status", width: 130 },
  { title: "操作", key: "actions", width: 112, align: "right" as const },
];

function addRow(): void {
  const id = Math.max(...rows.value.map((row) => row.id), 1000) + 1;
  rows.value = [{ id, name: "新建服务", owner: "平台组", environment: "测试", status: "待发布" }, ...rows.value];
  message.success("已新增一条演示记录");
}

function resetRows(): void {
  rows.value = initialRows.map((row) => ({ ...row }));
  message.info("表格已恢复初始数据");
}
</script>

<template>
  <div class="comparison-page">
    <header class="page-heading">
      <div><h1>普通表格与按钮</h1><p>相同数据和操作，使用 Ant Design Vue 原生组件渲染。</p></div>
      <span class="record-count">{{ rows.length }} 条记录</span>
    </header>
    <section class="table-panel">
      <div class="table-toolbar">
        <strong>服务目录</strong>
        <Space>
          <Button @click="resetRows">刷新</Button>
          <Button type="primary" @click="addRow">新增服务</Button>
        </Space>
      </div>
      <Table :columns="columns" :data-source="rows" :pagination="false" :scroll="{ x: 680 }" row-key="id" size="middle">
        <template #bodyCell="{ column, record }">
          <Tag v-if="column.key === 'status'" :color="record.status === '运行中' ? 'success' : record.status === '待发布' ? 'warning' : 'default'">{{ record.status }}</Tag>
          <Button v-else-if="column.key === 'actions'" type="link" size="small" @click="message.info(`${record.name} · ${record.owner}`)">查看</Button>
        </template>
      </Table>
    </section>
  </div>
</template>

<style scoped>
.comparison-page{width:100%;margin:0}.page-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:22px;padding:20px 24px 0}.page-heading h1{margin:0 0 6px;color:#19273a;font-size:24px;font-weight:650}.page-heading p{margin:0;color:#758397;font-size:13px}.record-count{padding-top:6px;color:#758397;font-size:13px;font-variant-numeric:tabular-nums}.table-panel{overflow:hidden;border:1px solid #e1e7ef;border-radius:0;background:#fff}.table-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;border-bottom:1px solid #f0f0f0}.table-toolbar strong{color:#26364a;font-size:14px}@media(max-width:600px){.table-toolbar{align-items:flex-start;padding:14px;flex-direction:column}.page-heading{padding:16px 14px 0}.page-heading h1{font-size:21px}}
</style>
