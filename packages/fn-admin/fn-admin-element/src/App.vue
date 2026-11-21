<script setup lang="ts">
import { FnConfigProvider } from '@fast-crud/fast-crud-next'
import { useElementTheme } from '@fast-crud/fast-crud-next/theme/element'
import AdminLayout from './layouts/AdminLayout.vue'

useElementTheme()
</script>

<template><FnConfigProvider><AdminLayout /></FnConfigProvider></template>
