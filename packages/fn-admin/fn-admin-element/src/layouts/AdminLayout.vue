<template>
  <el-container class="admin-shell" :class="{ dark: adminPreferences.dark }">
    <el-aside :width="collapsed ? '72px' : '236px'" class="admin-aside">
      <div class="brand-mark">
        <span class="brand-mark__dot" aria-hidden="true"></span>
        <span v-if="!collapsed" class="brand-mark__name">FN ADMIN</span>
      </div>
      <el-menu :default-active="route.path" :collapse="collapsed" class="admin-menu" @select="goTo">
        <el-menu-item index="/dashboard"><span>{{ adminText('工作台', 'Dashboard') }}</span></el-menu-item>
        <el-menu-item-group :title="adminText('CRUD 示例', 'CRUD examples')">
          <el-menu-item index="/crud/basic"><span>{{ adminText('基础列表', 'Basic list') }}</span></el-menu-item>
          <el-menu-item index="/crud/mock"><span>{{ adminText('请求 Mock', 'Request mock') }}</span></el-menu-item>
          <el-menu-item index="/crud/compute"><span>{{ adminText('动态计算', 'Dynamic calculations') }}</span></el-menu-item>
          <el-menu-item index="/crud/dictionary"><span>{{ adminText('字典与筛选', 'Dictionary and filters') }}</span></el-menu-item>
          <el-menu-item index="/crud/selection"><span>{{ adminText('跨页批量操作', 'Cross-page batch actions') }}</span></el-menu-item>
          <el-menu-item index="/crud/conditional-form"><span>{{ adminText('条件表单', 'Conditional forms') }}</span></el-menu-item>
        </el-menu-item-group>
        <el-menu-item index="/components/table-buttons"><span>{{ adminText('组件对比', 'Component comparison') }}</span></el-menu-item>
        <el-menu-item index="/settings"><span>{{ adminText('系统设置', 'Settings') }}</span></el-menu-item>
      </el-menu>
      <div v-if="!collapsed" class="aside-footer">Vue 3 · FnCrud</div>
    </el-aside>
    <el-container class="admin-content">
      <el-header class="admin-header">
        <div class="header-left">
          <el-button text class="collapse-button" :aria-label="adminText(collapsed ? '展开菜单' : '收起菜单', collapsed ? 'Expand menu' : 'Collapse menu')" @click="collapsed = !collapsed"><el-icon><component :is="collapsed ? PanelLeftOpen : PanelLeftClose" /></el-icon></el-button>
          <el-breadcrumb separator="/"><el-breadcrumb-item>{{ adminText('控制台', 'Console') }}</el-breadcrumb-item><el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item></el-breadcrumb>
        </div>
        <div class="header-right">
          <el-button text @click="toggleAdminLanguage"><el-icon><Languages /></el-icon>{{ adminPreferences.language === 'zh' ? 'EN' : '中文' }}</el-button>
          <el-button text :aria-label="adminText('切换明暗主题', 'Toggle color theme')" @click="toggleAdminTheme"><el-icon><component :is="adminPreferences.dark ? Sun : Moon" /></el-icon></el-button>
          <el-tag type="success" effect="plain">{{ adminText('本地演示', 'Local demo') }}</el-tag>
          <span class="user-name">{{ adminText('管理员', 'Administrator') }}</span>
          <el-button text @click="goTo('/settings')">{{ adminText('账户设置', 'Account settings') }}</el-button>
        </div>
      </el-header>
      <el-main class="admin-main" :class="{ 'admin-main--full': route.path.startsWith('/crud/') }"><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Languages, Moon, PanelLeftClose, PanelLeftOpen, Sun } from '@lucide/vue'
import { adminPreferences, adminText, toggleAdminLanguage, toggleAdminTheme } from '@fast-crud/fn-admin-shared/preferences'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const titles: Record<string, [string, string]> = {
  '/dashboard': ['工作台', 'Dashboard'], '/crud/basic': ['基础列表', 'Basic list'], '/crud/mock': ['请求 Mock', 'Request mock'],
  '/crud/compute': ['动态计算', 'Dynamic calculations'], '/crud/dictionary': ['字典与筛选', 'Dictionary and filters'],
  '/crud/selection': ['跨页批量操作', 'Cross-page batch actions'], '/crud/conditional-form': ['条件表单', 'Conditional forms'],
  '/components/table-buttons': ['组件对比', 'Component comparison'], '/settings': ['系统设置', 'Settings'],
}
const currentTitle = computed(() => { const [zh, en] = titles[route.path] || ['管理控制台', 'Admin console']; return adminText(zh, en) })

function goTo(path: string): void {
  if (path !== route.path) void router.push(path)
}
</script>

<style lang="less">
.admin-shell {
  height: 100vh;
  background: #f3f6fa;

  &.dark {
    --el-bg-color: #141b26;
    --el-bg-color-page: #101720;
    --el-bg-color-overlay: #1b2532;
    --el-color-white: transparent;
    --el-text-color-primary: rgba(255, 255, 255, .88);
    --el-text-color-regular: rgba(255, 255, 255, .68);
    --el-border-color: #303c4c;
    --el-border-color-light: #263241;
    background: #101720;
    color: rgba(255, 255, 255, .88);
    .admin-header { background: #141b26; border-color: #303c4c; }
    .admin-main { background: #101720; }
    .el-button.is-text { background: transparent; }
  }

  .admin-aside { display: flex; flex-direction: column; background: #122033; color: #d8e4f3; transition: width .2s ease; }
  .brand-mark { display: flex; height: 70px; align-items: center; gap: 10px; padding: 0 22px; border-bottom: 1px solid rgba(255, 255, 255, .08); box-sizing: border-box; }
  .brand-mark__dot { width: 12px; height: 12px; flex: none; border-radius: 50%; background: #e98a35; box-shadow: 0 0 0 5px rgba(233, 138, 53, .18); }
  .brand-mark__name { color: #fff; font-size: 14px; font-weight: 700; letter-spacing: .12em; white-space: nowrap; }
  .admin-menu { flex: 1; border-right: 0; background: transparent; --el-menu-text-color: #b5c5d8; --el-menu-hover-bg-color: #1e334c; --el-menu-active-color: #fff; --el-menu-bg-color: transparent; }
  .admin-menu .el-menu-item { height: 44px; margin: 3px 10px; border-radius: 5px; }
  .admin-menu .el-menu-item-group__title { padding: 17px 22px 5px; color: #74879b; font-size: 11px; }
  .admin-menu .el-menu-item.is-active { background: #25547d; }
  .aside-footer { padding: 18px 22px; border-top: 1px solid rgba(255, 255, 255, .08); color: #748aa2; font-size: 12px; }
  .admin-content { min-width: 0; height: 100vh; }
  .admin-header { display: flex; height: 70px; align-items: center; justify-content: space-between; gap: 20px; padding: 0 30px; border-bottom: 1px solid #e1e7ef; background: #fff; }
  .header-left, .header-right { display: flex; align-items: center; gap: 16px; }
  .collapse-button { color: #42546a; }
  h1 { margin: 0; color: #19273a; font-size: 19px; font-weight: 650; }
  .user-name { color: #516176; font-size: 13px; }
  .admin-main { display: flex; min-height: 0; flex-direction: column; padding: 0; overflow: auto; }
  .admin-main--full { overflow: hidden; }

  @media (max-width: 720px) {
    .admin-header { padding: 0 16px; }
    .header-right .user-name { display: none; }
    .admin-main { padding: 0; }
  }
}
</style>
