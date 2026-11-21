# Agent 查阅索引

先按任务或符号选择一页，再读对应 API 和一个可运行示例。代码与文档版本不一致时，核对所用版本的公开导出、类型和示例。使用仓库工作区时，以 `packages/fn-crud/src/index.ts` 和包的 `exports` 为入口。

| 任务或符号 | 起点 |
| --- | --- |
| `FnCrud`、`FnConfigProvider`、`useFnCrud`、`FnCrudState`、`FnCrudExpose` | [快速开始](./guide/getting-started.md) · [FnCrud API](./api/fn-crud.md) |
| 项目集成、后端接口、Vite 代理、Django、CSRF | [项目集成](./guide/project-integration.md) |
| `@fast-crud/fast-crud`、`useFs`、`crudBinding` | [从 Fast Crud 迁移](./guide/from-fast-crud.md) |
| `installFnCrud`、`commonOptions`、`locale` | [全局安装与语言](./guide/installation.md) |
| `columns[key].type`、`addTypes`、`dict-select` | [字段类型](./guide/column-types.md) |
| `columns[key].cell`、`columns[key].form`、`compute` | [列与动态配置](./api/columns.md) |
| `search.buttons`、`FnSearchContext.search()`、`tabs`、`tabsCounts` | [搜索与 Tabs](./api/search.md) |
| `request.pageRequest`、`FnTablePageQuery`、排序、搜索 | [请求 API](./api/requests.md) · [分页、搜索与排序](./recipes/paging.md) |
| `addRequest`、`editRequest`、`delRequest`、增删改 | [请求 API](./api/requests.md) · [增删改](./recipes/mutations.md) |
| `form`、`addForm`、`editForm`、`compute`、`FnFormDialog`、插槽 | [表单与弹窗](./api/forms.md) · [表单联动与插槽](./recipes/forms.md) |
| `FnModal`、`FnModal.confirm`、`v-model:open`、`closed` | [独立弹窗与确认框](./api/modal.md) |
| `DictStore`、`rowSelect.selectedRowKeys`、`crossPage` | [字典与选择](./recipes/selection.md) |
| `FnTable`、`preferenceStorage`、列宽、密度 | [表格与偏好](./api/table.md) |
| `FnButton`、`FnInput`、`FnCheckbox`、`FnRadio` | [基础组件](./api/components.md) |
| `actionbar.buttons`、`toolbar`、`rowHandle.buttons` | [按钮与操作区](./api/actions.md) |
| `useAntdvTheme`、`useElementTheme`、`useNaiveTheme`、`--fn-*` | [主题集成](./themes/overview.md) |
| 本地路由、Axios Mock、可运行验证 | [Admin 示例](./demos/admin.md) |

维护仓库时，按[文档维护](./development/documentation.md)更新受影响的页面。
