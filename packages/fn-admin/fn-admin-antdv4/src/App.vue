<script setup lang="ts">
import { App as AntApp, ConfigProvider, theme as antTheme } from "ant-design-vue";
import { FnConfigProvider } from "@fast-crud/fast-crud-next";
import { adminPreferences } from "@fast-crud/fn-admin-shared/preferences";
import AdminLayout from "./layouts/AdminLayout.vue";
import AntdvThemeBridge from "./AntdvThemeBridge.vue";
</script>

<template>
  <ConfigProvider :theme="{ algorithm: adminPreferences.dark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm }">
    <AntApp>
      <FnConfigProvider>
        <AntdvThemeBridge>
          <AdminLayout />
        </AntdvThemeBridge>
      </FnConfigProvider>
    </AntApp>
  </ConfigProvider>
</template>
