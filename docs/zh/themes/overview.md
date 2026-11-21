# 主题集成

FnCrud 使用 `--fn-*` CSS 变量。应用可直接覆写 token，也可以选择与宿主 UI 一致的适配器。

```css
:root {
  --fn-color-primary: #1677ff;
}
```

夜间主题中同时检查文字、背景、边框和主色的对比度。

| 宿主 | 导入与调用 | 初始化位置 |
| --- | --- | --- |
| Ant Design Vue | 从包入口导入 `useAntdvTheme`，传入 `theme.useToken().token`。需要同时配置消息服务时，可使用 `/theme/antdv` 子路径的 `useFnAntdvUi`。 | 使用对应主题上下文的应用组件。 |
| Element Plus | 从 `@fast-crud/fast-crud-next/theme/element` 导入并调用 `useElementTheme()`。 | 应用根组件，Element Plus 自身的样式需已加载。 |
| Naive UI | 从 `@fast-crud/fast-crud-next/theme/naive` 导入 `useNaiveTheme`，传入读取 `useThemeVars().value` 的 getter。 | `NConfigProvider` 的子组件。 |

三套 [Admin](../demos/admin.md) 分别展示初始化方式。页面仍由 `FnConfigProvider` 提供 FnCrud 的弹窗与通知上下文。
