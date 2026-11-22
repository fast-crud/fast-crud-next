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

三套 Admin 的「CRUD 示例」菜单按页面目录分为「基础」「字典」「功能」「表单」。也可以把下表中的路由追加到所选应用的本地地址。

同时展开四个分类后，可以在左侧菜单内向下滚动到「组件对比」。滚动时侧栏顶部的品牌栏和底部信息保持可见，右侧内容保持在原位。菜单和表格同在 `FnConfigProvider` 下，共用[默认滚动条样式](../guide/installation.md#默认滚动条)。

| 路由 | 打开后可以做什么 |
| --- | --- |
| `/crud/basis/basic` | 搜索服务名称，调整列宽或顺序，刷新后确认[列偏好](../api/table.md#列设置如何生效)。 |
| `/crud/basis/request-mock` | 用 Axios Mock 试[搜索分页](../recipes/paging.md)和[增删改](../recipes/mutations.md)，通过表头筛选服务状态，悬停或聚焦服务名称可查看[单元格提示](../api/columns.md#单元格提示)。 |
| `/crud/basis/compute` | 切换自定义单价，观察输入状态和总价。[验证步骤](#动态计算示例怎么验证) |
| `/crud/form/conditional` | 在编辑弹窗切换轮换方式，检查[字段显隐和校验](../recipes/forms.md)。 |
| `/crud/form/slots` | 输入流程名称，查看标题区域更新，再用自定义页脚提交。[插槽上下文](../api/forms.md#自定义弹窗插槽) |
| `/crud/dict/credentials` | 用字典筛选环境和状态，切换状态字段的[类型](../guide/column-types.md)。 |
| `/crud/feature/selection` | 在两页各选择一条记录，验证跨页选择和批量操作。点击「隐藏选择列」或「显示选择列」可切换选择列显隐。参阅[跨页选择](../recipes/selection.md)。 |
| `/crud/feature/large-table` | 查看 1000 行 × 100 列的模拟数据（含固定行号列）。默认每页 20 条，可切换到每页 1000 条，并横向滚动查看最后一列。 |
| `/crud/basis/sorting` | 表头排序（`cell.sortable`）。点击耗时列，切换升序、降序和取消排序。 |
| `/crud/basis/quick-search` | 快捷搜索（`search.buttons`）。点击「仅看待处理」，再清空搜索条件。 |
| `/crud/feature/fixed-columns` | 左右固定列（`cell.fixed`）。横向滚动，确认名称和状态保留在表格两侧。 |
| `/crud/feature/column-preferences` | 列配置偏好（列设置与持久化）。调整列顺序、显隐和宽度，刷新页面后查看保存结果。 |
| `/crud/feature/single-selection` | 单选记录（`rowSelect.type`）和 `FnTableSelect`。表格选择器支持单击行暂存记录，再确认提交。 |
| `/crud/feature/row-actions` | 行操作菜单（`rowHandle.buttons`）。在「更多」中复制当前行，确认新增表单带入原行数据。 |
| `/crud/feature/compact-pagination` | 简洁分页（`pagination.simple`）。输入页码并回车，跳到指定页。 |
| `/crud/feature/header-filters` | 组合表头筛选（`cell.filter.options`）。在区域和状态的表头应用筛选，再重置其中一列。 |
| `/crud/form/modes` | 新增与编辑配置（`addForm`、`editForm`）。分别打开新增和编辑表单，对比标题与确认按钮。 |
| `/crud/form/validation` | 表单校验与布局（`form.rules`、`form.span`）。清空名称或输入非邮箱值，提交后查看字段校验提示。 |
| `/components/table-buttons` | 对照各宿主 UI 框架的原生表格和按钮表现。 |
| `/components/feedback` | 在「消息与通知」中触发四种状态。点击「显示三条通知」，再关闭中间一条，查看下方卡片的补位动画。[Message 和 Notification](../api/components.md#message-和-notification) |

普通 CRUD 示例初始化为 55 条记录，便于验证分页、筛选和跨页操作。

### 示例页面约定

- 在标题下方使用 `heading.description` 写明示例的具体操作和预期结果。
- 默认显示至少一个可用的查询条件。优先在相关字段的 `search` 中配置，并让分页请求和 Mock 使用该条件筛选数据。点击查询和重置应能分别看到匹配结果和完整列表。
- 每个查询控件都必须设置非空的 `search.component.placeholder`，写明要输入或选择的内容，例如「请输入行号」或「请选择环境」。

### 动态计算示例怎么验证

1. 在表格里切换某行的「自定义单价」，查看该行单价输入是否启用。修改数量或单价，确认总价实时更新。
2. 点击操作栏的「禁用数量输入」或「启用数量输入」，查看所有行的数量输入同时变化。页面用同一个 `ref` [控制整列](../api/columns.md#用一个开关禁用整列输入)。
3. 打开新增或编辑表单，切换「自定义单价」，观察单价字段的显隐。

表格中的直接编辑用于验证联动。重新查询会从 Mock 重新加载数据。需要写入时，请通过编辑表单提交。

## 从路由找到源码

源码窗口使用 `FnModal`，关闭按钮使用 `FnButton`。

CRUD 示例和「消息与通知」页面右下角都有贴边的半透明「查看源码」短条，打开后可查看该页带语法高亮的 `index.vue`。源码弹窗挂载到 `body`。代码配色跟随 Admin 的明暗主题。Vite 在构建时通过 `import.meta.glob` 和 `?raw` 将源码编入独立模块，源码和高亮器在打开弹窗时按需加载。部署构建产物即可使用这一功能。

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

在 Naive UI 和 Element Plus Admin 中，点击顶栏语言按钮展开菜单，再选择「中文」或「English」。菜单会标出当前语言，选择会保存到本地。

宿主入口加载 `@fast-crud/fn-admin-shared/mock`。共享包的 `src/mock/index.ts` 收集各页面的 `mock.ts`，由 Axios Mock Adapter 在浏览器内拦截请求。请求 Mock 页使用 `createCrudApi('FnAdminRequestMock')`，对应路径前缀为 `/mock/FnAdminRequestMock`。刷新页面后，数据恢复初始值。

在 `/crud/basis/request-mock` 点击查询或提交表单后，可在浏览器控制台筛选 `[CRUD Mock]`。请求日志显示 HTTP 方法、接口地址、查询参数 `params` 和请求体 `data`，响应日志显示同一接口的 `code`、`msg` 和 `data`。

接入真实后端时，先在 `api.ts` 对照[请求 API](../api/requests.md)替换分页和写操作，页面仍可使用原来的列配置与状态。新增 CRUD 示例时，在对应分类建立这三个文件，并在需要展示该页的宿主路由中注册。

在 `index.vue` 中，将 `<FnCrud v-bind="state" />` 直接放在 `.crud-page` 容器下。这样 FnCrud 可以使用宿主内容区的完整高度，表格在内部滚动，分页栏留在底部。

## Ant Design Vue Admin 文案

Ant Design Vue Admin 的词表位于 `packages/fn-admin/fn-admin-antdv4/src/locale`，按 `zh` 和 `en` 分组。每种语言的 `menu.ts` 存放菜单和面包屑标题，`layout.ts` 存放顶栏、侧栏状态和页脚文案。

`main.ts` 注册 `vue-i18n`。组件通过 `useI18n({ useScope: "global" })` 取得 `t`，例如 `t("layout.console")`。当前语言跟随 Admin 的共享语言偏好。

Ant Design Vue Admin 将 FnCrud 的内置词表注册到 `fnCrud` 命名空间，并通过 `installFnCrud({ i18n: adminI18n })` 共用该实例。参阅[全局安装与语言](../guide/installation.md#与-vue-i18n-共用实例)。

新增菜单项时，在两种语言的 `menu.ts` 中添加同名词条，然后在 `router/config.ts` 中用 `titleKey` 引用，例如 `titleKey: "basic"`。顶栏语言按钮会同时更新菜单、面包屑和布局文案。
