<script setup lang="ts">
import { computed, h, ref, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { createDiscreteApi, darkTheme, NAvatar, NButton, NConfigProvider, NDropdown, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMenu, NSpace, NTag, NMessageProvider } from "naive-ui";
import { ChevronDown, Database, Languages, LayoutDashboard, Moon, PanelLeftClose, PanelLeftOpen, Settings, Sun } from "@lucide/vue";
import { FnConfigProvider } from "../../../fn-crud/src/crud";
import NaiveThemeBridge from "./components/NaiveThemeBridge.vue";
import { adminPreferences, adminText, toggleAdminLanguage, toggleAdminTheme } from "@fast-crud/fn-admin-shared/preferences";

const route = useRoute(); const router = useRouter(); const { message } = createDiscreteApi(["message"]);
const collapsed = ref(false);
const menuOptions = computed(() => [
  { label: adminText("工作台", "Dashboard"), key: "/overview", icon: () => h(LayoutDashboard, { size: 16 }) },
  { label: adminText("CRUD 示例", "CRUD examples"), key: "crud", icon: () => h(Database, { size: 16 }), children: [
    { label: adminText("基础列表", "Basic list"), key: "/crud/basic" }, { label: adminText("动态计算", "Dynamic calculations"), key: "/crud/compute" },
    { label: adminText("字典与筛选", "Dictionary and filters"), key: "/crud/dictionary" }, { label: adminText("跨页批量操作", "Cross-page batch actions"), key: "/crud/selection" },
    { label: adminText("条件表单", "Conditional forms"), key: "/crud/conditional-form" },
  ] },
  { label: adminText("组件对比", "Component comparison"), key: "/components/table-buttons", icon: () => h(Settings, { size: 16 }) },
]);
const selectedKey = computed(() => route.path);
const expandedKeys = ref<string[]>(["crud"]);
watch(() => route.path, path => { if (path.startsWith("/crud/")) expandedKeys.value = ["crud"]; });
const pageTitles: Record<string, [string, string]> = { "/overview": ["工作台", "Dashboard"], "/crud/basic": ["基础列表", "Basic list"], "/crud/compute": ["动态计算", "Dynamic calculations"], "/crud/dictionary": ["字典与筛选", "Dictionary and filters"], "/crud/selection": ["跨页批量操作", "Cross-page batch actions"], "/crud/conditional-form": ["条件表单", "Conditional forms"], "/components/table-buttons": ["组件对比", "Component comparison"] };
const pageTitle = computed(() => { const [zh, en] = pageTitles[route.path] || pageTitles["/overview"]; return adminText(zh, en); });
const userOptions = computed(() => [{ label: adminText("个人设置", "Personal settings"), key: "settings" }, { label: adminText("退出登录", "Sign out"), key: "logout" }]);
function navigate(path: string) { void router.push(path); }
function handleUserAction(key: string) { if (key === "logout") message.info("演示项目未连接登录服务"); if (key === "settings") message.info("个人设置页面将在接入认证后启用"); }
</script>
<template>
  <NConfigProvider :theme="adminPreferences.dark ? darkTheme : null">
    <NaiveThemeBridge>
      <NMessageProvider>
        <FnConfigProvider>
        <div class="admin-app" :class="{ 'admin-app--dark': adminPreferences.dark, dark: adminPreferences.dark }"><NLayout has-sider position="absolute" class="admin-layout">
        <NLayoutSider bordered collapse-mode="width" :collapsed-width="64" :width="236" :collapsed="collapsed" class="admin-sider">
          <div class="brand" @click="navigate('/overview')"><div class="brand-mark">F</div><div v-if="!collapsed" class="brand-copy"><strong>Fn Admin</strong><span>Naive Console</span></div></div>
          <NMenu :value="selectedKey" :options="menuOptions" :expanded-keys="expandedKeys" @update:value="navigate" @update:expanded-keys="expandedKeys = $event" /><div v-if="!collapsed" class="sider-foot"><span class="status-dot"></span>{{ adminText('服务运行正常', 'All services operational') }}</div>
        </NLayoutSider>
        <NLayout class="admin-main"><NLayoutHeader bordered class="admin-header"><div class="header-left"><NButton quaternary circle :aria-label="adminText('折叠菜单', 'Collapse menu')" @click="collapsed = !collapsed"><component :is="collapsed ? PanelLeftOpen : PanelLeftClose" :size="17" /></NButton><div><span class="breadcrumb-root">{{ adminText('控制台', 'Console') }}</span><span class="breadcrumb-separator">/</span><strong>{{ pageTitle }}</strong></div></div><NSpace align="center" :size="14"><NTag size="small" type="info" :bordered="false">{{ adminText('本地演示', 'Local demo') }}</NTag><NButton quaternary size="small" @click="toggleAdminLanguage"><Languages :size="16" />{{ adminPreferences.language === 'zh' ? 'EN' : '中文' }}</NButton><NButton quaternary circle :aria-label="adminText('切换明暗主题', 'Toggle color theme')" @click="toggleAdminTheme"><component :is="adminPreferences.dark ? Sun : Moon" :size="16" /></NButton><NDropdown :options="userOptions" @select="handleUserAction"><button class="user-trigger" type="button"><NAvatar round size="small" color="var(--n-primary-color, #18a058)">A</NAvatar><span>{{ adminText('管理员', 'Administrator') }}</span><ChevronDown :size="14" class="chevron" /></button></NDropdown></NSpace></NLayoutHeader><NLayoutContent class="admin-content" content-style="height:calc(100vh - 68px);padding:0;display:flex;flex-direction:column;min-height:0;"><RouterView /></NLayoutContent></NLayout>
</NLayout></div>
        </FnConfigProvider>
      </NMessageProvider>
    </NaiveThemeBridge>
  </NConfigProvider>
</template>
<style scoped>
.admin-app{min-height:100vh;color:#1d2a3a;background:#f4f7fb}.admin-app--dark{color:#eef3ff;background:#111827}.admin-layout{height:100vh}.admin-sider{display:flex;flex-direction:column;background:#fff}.admin-app--dark .admin-sider{background:#151f31}.brand{display:flex;align-items:center;gap:11px;height:68px;padding:0 18px;border-bottom:1px solid #e6ebf2;cursor:pointer}.admin-app--dark .brand{border-color:#2b3a53}.brand-mark{display:grid;place-items:center;width:32px;height:32px;border-radius:8px;background:var(--n-primary-color,#18a058);color:white;font-size:18px;font-weight:800}.brand-copy{display:grid;gap:2px}.brand-copy strong{font-size:15px}.brand-copy span{color:#8a96a8;font-size:11px}.sider-foot{margin-top:auto;padding:16px 20px;border-top:1px solid #e6ebf2;color:#728096;font-size:12px}.status-dot{display:inline-block;width:7px;height:7px;margin-right:7px;border-radius:50%;background:var(--n-success-color,#20b486)}.admin-main{background:transparent}.admin-header{display:flex;align-items:center;justify-content:space-between;height:68px;padding:0 28px;background:rgba(255,255,255,.9);backdrop-filter:blur(8px)}.admin-app--dark .admin-header{background:rgba(21,31,49,.92)}.header-left,.header-left>div{display:flex;align-items:center}.header-left{gap:12px}.breadcrumb-root{color:#8a96a8}.breadcrumb-separator{padding:0 10px;color:#b4bdca}.user-trigger{display:inline-flex;align-items:center;gap:8px;border:0;background:transparent;color:inherit;cursor:pointer;font:inherit}.chevron{color:#8a96a8}.admin-content{min-height:0}@media (max-width:760px){.admin-header{padding:0 14px}.user-trigger span:not(.chevron){display:none}}
.admin-app--dark :deep(.n-layout-header),.admin-app--dark :deep(.n-layout-sider){color:#eef3ff!important;background:#151f31!important;border-color:#2b3a53!important}.admin-app--dark :deep(.n-layout-sider-scroll-container){background:#151f31!important}.admin-app--dark :deep(.n-layout-content){background:#111827!important}.admin-app--dark :deep(.n-menu){background:transparent!important}
</style>
