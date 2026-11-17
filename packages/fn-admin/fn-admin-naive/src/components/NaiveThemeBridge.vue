<script setup lang="ts">
import { useThemeVars } from "naive-ui";
import { useNaiveTheme, type NaiveThemeTokens } from "../../../../fn-crud/src/crud/theme/naive";

const themeVars = useThemeVars();
useNaiveTheme(() => themeVars.value as unknown as NaiveThemeTokens);
</script>

<template>
  <slot />
</template>
