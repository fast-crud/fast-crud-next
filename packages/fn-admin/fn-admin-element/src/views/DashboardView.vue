<template>
  <div class="view-page dashboard-page">
    <div class="page-intro"><div><p class="eyebrow">OVERVIEW</p><h2>工作台</h2><p>查看本地示例数据的运行概况与最近动态。</p></div></div>
    <div class="metric-grid">
      <el-card v-for="metric in metrics" :key="metric.label" shadow="never" class="metric-card"><span>{{ metric.label }}</span><strong>{{ metric.value }}</strong><small>{{ metric.note }}</small></el-card>
    </div>
    <el-card shadow="never" class="activity-card"><template #header><div class="card-title"><strong>最近活动</strong><span>本地内存数据</span></div></template><div class="activity-row" v-for="item in activity" :key="item.time"><span class="activity-dot"></span><div><strong>{{ item.title }}</strong><p>{{ item.detail }}</p></div><time>{{ item.time }}</time></div></el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const metrics = computed(() => [
  { label: '已注册服务', value: '12', note: '全部环境' },
  { label: '运行中', value: '8', note: '较昨日 +1' },
  { label: '待处理任务', value: '4', note: '需要关注' },
  { label: '成功率', value: '98.4%', note: '过去 24 小时' },
])
const activity = [
  { title: '证书自动续期', detail: '生产环境检查完成', time: '10:42' },
  { title: '边缘节点同步', detail: '完成 18 个节点同步', time: '09:18' },
  { title: '域名健康检查', detail: '发现 1 个待发布结果', time: '昨日 17:36' },
]
</script>

<style lang="less">
.view-page {
  width: 100%;
  margin: 0;
  padding: 24px;

  .page-intro { display: flex; justify-content: space-between; margin-bottom: 24px; }
  .eyebrow { margin: 0 0 6px; color: #e1782d; font-size: 11px; font-weight: 700; letter-spacing: .14em; }
  h2 { margin: 0 0 6px; color: #19273a; font-size: 25px; }
  .page-intro p:last-child { margin: 0; color: #758397; }
  .metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 18px; }
  .metric-card {
    .el-card__body { display: grid; gap: 9px; padding: 20px; }
    span { color: #708095; font-size: 13px; }
    strong { color: #19273a; font-size: 28px; font-variant-numeric: tabular-nums; }
    small { color: #a0acba; }
  }
  .activity-card .el-card__header { padding: 16px 20px; }
  .card-title { display: flex; align-items: center; justify-content: space-between; }
  .card-title span { color: #9aa6b5; font-size: 12px; }
  .activity-row {
    display: grid;
    grid-template-columns: 10px 1fr auto;
    gap: 14px;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #eef1f5;
    &:last-child { border-bottom: 0; }
    strong { color: #2d3b50; font-size: 14px; }
    p { margin: 3px 0 0; color: #8794a5; font-size: 12px; }
    time { color: #9ca8b6; font-size: 12px; }
  }
  .activity-dot { width: 8px; height: 8px; border-radius: 50%; background: #e1782d; }

  @media (max-width: 800px) {
    .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
}
</style>
