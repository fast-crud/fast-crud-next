<script setup lang="tsx">
import { theme } from "ant-design-vue";
import { useAntdvTheme } from "@fast-crud/fast-crud-next";

const { token } = theme.useToken();
useAntdvTheme(token);
</script>

<template>
  <slot />
</template>
