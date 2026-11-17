<script setup lang="ts">
import { computed } from "vue";
import { Card, Col, Row, Statistic, Table, Tag } from "ant-design-vue";
const activity = computed(() => [
  { key: 1, action: "新增服务", target: "证书自动续期", time: "刚刚", status: "完成" },
  { key: 2, action: "更新环境", target: "边缘节点同步", time: "12 分钟前", status: "完成" },
  { key: 3, action: "暂停任务", target: "旧证书清理", time: "1 小时前", status: "待确认" },
]);
const columns = [{ title: "操作", dataIndex: "action" }, { title: "对象", dataIndex: "target" }, { title: "时间", dataIndex: "time" }, { title: "状态", dataIndex: "status" }];
</script>
<template>
  <div class="view-stack">
    <div class="view-heading"><div><h1>工作台</h1><p>查看服务目录的运行概况和最近活动。</p></div></div>
    <Row :gutter="16" class="metric-grid"><Col :xs="24" :sm="12" :lg="6"><Card><Statistic title="服务总数" :value="24" /></Card></Col><Col :xs="24" :sm="12" :lg="6"><Card><Statistic title="运行中" :value="18" :value-style="{ color: '#12b76a' }" /></Card></Col><Col :xs="24" :sm="12" :lg="6"><Card><Statistic title="待发布" :value="4" :value-style="{ color: '#f79009' }" /></Card></Col><Col :xs="24" :sm="12" :lg="6"><Card><Statistic title="异常" :value="2" :value-style="{ color: '#f04438' }" /></Card></Col></Row>
    <section class="panel"><div class="panel-header"><h2>最近活动</h2><p>来自服务目录的最新操作记录。</p></div><Table :columns="columns" :data-source="activity" :pagination="false" size="small"><template #bodyCell="{ column, record }"><Tag v-if="column.dataIndex === 'status'" :color="record.status === '完成' ? 'success' : 'warning'">{{ record.status }}</Tag></template></Table></section>
  </div>
</template>
