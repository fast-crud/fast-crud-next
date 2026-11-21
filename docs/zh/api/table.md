# 表格、选择与偏好

`FnTable` 可从 `@fast-crud/fast-crud-next` 导入。在 FnCrud 中，通过列表配置设置表格和分页。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `table.rowKey` | 字段名或取键函数 | 按表格配置 | 选择和行操作依赖稳定的行键。 |
| `table.density` | `'compact' \| 'comfort'` | `'comfort'` | 用户保存的偏好可以覆盖开发者配置。 |
| `rowSelect.selectedRowKeys` | 行键数组 | `[]` | 当前选中键，由 `useFnCrud` 写回。 |
| `rowSelect.crossPage` | 布尔值 | 关闭 | 启用后保留跨页选择。 |
| `preferenceStorage` | `FnCrudPreferenceStorage` | 内置存储 | 提供 `get` 和 `set`，可选 `remove`。 |

给列表设置稳定且唯一的 `id`，用于区分各列表的偏好。列显隐、顺序、固定和实际调整过的列宽，以及分页大小和密度，均可按列表保存。独立使用 `FnTable` 时，`column-resize` 事件提供 `{ key, width }`。

在 [Admin 基础列表](../demos/admin.md)调整列顺序、列宽或密度后刷新页面，观察偏好的恢复情况。批量操作见[跨页选择](../recipes/selection.md)。
