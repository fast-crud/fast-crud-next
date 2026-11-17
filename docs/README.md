# FnCrud 文档

这里按使用场景和职责划分 FnCrud 文档。先看入门集成，再按需要查阅配置、主题和示例。

## 入门

- [`getting-started/fncrud-integration.md`](getting-started/fncrud-integration.md)：在 Vue 3 + Vite 应用中接入 FnCrud。

## 核心概念

- [`concepts/configuration.md`](concepts/configuration.md)：state、columns、request、表单和动态配置。
- [`concepts/data-and-selection.md`](concepts/data-and-selection.md)：分页请求、字典、跨页选择和本地 mock 数据。

## 主题

- [`themes/overview.md`](themes/overview.md)：Fn token、Naive UI、Element Plus 和 Ant Design Vue 适配。

## 示例

- [`demos/admin-examples.md`](demos/admin-examples.md)：三套 admin 的启动地址、路由和示例用途。
- [`demos/antdv4-page-organization.md`](demos/antdv4-page-organization.md)：Ant Design Vue admin CRUD 页面分类和目录职责。
- [`demos/fn-admin-shared-package.md`](demos/fn-admin-shared-package.md)：共享 admin 代码的 workspace 包接入方式和导出路径。
- 请求式 CRUD Mock：见 [`demos/admin-examples.md`](demos/admin-examples.md) 的 `/crud/mock`；API handler 位于 `packages/fn-admin/fn-admin-shared/src/mock/services.mock.ts`。

## 组件

- [`components/modal.md`](components/modal.md)：FnModal 的使用方式和开关过渡行为。

## 开发

- [`development/documentation.md`](development/documentation.md)：新增功能时如何同步维护文档。
