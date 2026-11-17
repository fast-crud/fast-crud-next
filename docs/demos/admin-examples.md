# Admin 示例

三套 admin 共用 `packages/fn-admin/fn-admin-shared/src` 中的字典、跨页选择和条件表单页面；基础列表和动态计算页面保留各自 UI 框架的入口配置。

## 启动地址

| 示例 | 默认地址 | 主题来源 |
| --- | --- | --- |
| Ant Design Vue 4 | `http://localhost:5173/crud/basis/basic` | Ant Design Vue token |
| Element Plus | `http://localhost:5174/crud/basic` | Element Plus layout + Fn token |
| Naive UI | `http://localhost:5175/crud/basic` | Naive UI token |

## 路由

每套 admin 都包含以下 6 个 CRUD 示例。Ant Design Vue 的 URL 与 `views/crud` 分类目录对应；Element Plus 和 Naive UI 保持原路由：

- `/crud/basis/basic`（其他 admin：`/crud/basic`）：服务目录的搜索、分页、增删改。
- `/crud/basis/request-mock`（其他 admin：`/crud/mock`）：通过 Axios mock adapter 完成分页查询、增删改，展示请求层与 FnCrud 的接法。
- `/crud/basis/compute`（其他 admin：`/crud/compute`）：动态计算表单和单元格内容。
- `/crud/dict/credentials`（其他 admin：`/crud/dictionary`）：字典映射、状态标签、状态 tabs 和筛选。
- `/crud/feature/selection`（其他 admin：`/crud/selection`）：跨页保留选择和批量发布。
- `/crud/form/conditional`（其他 admin：`/crud/conditional-form`）：根据轮换方式显示或隐藏表单字段。

每套 admin 还提供一个普通 UI 组件对比页：

- `/components/table-buttons`：使用对应 UI 框架的普通表格和按钮展示相同的数据与操作，可并排比较 Ant Design Vue、Element Plus 和 Naive UI 的基础样式。

## 示例数据

除请求 Mock 示例外，其他示例数据由页面内存维护，用于展示 FnCrud 配置和交互。请求 Mock 示例使用 `axios-mock-adapter` 在浏览器端拦截 Axios 请求，开发和部署后的静态构建均可使用；页面刷新后数据恢复初始值。接入后端时，可将该页 `request` 替换为实际 API 调用，保留 FnCrud state 和模板结构。

Mock 路由沿用 `packages/fn-admin/fn-admin-shared/src/mock/base.ts` 的 `buildMock()`，CRUD 数据定义在 `services.mock.ts`；`index.ts` 使用 `axios-mock-adapter` 加载 common 与 CRUD mock handlers。CRUD 请求分别访问 `GET /mock/FnCrudServices/page`、`POST /mock/FnCrudServices/add`、`POST /mock/FnCrudServices/update` 和 `POST /mock/FnCrudServices/delete?id={id}`。三套 admin 从入口加载同一份 adapter，因此请求行为一致。
