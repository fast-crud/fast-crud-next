# Admin 示例

仓库提供 Ant Design Vue、Element Plus 和 Naive UI 三套 Admin，用于查看 FnCrud 在不同宿主 UI 框架中的集成方式。

## 启动方式

在仓库根目录执行 `pnpm install`，再按需启动以下应用。每个命令占用一个终端。

| 应用 | 命令 | 本地入口 |
| --- | --- | --- |
| Ant Design Vue | `pnpm --dir packages/fn-admin/fn-admin-antdv4 dev --port 5173` | `http://localhost:5173` |
| Element Plus | `pnpm --dir packages/fn-admin/fn-admin-element dev --port 5174` | `http://localhost:5174` |
| Naive UI | `pnpm --dir packages/fn-admin/fn-admin-naive dev --port 5175` | `http://localhost:5175` |

## 从哪里看起

- **基础列表**展示列配置、搜索、分页和新增、编辑、删除。
- **请求 Mock**使用 Axios 拦截请求，可参考它将 `pageRequest` 等请求方法接入后端。
- **动态配置和条件表单**展示字段显隐、输入禁用以及表格中的计算联动。
- **字典和跨页选择**展示状态筛选、跨页保留选中行和批量操作。

三套应用位于 `packages/fn-admin`。共用的 CRUD 示例集中在 `packages/fn-admin/fn-admin-shared/src/views/crud`。

## Ant Design Vue Admin 文案

Ant Design Vue Admin 的词表位于 `packages/fn-admin/fn-admin-antdv4/src/locale`，按 `zh` 和 `en` 分组。每种语言的 `menu.ts` 存放菜单和面包屑标题，`layout.ts` 存放顶栏、侧栏状态和页脚文案。

新增菜单项时，在两种语言的 `menu.ts` 中添加同名词条，然后在 `router/config.ts` 中用 `titleKey` 引用，例如 `titleKey: "basic"`。顶栏语言按钮会同时更新菜单、面包屑和布局文案。
