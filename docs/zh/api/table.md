# 表格、分页、选择与偏好

## 表格和分页

表格行悬停时，普通列和固定列统一使用主题的浅填充色。

| 路径 | 类型或默认值 | 用途 |
| --- | --- | --- |
| `table.rowKey` | 字段名或 `(row) => string \| number` | 省略时取行的 `id`，找不到有效键时回退到行序号。跨页选择和请求删除应使用稳定的行键。 |
| `table.density` | `'compact' \| 'comfort'`，默认 `'comfort'` | 用户保存的偏好优先。 |
| `table.size` | `number`，经 `useFnCrud` 初始化默认 `13` | 表格字号。独立使用 `FnTable` 时默认 `14`。 |
| `table.minWidth` | `number \| string` | 表格最小宽度。 |
| `pagination.current` | `number`，初始默认 `1` | 初始页码。搜索或排序会回到第 1 页。 |
| `pagination.show` | 布尔值，默认 `true` | 在 `useFnCrud` 初始化的列表上控制分页区域。 |
| `pagination.pageSize` | `number`，默认 `10` | 每页条数，用户保存的偏好优先。 |
| `pagination.pageSizeOptions` | `string[]`，默认 `['10', '20', '50', '100']` | 分页大小选项，当前值自动加入。 |
| `pagination.showSizeChanger` | 布尔值，默认 `true` | 显示更改每页条数的入口。 |
| `pagination.showQuickJumper` | 布尔值，默认 `false` | 显示跳页输入。 |
| `pagination.simple` | 布尔值，默认 `false` | 使用简洁分页。 |

用户切页或修改页大小时，分别调用 `pagination['onUpdate:current']` 和 `pagination['onUpdate:pageSize']`。用户修改密度时调用 `table['onUpdate:density']`。`useFnCrud` 将变更写回 state，并调用当前列表配置的回调。当前列表没有定义回调时，调用全局回调。

## 行选择

| 路径 | 类型或默认值 | 用途 |
| --- | --- | --- |
| `rowSelect.type` | `'single' \| 'multiple'`，默认多选 | 选择方式。 |
| `rowSelect.selectedRowKeys` | `Array<string \| number>`，默认 `[]` | 初始选中及当前的选中键。 |
| `rowSelect.crossPage` | 布尔值，默认关闭 | 保留非当前页的选中键。 |
| `rowSelect.fixed` | `'left' \| 'right' \| null`，默认 `'left'` | 设置选择列固定位置，`null` 取消固定。 |
| `rowSelect.onChange` | 接收行键数组的回调 | 用户选择变化或清空时调用。当前实现写回字符串键。 |

```ts
rowSelect: {
  type: 'multiple',
  crossPage: true,
  onChange: keys => console.log('当前选中', keys),
},
```

业务批量操作可读取 `state.rowSelect?.selectedRowKeys`，也可用实例方法 `table.getSelectedRowKeys()`。查看[跨页选择示例](../recipes/selection.md)。

## 用户偏好

FnCrud 保存列显隐、顺序、固定和用户实际调整的宽度，以及每页条数和密度。保存的值优先于开发者配置。应给同一路由上的不同列表设置不同 `id`。

字段设为右固定时，填充剩余宽度的空白列位于右固定区域之前，字段可与右固定的行操作列相邻显示。

默认使用 `localStorage`。设置 `preferenceStorage` 时，提供 `get(key)` 和 `set(key, preferences)`，可选 `remove(key)`。方法支持 Promise。远端读取抛错时，组件尝试使用本地快照。存储键使用 `fn-crud:<id>`，未提供 `id` 时取路由路径。

在 [Admin 示例](../demos/admin.md)的 `/crud/basis/basic` 调整列顺序、宽度、密度，再刷新页面查看偏好恢复。独立使用 `FnTable` 时，可监听 `column-resize` 事件取得 `{ key, width }`。

## 表格插槽

以下为 FnCrud 的 `table.slots` 或独立 `FnTable` 的 `slots` 配置。

| 名称 | 回调上下文 |
| --- | --- |
| `top`、`bottom` | `{ data, loading }`，用于表格上下方的辅助内容。 |
| `empty` | `{ columns, loading }`，用于自定义空态。 |
