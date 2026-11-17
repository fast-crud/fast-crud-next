<script setup lang="ts">
import { NCard, NGrid, NGridItem, NSpace, NStatistic, NTag } from "naive-ui";
const activities = [
  { title: "证书自动续期", text: "配置已更新", time: "10:42" },
  { title: "边缘节点同步", text: "同步任务完成", time: "09:18" },
  { title: "域名健康检查", text: "新增预发布规则", time: "昨日" },
];
</script>
<template>
  <div class="overview-page">
    <header class="overview-heading"><h1>工作台</h1><p>查看服务目录的运行概况与最近活动。</p></header>
    <NGrid :cols="4" :x-gap="14" :y-gap="14" responsive="screen" item-responsive>
      <NGridItem span="4 s:2 m:1"><NCard size="small"><NStatistic label="服务总数" :value="24" /></NCard></NGridItem>
      <NGridItem span="4 s:2 m:1"><NCard size="small"><NStatistic label="运行中" :value="18"><template #suffix><NTag type="success" size="small" :bordered="false">75%</NTag></template></NStatistic></NCard></NGridItem>
      <NGridItem span="4 s:2 m:1"><NCard size="small"><NStatistic label="待处理变更" :value="4" /></NCard></NGridItem>
      <NGridItem span="4 s:2 m:1"><NCard size="small"><NStatistic label="今日请求" :value="1286" /></NCard></NGridItem>
    </NGrid>
    <div class="overview-grid">
      <NCard title="最近活动" size="small"><div v-for="item in activities" :key="item.title" class="activity-row"><div><strong>{{ item.title }}</strong><span>{{ item.text }}</span></div><time>{{ item.time }}</time></div></NCard>
      <NCard title="快速入口" size="small"><NSpace vertical :size="10"><RouterLink to="/crud/basic">打开基础 CRUD</RouterLink><RouterLink to="/crud/compute">查看动态计算示例</RouterLink></NSpace></NCard>
    </div>
  </div>
</template>
<style scoped>
.overview-page { display: grid; width: 100%; gap: 16px; padding: 20px 24px; }
.overview-heading { margin-bottom: 2px; }
.overview-heading h1 { margin: 0 0 5px; font-size: 24px; font-weight: 650; }
.overview-heading p { margin: 0; color: #7b879a; font-size: 13px; }
.overview-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
.activity-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #edf0f5; }
.activity-row:last-child { border-bottom: 0; }
.activity-row div { display: grid; gap: 3px; }
.activity-row span, .activity-row time { color: #7b879a; font-size: 12px; }
a { color: var(--fn-color-primary, #18a058); text-decoration: none; }
@media (max-width: 760px) { .overview-grid { grid-template-columns: 1fr; } }
</style>
