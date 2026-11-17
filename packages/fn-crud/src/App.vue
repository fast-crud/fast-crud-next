<script setup lang="ts">
import { computed, markRaw, reactive, ref } from "vue";
import { FnConfigProvider, FnCrud, FnInput, type FnCrudOptionsInput, type FnTablePageQuery, type FnTablePageResult, useFnCrud } from "./crud";
import { DictStore } from "./crud";

interface ServiceRecord {
  id: number;
  name: string;
  owner: string;
  environment: string;
  status: string;
  updatedAt: string;
}

const statusDict = markRaw(new DictStore({
  data: [
    { label: "运行中", value: "running" },
    { label: "待发布", value: "staged" },
    { label: "已暂停", value: "paused" },
  ],
}));
const records = ref<ServiceRecord[]>([
  { id: 1042, name: "证书自动续期", owner: "平台组", environment: "生产", status: "running", updatedAt: "2026-11-16 10:42" },
  { id: 1038, name: "边缘节点同步", owner: "基础设施", environment: "生产", status: "running", updatedAt: "2026-11-16 09:18" },
  { id: 1029, name: "域名健康检查", owner: "平台组", environment: "预发布", status: "staged", updatedAt: "2026-11-15 17:36" },
  { id: 1017, name: "旧证书清理", owner: "安全组", environment: "生产", status: "paused", updatedAt: "2026-11-15 14:05" },
  { id: 1004, name: "站点可用性巡检", owner: "运维组", environment: "测试", status: "running", updatedAt: "2026-11-14 11:27" },
  { id: 998, name: "DNS 配置核验", owner: "基础设施", environment: "预发布", status: "staged", updatedAt: "2026-11-13 16:50" },
]);
const selectedCount = ref(0);
const crudState = reactive<FnCrudOptionsInput<ServiceRecord>>({
  id: "service-registry-demo",
  columns: {
    id: { key: "id", title: "编号", cell: { width: 90 } },
    name: {
      key: "name",
      title: "服务名称",
      search: { order: 1, component: { name: FnInput, vModel: "modelValue", placeholder: "搜索服务名称或负责人" }, width: 240 },
      form: { order: 1, span: 12, rules: [{ required: true, message: "请输入服务名称" }] },
      cell: { order: 1 },
    },
    owner: { key: "owner", title: "负责人", form: { order: 2, span: 12, rules: [{ required: true, message: "请输入负责人" }] }, cell: { order: 2, width: 130 } },
    environment: { key: "environment", title: "环境", form: { order: 3, span: 12 }, cell: { order: 3, width: 120 } },
    status: { key: "status", title: "状态", form: { order: 4, span: 12 }, cell: { order: 4, width: 120, dict: statusDict, render: ({ row }) => statusLabel(row.status) } },
    updatedAt: { key: "updatedAt", title: "最近更新", cell: { order: 5, width: 170 } },
  },
  search: { buttons: undefined },
  tabs: {
    refCol: "status",
    tabs: { "": { label: "全部服务", value: "" } },
  },
  table: { rowKey: "id", minWidth: 850 },
  rowHandle: { width: 150 },
  rowSelect: { crossPage: true, onChange: keys => { selectedCount.value = keys.length; } },
  pagination: { current: 1, pageSize: 5, pageSizeOptions: ["5", "10", "20"] },
  request: {
    pageRequest: async ({ page, query, sort }: FnTablePageQuery): Promise<FnTablePageResult<ServiceRecord>> => {
      const search = String(query.name || "").trim().toLocaleLowerCase();
      const searchFiltered = records.value.filter(record => !search || `${record.name} ${record.owner}`.toLocaleLowerCase().includes(search));
      const tabsCounts = Object.fromEntries([
        ["", searchFiltered.length],
        ...statusDict.getOptions().value.map(option => [String(option.value), searchFiltered.filter(record => record.status === option.value).length]),
      ]);
      let filtered = searchFiltered;
      if (query.status) filtered = filtered.filter(record => record.status === query.status);
      if (sort?.prop) filtered = [...filtered].sort((left, right) => String(left[sort.prop as keyof ServiceRecord]).localeCompare(String(right[sort.prop as keyof ServiceRecord])) * (sort.asc ? 1 : -1));
      return { records: filtered.slice(page.offset, page.offset + page.limit), total: filtered.length, tabsCounts };
    },
    addRequest: async form => {
      const nextId = Math.max(...records.value.map(record => record.id), 0) + 1;
      records.value.unshift({ id: nextId, name: String(form.name), owner: String(form.owner), environment: String(form.environment || "测试"), status: String(form.status || "staged"), updatedAt: now() });
    },
    editRequest: async form => {
      const id = Number(form.id);
      records.value = records.value.map(record => record.id === id ? { ...record, name: String(form.name), owner: String(form.owner), environment: String(form.environment), status: String(form.status), updatedAt: now() } : record);
    },
    delRequest: async id => {
      records.value = records.value.filter(record => record.id !== Number(id));
    },
  },
});
useFnCrud(crudState);

const statusCounts = computed(() => ({
  total: records.value.length,
  running: records.value.filter(record => record.status === "running").length,
  staged: records.value.filter(record => record.status === "staged").length,
  paused: records.value.filter(record => record.status === "paused").length,
}));
function now(): string {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "short", timeStyle: "short", hour12: false }).format(new Date());
}
function statusLabel(status: string): string {
  return statusDict.getOptions().value.find(option => option.value === status)?.label || status;
}
</script>

<template>
  <FnConfigProvider>
    <main class="app-shell">
      <header class="page-header">
        <div>
          <p class="eyebrow">FAST CRUD NEXT</p>
          <h1>服务目录</h1>
          <p class="subtitle">管理服务状态、负责人和部署环境。</p>
        </div>
        <div class="header-meta">
          <span class="live-indicator"></span>
          <span>本地示例数据</span>
        </div>
      </header>

      <section class="overview" aria-label="服务概览">
        <div><span>服务总数</span><strong>{{ statusCounts.total }}</strong></div>
        <div><span>运行中</span><strong class="green">{{ statusCounts.running }}</strong></div>
        <div><span>待发布</span><strong class="amber">{{ statusCounts.staged }}</strong></div>
        <div><span>已暂停</span><strong>{{ statusCounts.paused }}</strong></div>
      </section>

      <section class="workspace">
        <div class="workspace-heading">
          <div>
            <h2>服务列表</h2>
            <p>共 {{ statusCounts.total }} 个服务<span v-if="selectedCount">，已选择 {{ selectedCount }} 项</span></p>
          </div>
        </div>
        <FnCrud v-bind="crudState" />
      </section>
      <footer class="page-footer"><span>Fast Crud Next</span><span>Vue 3 · FnCrud</span></footer>
    </main>
  </FnConfigProvider>
</template>

<style lang="less">
#app {
  min-height: 100vh;
}
.app-shell {
  width: min(1440px, 100%);
  min-height: 100vh;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 40px 48px 24px;
  color: #202b3c;
  background: #f5f7fa;
  font: 14px/1.5 Inter, "Segoe UI", sans-serif;
  .page-header,
  .workspace-heading,
  .page-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .eyebrow {
    margin: 0 0 8px;
    color: #68768a;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
  }
  h1,
  h2,
  p {
    margin-top: 0;
  }
  h1 {
    margin-bottom: 4px;
    color: #142033;
    font-size: 28px;
    font-weight: 650;
  }
  .subtitle,
  .workspace-heading p {
    margin-bottom: 0;
    color: #718096;
  }
  .header-meta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #68768a;
  }
  .live-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #12a878;
  }
  .overview {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin: 30px 0 22px;
    border: 1px solid #e0e6ee;
    border-radius: 8px;
    background: #fff;
    > div {
      display: grid;
      gap: 8px;
      padding: 18px 22px;
      border-right: 1px solid #edf0f4;
    }
    > div:last-child { border-right: 0; }
    span { color: #718096; }
    strong { color: #202b3c; font-size: 24px; line-height: 1.1; }
    strong.green { color: #13845e; }
    strong.amber { color: #b66c16; }
  }
  .workspace {
    min-height: 580px;
    overflow: hidden;
    border: 1px solid #e0e6ee;
    border-radius: 8px;
    background: #fff;
  }
  .workspace-heading {
    min-height: 64px;
    padding: 0 22px;
    border-bottom: 1px solid #edf0f4;
    h2 { margin-bottom: 2px; color: #202b3c; font-size: 16px; font-weight: 600; }
    p { font-size: 12px; }
  }
  .fn-crud { padding: 10px 18px 14px; }
  .page-footer {
    padding-top: 18px;
    color: #8a95a6;
    font-size: 12px;
  }
  @media (max-width: 700px) {
    padding: 24px 16px;
    .header-meta { display: none; }
    .overview { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .overview > div:nth-child(2) { border-right: 0; }
    .overview > div:nth-child(-n + 2) { border-bottom: 1px solid #edf0f4; }
  }
}
</style>
