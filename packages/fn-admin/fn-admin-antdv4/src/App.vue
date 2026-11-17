<script setup lang="ts">
import { computed, h, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { App as AntApp, Avatar, Breadcrumb, Button, ConfigProvider, Layout, Menu, Space, Tag, theme as antTheme } from "ant-design-vue";
import { Bell, Database, Languages, LayoutDashboard, Moon, PanelLeftClose, PanelLeftOpen, Settings, Sun } from "@lucide/vue";
import { FnConfigProvider } from "../../../fn-crud/src/crud";
import { adminPreferences, adminText, toggleAdminLanguage, toggleAdminTheme } from "@fast-crud/fn-admin-shared/preferences";

const route = useRoute();
const router = useRouter();
const collapsed = ref(false);
const selectedKeys = computed(() => [route.path]);
const openKeys = computed(() => route.path.startsWith("/crud/") ? ["crud"] : []);
const menuItems = computed(() => [
  { key: "/dashboard", label: adminText("工作台", "Dashboard"), icon: LayoutDashboard },
  { key: "crud", label: adminText("CRUD 示例", "CRUD examples"), icon: Database, children: [
    { key: "/crud/basis/basic", label: adminText("基础列表", "Basic list") }, { key: "/crud/basis/request-mock", label: adminText("请求 Mock", "Request mock") }, { key: "/crud/basis/compute", label: adminText("动态计算", "Dynamic calculations") },
    { key: "/crud/dict/credentials", label: adminText("字典与筛选", "Dictionary and filters") }, { key: "/crud/feature/selection", label: adminText("跨页批量操作", "Cross-page batch actions") },
    { key: "/crud/form/conditional", label: adminText("条件表单", "Conditional forms") },
  ] },
  { key: "/components/table-buttons", label: adminText("组件对比", "Component comparison"), icon: Settings },
  { key: "settings", label: adminText("系统设置", "Settings"), icon: Settings, disabled: true },
]);
const items = computed(() => menuItems.value.map(item => ({ ...item, icon: item.icon ? () => h(item.icon, { size: 16 }) : undefined })));
const titleKeys: Record<string, [string, string]> = { "/dashboard": ["工作台", "Dashboard"], "/crud/basis/basic": ["基础列表", "Basic list"], "/crud/basis/request-mock": ["请求 Mock", "Request mock"], "/crud/basis/compute": ["动态计算", "Dynamic calculations"], "/crud/dict/credentials": ["字典与筛选", "Dictionary and filters"], "/crud/feature/selection": ["跨页批量操作", "Cross-page batch actions"], "/crud/form/conditional": ["条件表单", "Conditional forms"], "/components/table-buttons": ["组件对比", "Component comparison"] };
const currentTitle = computed(() => { const [zh, en] = titleKeys[route.path] || titleKeys["/dashboard"]; return adminText(zh, en); });
function onMenuClick({ key }: { key: string | number }): void { const path = String(key); if (path.startsWith("/")) void router.push(path); }
</script>

<template>
  <ConfigProvider :theme="{ algorithm: adminPreferences.dark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm }">
  <AntApp>
    <FnConfigProvider>
      <Layout class="admin-shell" :class="{ dark: adminPreferences.dark }">
        <Layout.Sider v-model:collapsed="collapsed" collapsible :trigger="null" breakpoint="lg" class="admin-sider">
          <div class="brand"><div class="brand-mark">F</div><span v-if="!collapsed">FN ADMIN</span></div>
          <Menu :selected-keys="selectedKeys" :open-keys="openKeys" :items="items" mode="inline" theme="dark" @click="onMenuClick" />
          <div v-if="!collapsed" class="sider-foot"><span class="status-dot"></span>服务运行正常</div>
        </Layout.Sider>
        <Layout>
          <Layout.Header class="admin-header">
            <div class="header-left"><Button type="text" class="collapse-button" :icon="h(collapsed ? PanelLeftOpen : PanelLeftClose, { size: 17 })" :aria-label="adminText(collapsed ? '展开菜单' : '收起菜单', collapsed ? 'Expand menu' : 'Collapse menu')" @click="collapsed = !collapsed" /><Breadcrumb><Breadcrumb.Item>{{ adminText('控制台', 'Console') }}</Breadcrumb.Item><Breadcrumb.Item>{{ currentTitle }}</Breadcrumb.Item></Breadcrumb></div>
            <Space size="middle"><Button type="text" :icon="h(Bell, { size: 16 })" :aria-label="adminText('通知', 'Notifications')" /><Button type="text" :icon="h(Languages, { size: 16 })" :aria-label="adminText('切换语言', 'Switch language')" @click="toggleAdminLanguage">{{ adminPreferences.language === 'zh' ? 'EN' : '中文' }}</Button><Button type="text" :icon="h(adminPreferences.dark ? Sun : Moon, { size: 16 })" :aria-label="adminText('切换明暗主题', 'Toggle color theme')" @click="toggleAdminTheme" /><Tag color="blue">ANTDV 4</Tag><Avatar size="small" style="background-color: #155eef">F</Avatar><span class="user-name">{{ adminText('管理员', 'Administrator') }}</span></Space>
          </Layout.Header>
          <Layout.Content class="admin-content" :class="{ 'admin-content--full': route.path.startsWith('/crud/') }"><RouterView /></Layout.Content>
          <Layout.Footer class="admin-footer">Fn Admin · Vue 3 CRUD 控制台</Layout.Footer>
        </Layout>
      </Layout>
    </FnConfigProvider>
  </AntApp>
  </ConfigProvider>
</template>

<style scoped>
.admin-shell { min-height: 100vh; background: #f5f7fb; }
.admin-shell.dark { background: #141414; color: rgba(255,255,255,.85); }
.admin-sider { box-shadow: 1px 0 0 rgba(0, 0, 0, .08); z-index: 3; }
.brand { height: 64px; display: flex; align-items: center; gap: 10px; padding: 0 20px; color: #fff; font-weight: 700; letter-spacing: .08em; white-space: nowrap; }
.brand-mark { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 8px; background: #1677ff; font-size: 17px; }
.sider-foot { position: absolute; bottom: 18px; left: 20px; color: rgba(255,255,255,.55); font-size: 12px; }
.status-dot { display: inline-block; width: 7px; height: 7px; margin-right: 7px; border-radius: 50%; background: #52c41a; }
.admin-header { display: flex; justify-content: space-between; align-items: center; height: 64px; padding: 0 24px; background: #fff; border-bottom: 1px solid #e6eaf0; }
.header-left { display: flex; align-items: center; gap: 18px; min-width: 0; }
.collapse-button { font-size: 17px; }
.user-name { color: #344054; font-size: 13px; }
.admin-content { display: flex; flex-direction: column; padding: 24px; min-height: calc(100vh - 112px); overflow: auto; }
.admin-content--full { min-height: 0; padding: 0; overflow: hidden; }
.admin-shell.dark .admin-header { color: rgba(255,255,255,.85); background: #141414; border-color: #303030; }
.admin-shell.dark .admin-footer { color: rgba(255,255,255,.45); }
.admin-footer { padding: 12px 24px; color: #98a2b3; font-size: 12px; text-align: right; background: transparent; }
@media (max-width: 720px) { .admin-content:not(.admin-content--full) { padding: 16px; } .user-name { display: none; } }
</style>
