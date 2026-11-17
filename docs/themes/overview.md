# 主题适配

FnCrud 组件通过 `--fn-*` CSS 变量读取主题。默认 token 位于 `packages/fn-crud/src/theme/tokens.css`，应用可以直接覆盖这些变量，也可以使用已有适配器。

## 直接覆盖 token

```css
:root {
  --fn-color-primary: #18a058;
  --fn-color-bg-container: #ffffff;
  --fn-color-border: #d9e2dc;
}
```

组件内部的按钮、输入框、分页和表格会读取这些变量。主题切换时应同时更新文字、背景、边框和主色，不要只替换按钮颜色。

Naive 适配器会把 `common.borderRadius` 映射为 `--fn-border-radius`；FnCrud 按钮、输入框、分页按钮和选择器使用该 token，因此跟随 `NConfigProvider` 当前主题的圆角设置。

## Naive UI

`useNaiveTheme` 必须在 `NConfigProvider` 的子组件中调用，这样 `useThemeVars()` 才能读取当前 Naive 主题。它是主题 token 适配器，不是 `FnConfigProvider` 的替代品；页面仍需要同时放置两个 provider：

```vue
<script setup lang="ts">
import { useThemeVars } from "naive-ui";
import { useNaiveTheme, type NaiveThemeTokens } from "@fast-crud/fast-crud-next";

const themeVars = useThemeVars();
useNaiveTheme(() => themeVars.value as unknown as NaiveThemeTokens);
</script>

<template><slot /></template>
```

典型的嵌套关系如下：

```vue
<NConfigProvider :theme="dark ? darkTheme : null">
  <NaiveThemeBridge />
  <FnConfigProvider>
    <RouterView />
  </FnConfigProvider>
</NConfigProvider>
```

不要在 `NConfigProvider` 外层的根组件 setup 中读取 `useThemeVars()`。当前 Naive 适配器同时兼容嵌套 token 和 `useThemeVars()` 返回的扁平 token。

## Element Plus

FnCrud 核心包不依赖 Element Plus。Element Plus 应用可在入口加载 Element 样式后，导入一份独立 CSS 桥接，将 Element 主题变量映射到 Fn token。Element 的 CSS 变量更新后，FnCrud 的颜色、圆角和控件高度会同步变化：

```css
:root {
  --fn-color-primary: var(--el-color-primary);
  --fn-color-text: var(--el-text-color-primary);
  --fn-color-text-secondary: var(--el-text-color-regular);
  --fn-color-text-tertiary: var(--el-text-color-secondary);
  --fn-color-bg-base: var(--el-bg-color-page);
  --fn-color-bg-container: var(--el-bg-color);
  --fn-color-bg-elevated: var(--el-bg-color-overlay);
  --fn-color-fill-alter: var(--el-fill-color-light);
  --fn-color-fill-secondary: var(--el-fill-color);
  --fn-color-border: var(--el-border-color);
  --fn-color-border-secondary: var(--el-border-color-light);
  --fn-color-error: var(--el-color-danger);
  --fn-border-radius: var(--el-border-radius-base);
  --fn-control-height: var(--el-component-size);
}
```

桥接 CSS 应在 `element-plus/dist/index.css`、App 和 FnCrud 依赖加载后导入。项目中的 Element admin 已在 `packages/fn-admin/fn-admin-element/src/element-theme.css` 展示完整映射，并将 FnButton 阴影调整为 Element 风格。页面需要展示 Element 标签时直接使用 `ElTag`；FnCrud 不提供框架专属标签。

## Ant Design Vue

```ts
import { theme } from "ant-design-vue";
import { useAntdvTheme } from "@fast-crud/fast-crud-next";

const { token } = theme.useToken();
useAntdvTheme(token);
```

主题适配器是可选能力，FnCrud 基础入口不会主动加载第三方 UI 框架。
