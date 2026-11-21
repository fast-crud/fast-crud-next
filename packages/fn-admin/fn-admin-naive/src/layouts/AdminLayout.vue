<script setup lang="ts">
import { computed, h, ref, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { createDiscreteApi, NAvatar, NButton, NDropdown, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMenu, NSpace, NTag } from "naive-ui";
import { ChevronDown, Languages, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "@lucide/vue";
import { adminPreferences, adminText, toggleAdminLanguage, toggleAdminTheme } from "@fast-crud/fn-admin-shared/preferences";
import { adminMenuConfig, type AdminPageConfig } from "../router/config";

const route = useRoute(); const router = useRouter(); const { message } = createDiscreteApi(["message"]);
const collapsed = ref(false);
type MenuOption = { label: string; key: string; disabled?: boolean; icon?: () => ReturnType<typeof h>; children?: MenuOption[] };
function toMenuOptions(config: AdminPageConfig[]): MenuOption[] {
  return config.map(({ key, path, title, icon, disabled, children }) => ({
    label: adminText(...title),
    key: path || key,
    disabled,
    icon: icon ? () => h(icon, { size: 16 }) : undefined,
    children: children ? toMenuOptions(children) : undefined,
  }));
}
const menuOptions = computed(() => toMenuOptions(adminMenuConfig));
const selectedKey = computed(() => route.path);
const expandedKeys = ref<string[]>(["crud"]);
watch(() => route.path, path => { if (path.startsWith("/crud/")) expandedKeys.value = ["crud"]; });
const pageTitle = computed(() => {
  const [zh, en] = route.meta.title as [string, string] | undefined || ["工作台", "Dashboard"];
  return adminText(zh, en);
});
const userOptions = computed(() => [{ label: adminText("个人设置", "Personal settings"), key: "settings" }, { label: adminText("退出登录", "Sign out"), key: "logout" }]);
function navigate(path: string) { void router.push(path); }
function handleUserAction(key: string) { if (key === "logout") message.info("演示项目未连接登录服务"); if (key === "settings") message.info("个人设置页面将在接入认证后启用"); }
</script>
<template>
        <div class="admin-app" :class="{ 'admin-app--dark': adminPreferences.dark, dark: adminPreferences.dark }"><NLayout has-sider position="absolute" class="admin-layout">
        <NLayoutSider bordered collapse-mode="width" :collapsed-width="64" :width="236" :collapsed="collapsed" class="admin-sider">
          <div class="brand" @click="navigate('/dashboard')"><div class="brand-mark">F</div><div v-if="!collapsed" class="brand-copy"><strong>Fn Admin</strong><span>Naive Console</span></div></div>
          <NMenu :value="selectedKey" :options="menuOptions" :expanded-keys="expandedKeys" @update:value="navigate" @update:expanded-keys="expandedKeys = $event" /><div v-if="!collapsed" class="sider-foot"><span class="status-dot"></span>{{ adminText('服务运行正常', 'All services operational') }}</div>
        </NLayoutSider>
        <NLayout class="admin-main"><NLayoutHeader bordered class="admin-header"><div class="header-left"><NButton quaternary circle :aria-label="adminText('折叠菜单', 'Collapse menu')" @click="collapsed = !collapsed"><component :is="collapsed ? PanelLeftOpen : PanelLeftClose" :size="17" /></NButton><div><span class="breadcrumb-root">{{ adminText('控制台', 'Console') }}</span><span class="breadcrumb-separator">/</span><strong>{{ pageTitle }}</strong></div></div><NSpace align="center" :size="14"><NTag size="small" type="info" :bordered="false">{{ adminText('本地演示', 'Local demo') }}</NTag><NButton quaternary size="small" @click="toggleAdminLanguage"><Languages :size="16" />{{ adminPreferences.language === 'zh' ? 'EN' : '中文' }}</NButton><NButton quaternary circle :aria-label="adminText('切换明暗主题', 'Toggle color theme')" @click="toggleAdminTheme"><component :is="adminPreferences.dark ? Sun : Moon" :size="16" /></NButton><NDropdown :options="userOptions" @select="handleUserAction"><button class="user-trigger" type="button"><NAvatar round size="small" color="var(--n-primary-color, #18a058)">A</NAvatar><span>{{ adminText('管理员', 'Administrator') }}</span><ChevronDown :size="14" class="chevron" /></button></NDropdown></NSpace></NLayoutHeader><NLayoutContent class="admin-content" content-style="height:calc(100vh - 68px);padding:0;display:flex;flex-direction:column;min-height:0;"><RouterView /></NLayoutContent></NLayout>
</NLayout></div>
</template>
<style lang="less">
.admin-app {
  min-height: 100vh;
  color: #1d2a3a;
  background: #f4f7fb;

  &--dark {
    color: #eef3ff;
    background: #111827;

    .admin-sider,
    .n-layout-header {
      color: #eef3ff !important;
      border-color: #2b3a53 !important;
      background: #151f31 !important;
    }

    .brand { border-color: #2b3a53; }
    .admin-header { background: rgba(21, 31, 49, .92); }
    .n-layout-sider-scroll-container { background: #151f31 !important; }
    .n-layout-content { background: #111827 !important; }
    .n-menu { background: transparent !important; }
  }

  .admin-layout { height: 100vh; }
  .admin-sider { display: flex; flex-direction: column; background: #fff; }
  .brand { display: flex; align-items: center; gap: 11px; height: 68px; padding: 0 18px; border-bottom: 1px solid #e6ebf2; cursor: pointer; }
  .brand-mark { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 8px; color: white; background: var(--n-primary-color, #18a058); font-size: 18px; font-weight: 800; }
  .brand-copy { display: grid; gap: 2px; }
  .brand-copy strong { font-size: 15px; }
  .brand-copy span { color: #8a96a8; font-size: 11px; }
  .sider-foot { margin-top: auto; padding: 16px 20px; border-top: 1px solid #e6ebf2; color: #728096; font-size: 12px; }
  .status-dot { display: inline-block; width: 7px; height: 7px; margin-right: 7px; border-radius: 50%; background: var(--n-success-color, #20b486); }
  .admin-main { background: transparent; }
  .admin-header { display: flex; height: 68px; align-items: center; justify-content: space-between; padding: 0 28px; background: rgba(255, 255, 255, .9); backdrop-filter: blur(8px); }
  .header-left,
  .header-left > div { display: flex; align-items: center; }
  .header-left { gap: 12px; }
  .breadcrumb-root { color: #8a96a8; }
  .breadcrumb-separator { padding: 0 10px; color: #b4bdca; }
  .user-trigger { display: inline-flex; align-items: center; gap: 8px; border: 0; color: inherit; background: transparent; cursor: pointer; font: inherit; }
  .chevron { color: #8a96a8; }
  .admin-content { min-height: 0; }

  @media (max-width: 760px) {
    .admin-header { padding: 0 14px; }
    .user-trigger span:not(.chevron) { display: none; }
  }
}
</style>
