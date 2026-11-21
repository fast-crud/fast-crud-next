# FnCrud API

`FnCrud`、`useFnCrud`、`FnCrudState<Row>` 和 `FnCrudExpose<Row>` 从 `@fast-crud/fast-crud-next` 导入。

```ts
const state = reactive<FnCrudState<User>>(options)
const crudRef = ref<FnCrudExpose<User>>()
useFnCrud({ state, crudRef })
```

模板使用 `<FnCrud ref="crudRef" v-bind="state" />`。需要调用组件方法时传入 `crudRef`，在挂载后通过 `crudRef.value` 访问。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | 按字段键组织的列配置 | 由调用方提供 | `cell`、`search`、`form` 分别配置单元格、搜索和表单字段。 |
| `columns[key].type`、`columns[key].dict` | [字段类型与字典](../guide/column-types.md) | 可选 | `type` 接受字符串、数组及其 `ref` / `computed`，`dict` 为 `dict-select` 提供选项。 |
| `request` | CRUD 请求配置 | 由调用方提供 | 详见[请求 API](./requests.md)。 |
| `form` / `addForm` / `editForm` | 表单配置 | 按需设置 | 新增和编辑配置分别覆盖公共配置。 |
| `table` / `pagination` / `rowSelect` | 列表子域配置 | 内置初始化 | 详见[表格与偏好](./table.md)。 |
| `actionbar` / `toolbar` / `rowHandle` | 操作区配置 | 内置操作与布局 | 配置列表操作、工具栏或行操作。 |

常用暴露方法包括 `crudRef.value?.table.getSelectedRowKeys()` 和 `crudRef.value?.form.openAddForm()`。完整接入见[快速开始](../guide/getting-started.md)，表单扩展见[表单与弹窗](./forms.md)。
