<script setup lang="ts">
import { darkTheme, NConfigProvider, NMessageProvider } from "naive-ui";
import { FnConfigProvider } from "@fast-crud/fast-crud-next";
import AdminLayout from "./layouts/AdminLayout.vue";
import NaiveThemeBridge from "./components/NaiveThemeBridge.vue";
import { adminPreferences } from "@fast-crud/fn-admin-shared/preferences";
</script>

<template>
  <NConfigProvider :theme="adminPreferences.dark ? darkTheme : null">
    <NaiveThemeBridge>
      <NMessageProvider>
        <FnConfigProvider><AdminLayout /></FnConfigProvider>
      </NMessageProvider>
    </NaiveThemeBridge>
  </NConfigProvider>
</template>
