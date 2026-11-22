# 主题集成

FnCrud 使用 `--fn-*` CSS 变量。应用可直接覆写 token，也可以选择与宿主 UI 一致的适配器。

## 直接覆盖主题变量

在应用的全局样式中设置主题变量。切换明暗模式时，建议同时检查文字、背景、边框和主色。

```css
:root {
  --fn-color-primary: #146d62;
  --fn-color-text: #18332f;
  --fn-color-bg-container: #ffffff;
  --fn-color-border: #cddbd8;
}

:root.dark {
  --fn-color-primary: #56c5b6;
  --fn-color-text: #e1eeeb;
  --fn-color-bg-container: #172825;
  --fn-color-border: #405952;
}
```

| 宿主 | 导入与调用 | 初始化位置 |
| --- | --- | --- |
| Ant Design Vue | 从包入口导入 `useAntdvTheme`，传入 `theme.useToken().token`。需要同时配置消息服务时，可使用 `/theme/antdv` 子路径的 `useFnAntdvUi`。 | 使用对应主题上下文的应用组件。 |
| Element Plus | 从 `@fast-crud/fast-crud-next/theme/element` 导入并调用 `useElementTheme()`。 | 应用根组件，Element Plus 自身的样式需已加载。 |
| Naive UI | 从 `@fast-crud/fast-crud-next/theme/naive` 导入 `useNaiveTheme`，传入读取 `useThemeVars().value` 的 getter。 | `NConfigProvider` 的子组件。 |

三套 [Admin](../demos/admin.md) 分别展示初始化方式。页面仍由 `FnConfigProvider` 提供 FnCrud 的弹窗与通知上下文。

## Tooltip 的配色

`FnTooltip` 和表格的 `cell.tooltip` 默认使用黑底白字。`--fn-tooltip-bg` 同时控制浮层和箭头的背景，`--fn-tooltip-text` 控制文字颜色。在应用的全局样式中为 `body` 设置这些变量，即可覆盖挂载到 `body` 的 Tooltip 配色。

## 消息与通知的样式

内置 Message 和 Notification 随主题适配器更新圆角、背景和状态色。

- **Ant Design Vue** 使用 `borderRadiusLG` 作为卡片圆角，通知关闭按钮使用 `borderRadiusSM`。
- **Element Plus** 的 Message 使用基础圆角和各状态的浅底色。Notification 使用通知圆角，默认 `8px`，可在根元素覆盖 `--el-notification-radius`。
- **Naive UI** 使用 `borderRadius` 和 `popoverColor`，状态图标使用对应的主题色。

应用也可直接设置 `--fn-feedback-border-radius` 和 `--fn-feedback-bg`。[消息与通知示例](../demos/admin.md#从哪里看起)

## Ant Design Vue

在 `ConfigProvider` 的后代组件中读取 token。下面的桥接组件可包住页面内容。

```vue
<!-- AntdvThemeBridge.vue -->
<script setup lang="tsx">
import { theme } from 'ant-design-vue'
import { useAntdvTheme } from '@fast-crud/fast-crud-next'

const { token } = theme.useToken()
useAntdvTheme(token)
</script>

<template><slot /></template>
```

根组件的顺序可参考 Ant Design Vue Admin 的 `src/App.vue`，即 `ConfigProvider → AntApp → FnConfigProvider → AntdvThemeBridge → 页面`。在外层切换 `theme.defaultAlgorithm` 或 `theme.darkAlgorithm`，桥接组件会接收随之变化的 token。

## Element Plus

在应用入口加载 `element-plus/dist/index.css`。然后在根组件调用 `useElementTheme()`，子路径会加载 CSS 映射，并在调用时设置根元素的 `data-fn-theme="element"`。

```vue
<script setup lang="tsx">
import { FnConfigProvider } from '@fast-crud/fast-crud-next'
import { useElementTheme } from '@fast-crud/fast-crud-next/theme/element'
import CrudPage from './CrudPage.vue'

useElementTheme()
</script>

<template>
  <FnConfigProvider><CrudPage /></FnConfigProvider>
</template>
```

FnCrud 从 Element Plus 的 `--el-*` 变量读取对应颜色、圆角和控件高度。Element Plus Admin 加载 `element-plus/theme-chalk/dark/css-vars.css`，并在根元素切换 `.dark`，让页面和浮层共享同一套暗色变量。

## Naive UI

在 `NConfigProvider` 内部的独立组件中调用 `useThemeVars()`，这样 Vue 才能从当前 Provider 读取主题。把读取函数交给适配器，以便跟随主题更新。

```vue
<!-- NaiveThemeBridge.vue -->
<script setup lang="tsx">
import { useThemeVars } from 'naive-ui'
import { useNaiveTheme, type NaiveThemeTokens } from '@fast-crud/fast-crud-next/theme/naive'

const themeVars = useThemeVars()
useNaiveTheme(() => themeVars.value as unknown as NaiveThemeTokens)
</script>

<template><slot /></template>
```

在根组件按 `NConfigProvider → NaiveThemeBridge → FnConfigProvider → 页面` 嵌套。为外层 `NConfigProvider` 切换 `darkTheme` 和 `null` 即可验证 FnCrud 的按钮、输入框和表格随主题变化。
