# Admin 示例

仓库提供 Ant Design Vue、Element Plus 和 Naive UI 三套 Admin，用于查看 FnCrud 在不同宿主 UI 框架中的集成方式。

## 启动方式

在仓库根目录执行 `pnpm install`，再按需启动以下应用。每个命令占用一个终端。

| 应用 | 命令 | 本地入口 |
| --- | --- | --- |
| Ant Design Vue | `pnpm --filter @fast-crud/fn-admin-antdv4 dev --port 5173` | `http://localhost:5173` |
| Element Plus | `pnpm --filter @fast-crud/fn-admin-element dev --port 5174` | `http://localhost:5174` |
| Naive UI | `pnpm --filter @fast-crud/fn-admin-naive dev --port 5175` | `http://localhost:5175` |

## 从哪里看起

三套 Admin 使用下列相同路由。把路由追加到所选应用的本地地址。

| 路由 | 可以验证的行为 |
| --- | --- |
| `/crud/basis/basic` | 列配置、搜索、分页和[列偏好](../api/table.md)。 |
| `/crud/basis/request-mock` | 用 Axios Mock 验证[分页搜索](../recipes/paging.md)和[增删改](../recipes/mutations.md)。 |
| `/crud/basis/compute` | 字段禁用和单元格计算。 |
| `/crud/form/conditional` | [条件字段和校验](../recipes/forms.md)。 |
| `/crud/form/slots` | [表单插槽](../api/forms.md)及其上下文。 |
| `/crud/dict/credentials` | [字段类型](../guide/column-types.md)、字典筛选和状态字段的运行时类型切换。 |
| `/crud/feature/selection` | [跨页选择](../recipes/selection.md)和批量操作。 |

请求 Mock 在浏览器内拦截 Axios 请求。刷新后数据恢复初始值，适合反复验证查询与写操作。

三套应用位于 `packages/fn-admin`。共用的 CRUD 示例集中在 `packages/fn-admin/fn-admin-shared/src/views/crud`。

## Ant Design Vue Admin 文案

Ant Design Vue Admin 的词表位于 `packages/fn-admin/fn-admin-antdv4/src/locale`，按 `zh` 和 `en` 分组。每种语言的 `menu.ts` 存放菜单和面包屑标题，`layout.ts` 存放顶栏、侧栏状态和页脚文案。

`main.ts` 注册 `vue-i18n`。组件通过 `useI18n({ useScope: "global" })` 取得 `t`，例如 `t("layout.console")`。当前语言跟随 Admin 的共享语言偏好。

Ant Design Vue Admin 将 FnCrud 的内置词表注册到 `fnCrud` 命名空间，并通过 `installFnCrud({ i18n: adminI18n })` 共用该实例。参阅[全局安装与语言](../guide/installation.md#与-vue-i18n-共用实例)。

新增菜单项时，在两种语言的 `menu.ts` 中添加同名词条，然后在 `router/config.ts` 中用 `titleKey` 引用，例如 `titleKey: "basic"`。顶栏语言按钮会同时更新菜单、面包屑和布局文案。
