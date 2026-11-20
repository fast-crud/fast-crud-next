# Ant Design Vue 页面目录

Ant Design Vue admin 的 CRUD 页面按 fast-crud admin 的主题分类放在 `packages/fn-admin/fn-admin-antdv4/src/views/crud`。页面配置统一写在各页面目录的 `index.vue`，避免把页面配置分散到额外的 `crud.tsx` 文件。

## 分类

| 分类 | 页面目录 | 示例 |
| --- | --- | --- |
| `basis` | `basis/basic` | 服务目录基础 CRUD |
| `basis` | `basis/compute` | 套餐动态计算 |
| `basis` | `basis/request-mock` | Axios 请求式 Mock |
| `dict` | `dict/credentials` | 字典状态、tabs 与筛选 |
| `feature` | `feature/selection` | 跨页选择与批量发布 |
| `form` | `form/conditional` | 条件表单 |
| `form` | `form/slots` | 表单插槽上下文：当前表单值与 dialog 操作 |

每个页面目录包含：

- `api.ts`：页面请求方法，使用共享 Axios mock client。
- `index.vue`：页面 UI、列定义和 FnCrud state。
- `mock.ts`：页面内存数据与 `buildMock()` 路由。

Ant admin 的 URL 与页面目录分类保持一致，例如 `basis/basic` 对应 `/crud/basis/basic`。旧的 `/crud/basic` 等路径会重定向到新分类路径。`src/main.ts` 通过 `import.meta.glob('./views/crud/**/mock.ts')` 收集页面 mock，再交给共享的 `axios-mock-adapter` 注册。新增 CRUD 页面时，放入合适分类目录并同时创建这三个文件，然后在路由表注册 `index.vue`。

Dashboard 和普通组件对比页不属于 CRUD 示例，因此仍直接放在 `src/views` 下。
