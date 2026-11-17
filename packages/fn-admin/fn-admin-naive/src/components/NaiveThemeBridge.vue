<script setup lang="ts">
import { useThemeVars } from "naive-ui";
import { useNaiveTheme, type NaiveThemeTokens } from "@fast-crud/fast-crud-next/theme/naive";

const themeVars = useThemeVars();
useNaiveTheme(() => themeVars.value as unknown as NaiveThemeTokens);
</script>

<template>
  <slot />
</template>
