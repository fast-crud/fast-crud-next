<script setup lang="ts">
import { computed, h, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Avatar, Breadcrumb, Button, Layout, Menu, Space, Tag } from "ant-design-vue";
import type { VNode } from "vue";
import { Bell, Languages, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "@lucide/vue";
import { adminPreferences, toggleAdminLanguage, toggleAdminTheme } from "@fast-crud/fn-admin-shared/preferences";
import type { AdminMenuMessageKey } from "../locale";
import { adminMenuConfig, type AdminPageConfig } from "../router/config";

const route = useRoute();
const router = useRouter();
const { t } = useI18n({ useScope: "global" });
const collapsed = ref(false);
const selectedKeys = computed(() => [route.path]);
const openKeys = computed(() => route.path.startsWith("/crud/") ? ["crud"] : []);
type AdminMenuItem = { key: string; label: string; disabled?: boolean; icon?: () => VNode; children?: AdminMenuItem[] };
function toMenuItems(config: AdminPageConfig[]): AdminMenuItem[] {
  return config.map(({ key, titleKey, icon, disabled, children }) => ({
    key,
    label: t(`menu.${titleKey}`),
    disabled,
    icon: icon ? () => h(icon, { size: 16 }) : undefined,
    children: children ? toMenuItems(children) : undefined,
  }));
}
const items = computed(() => toMenuItems(adminMenuConfig));
const currentTitle = computed(() => {
  const titleKey = route.meta.titleKey as AdminMenuMessageKey | undefined;
  return t(`menu.${titleKey ?? "dashboard"}`);
});
function onMenuClick({ key }: { key: string | number }): void { const path = String(key); if (path.startsWith("/")) void router.push(path); }
</script>

<template>
  <Layout class="admin-shell" :class="{ dark: adminPreferences.dark }">
    <Layout.Sider v-model:collapsed="collapsed" collapsible :trigger="null" breakpoint="lg" class="admin-sider">
      <div class="brand"><div class="brand-mark">F</div><span v-if="!collapsed">FN ADMIN</span></div>
      <Menu :selected-keys="selectedKeys" :open-keys="openKeys" :items="items" mode="inline" theme="dark" @click="onMenuClick" />
      <div v-if="!collapsed" class="sider-foot"><span class="status-dot"></span>{{ t('layout.serviceStatus') }}</div>
    </Layout.Sider>
    <Layout style="height:100vh">
      <Layout.Header class="admin-header">
        <div class="header-left"><Button type="text" class="collapse-button" :icon="h(collapsed ? PanelLeftOpen : PanelLeftClose, { size: 17 })" :aria-label="collapsed ? t('layout.expandMenu') : t('layout.collapseMenu')" @click="collapsed = !collapsed" /><Breadcrumb><Breadcrumb.Item>{{ t('layout.console') }}</Breadcrumb.Item><Breadcrumb.Item>{{ currentTitle }}</Breadcrumb.Item></Breadcrumb></div>
        <Space size="middle"><Button type="text" :icon="h(Bell, { size: 16 })" :aria-label="t('layout.notifications')" /><Button type="text" :icon="h(Languages, { size: 16 })" :aria-label="t('layout.switchLanguage')" @click="toggleAdminLanguage">{{ t('layout.nextLanguage') }}</Button><Button type="text" :icon="h(adminPreferences.dark ? Sun : Moon, { size: 16 })" :aria-label="t('layout.toggleTheme')" @click="toggleAdminTheme" /><Tag color="blue">ANTDV 4</Tag><Avatar size="small" style="background-color: #155eef">F</Avatar><span class="user-name">{{ t('layout.administrator') }}</span></Space>
      </Layout.Header>
      <Layout.Content class="admin-content" :class="{ 'admin-content--full': route.path.startsWith('/crud/') }"><RouterView /></Layout.Content>
      <Layout.Footer class="admin-footer">{{ t('layout.footer') }}</Layout.Footer>
    </Layout>
  </Layout>
</template>

<style lang="less">
.admin-shell {
  height: 100vh;
  background: #f5f7fb;
  &.dark { background: #141414; color: rgba(255,255,255,.85); }
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
  &.dark .admin-header { color: rgba(255,255,255,.85); background: #141414; border-color: #303030; }
  &.dark .admin-footer { color: rgba(255,255,255,.45); }
  .admin-footer { padding: 12px 24px; color: #98a2b3; font-size: 12px; text-align: right; background: transparent; }
  @media (max-width: 720px) { .admin-content:not(.admin-content--full) { padding: 16px; } .user-name { display: none; } }
}
</style>
