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

| 路由 | 打开后可以做什么 |
| --- | --- |
| `/crud/basis/basic` | 搜索服务名称，调整列宽或顺序，刷新后确认[列偏好](../api/table.md#列设置如何生效)。 |
| `/crud/basis/request-mock` | 用 Axios Mock 试[搜索分页](../recipes/paging.md)和[增删改](../recipes/mutations.md)。 |
| `/crud/basis/compute` | 切换自定义单价，观察输入状态和总价。[验证步骤](#动态计算示例怎么验证) |
| `/crud/form/conditional` | 在编辑弹窗切换轮换方式，检查[字段显隐和校验](../recipes/forms.md)。 |
| `/crud/form/slots` | 输入流程名称，查看标题区域更新，再用自定义页脚提交。[插槽上下文](../api/forms.md#自定义弹窗插槽) |
| `/crud/dict/credentials` | 用字典筛选环境和状态，切换状态字段的[类型](../guide/column-types.md)。 |
| `/crud/feature/selection` | 在两页各选择一条记录，验证[跨页选择](../recipes/selection.md)和批量操作。 |
| `/components/table-buttons` | 对照各宿主 UI 框架的原生表格和按钮表现。 |

### 动态计算示例怎么验证

1. 在表格里切换某行的「自定义单价」，查看该行单价输入是否启用。修改数量或单价，确认总价实时更新。
2. 点击操作栏的「禁用数量输入」或「启用数量输入」，查看所有行的数量输入同时变化。页面用同一个 `ref` [控制整列](../api/columns.md#用一个开关禁用整列输入)。
3. 打开新增或编辑表单，切换「自定义单价」，观察单价字段的显隐。

表格中的直接编辑用于验证联动。重新查询会从 Mock 重新加载数据。需要写入时，请通过编辑表单提交。

## 从路由找到源码

三套宿主应用位于 `packages/fn-admin` 下。共享 CRUD 页面位于 `packages/fn-admin/fn-admin-shared/src/views/crud`。把路由去掉 `/crud/` 前缀即可定位目录，例如 `/crud/basis/request-mock` 对应下面的结构。

```text
views/crud/basis/request-mock/
  index.vue  页面、列与 FnCrud 状态
  api.ts     分页与写操作的请求适配
  mock.ts    示例数据和模拟路由
```

查页面业务配置先看 `index.vue`，查分页参数和响应转换看 `api.ts`，改初始数据或模拟接口看 `mock.ts`。宿主自己的路由入口位于 `src/router/config.ts`。组件对比页由各宿主自己实现，位于 `src/views/ComponentComparisonView.vue`。

### 共享包与请求 Mock

三套宿主以 `workspace:*` 引入 `@fast-crud/fn-admin-shared`。共享包将 Vue 声明为 peer dependency。宿主通过 `@fast-crud/fn-admin-shared/views/crud/basis/request-mock/index.vue` 导入页面，通过 `@fast-crud/fn-admin-shared/preferences` 共用语言和主题偏好。

宿主入口加载 `@fast-crud/fn-admin-shared/mock`。共享包的 `src/mock/index.ts` 收集各页面的 `mock.ts`，由 Axios Mock Adapter 在浏览器内拦截请求。请求 Mock 页使用 `createCrudApi('FnAdminRequestMock')`，对应路径前缀为 `/mock/FnAdminRequestMock`。刷新页面后，数据恢复初始值。

接入真实后端时，先在 `api.ts` 对照[请求 API](../api/requests.md)替换分页和写操作，页面仍可使用原来的列配置与状态。新增 CRUD 示例时，在对应分类建立这三个文件，并在需要展示该页的宿主路由中注册。

## Ant Design Vue Admin 文案

Ant Design Vue Admin 的词表位于 `packages/fn-admin/fn-admin-antdv4/src/locale`，按 `zh` 和 `en` 分组。每种语言的 `menu.ts` 存放菜单和面包屑标题，`layout.ts` 存放顶栏、侧栏状态和页脚文案。

`main.ts` 注册 `vue-i18n`。组件通过 `useI18n({ useScope: "global" })` 取得 `t`，例如 `t("layout.console")`。当前语言跟随 Admin 的共享语言偏好。

Ant Design Vue Admin 将 FnCrud 的内置词表注册到 `fnCrud` 命名空间，并通过 `installFnCrud({ i18n: adminI18n })` 共用该实例。参阅[全局安装与语言](../guide/installation.md#与-vue-i18n-共用实例)。

新增菜单项时，在两种语言的 `menu.ts` 中添加同名词条，然后在 `router/config.ts` 中用 `titleKey` 引用，例如 `titleKey: "basic"`。顶栏语言按钮会同时更新菜单、面包屑和布局文案。
