<script setup lang="ts">
import { watchEffect } from 'vue'
import { FnConfigProvider } from '@fast-crud/fast-crud-next'
import { useElementTheme } from '@fast-crud/fast-crud-next/theme/element'
import { adminPreferences } from '@fast-crud/fn-admin-shared/preferences'
import AdminLayout from './layouts/AdminLayout.vue'

useElementTheme()
watchEffect(() => {
  document.documentElement.classList.toggle('dark', adminPreferences.dark)
})
</script>

<template><FnConfigProvider><AdminLayout /></FnConfigProvider></template>
