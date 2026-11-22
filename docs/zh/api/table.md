# 表格、分页、选择与偏好

## 表格和分页

表格行悬停时，普通列和固定列统一使用主题的浅填充色。

在 `columns.<字段>.cell` 中设置 `sortable: true` 后，点击该列的表头可在升序、降序和取消排序之间切换。未排序时箭头为灰色，排序后箭头使用主题主色，表头和整列单元格同时高亮。可在[分页、搜索与排序示例](../recipes/paging.md)中查看。

| 路径 | 类型或默认值 | 用途 |
| --- | --- | --- |
| `table.rowKey` | 字段名或 `(row) => string \| number` | 省略时取行的 `id`，找不到有效键时回退到行序号。跨页选择和请求删除应使用稳定的行键。 |
| `table.density` | `'compact' \| 'comfort'`，默认 `'comfort'` | 用户保存的偏好优先。 |
| `table.size` | `number`，经 `useFnCrud` 初始化默认 `13` | 表格字号。独立使用 `FnTable` 时默认 `14`。 |
| `table.minWidth` | `number \| string` | 表格最小宽度。 |
| `pagination.current` | `number`，初始默认 `1` | 初始页码。搜索或排序会回到第 1 页。 |
| `pagination.show` | 布尔值，默认 `true` | 在 `useFnCrud` 初始化的列表上控制分页区域。 |
| `pagination.pageSize` | `number`，默认 `10` | 每页条数，用户保存的偏好优先。 |
| `pagination.pageSizeOptions` | `string[]`，默认 `['10', '20', '50', '100']` | `FnSelect` 按配置顺序展示每页条数。当前值缺失时追加到末尾。 |
| `pagination.showSizeChanger` | 布尔值，默认 `true` | 显示更改每页条数的入口。 |
| `pagination.showQuickJumper` | 布尔值，默认 `false` | 显示跳页输入。 |
| `pagination.simple` | 布尔值，默认 `false` | 使用简洁分页。 |

用户切页或修改页大小时，分别调用 `pagination['onUpdate:current']` 和 `pagination['onUpdate:pageSize']`。用户修改密度时调用 `table['onUpdate:density']`。`useFnCrud` 将变更写回 state，并调用当前列表配置的回调。当前列表没有定义回调时，调用全局回调。

## 表头筛选

通过 `columns.<字段>.cell.filter.options` 为列启用多选筛选。选项使用 `{ label, value }`，也支持 `disabled` 和 `show`。

```ts
columns: {
  status: {
    title: "状态",
    cell: {
      filter: {
        options: [
          { label: "运行中", value: "运行中" },
          { label: "已暂停", value: "已暂停" },
        ],
      },
    },
  },
}
```

确认后，`FnTable` 发出 `filter-change`，参数为 `{ key, values }`。独立使用 `FnTable` 时，通过 `filterValues` 传入已应用的条件。使用 `FnCrud` 时，条件按列键写入 `searchForm`，回到第一页并查询，`table.onFilterChange` 可监听变更。点击面板中的「重置」会清除该列条件并立即查询。

重新打开筛选面板时，复选框显示当前已应用的条件。关闭面板会丢弃未确认的改动。在 Admin 的 `/crud/basis/request-mock` 可试用「状态」列筛选，并悬停或聚焦「服务名称」列的文本，通过 [`cell.tooltip`](./columns.md#单元格提示)查看被省略的长名称。

## 表格选择器弹窗

`FnTableSelect` 在字段中打开可搜索的单选表格，并通过 `dialog` 传入弹窗配置。`dialog` 支持 `FnModal` 的公开属性，配置值会覆盖默认标题和内置按钮配置，未配置的弹窗属性继续使用 `FnModal` 默认值。

~~~vue
<FnTableSelect
  v-model="form.ownerId"
  :dict="ownerDict"
  :crud-options="ownerCrudOptions"
  :dialog="{
    width: '70vw',
    draggable: false,
    title: '选择负责人',
  }"
/>
~~~

常用配置包括 `width`（数字按像素处理，也支持 CSS 字符串）、`draggable`、`footer`、`title` 和 `buttons`。`dialog.buttons` 会与内置按钮深度合并，`reset` 默认隐藏，`confirm` 默认在没有暂存记录时禁用。

## 行选择

| 路径 | 类型或默认值 | 用途 |
| --- | --- | --- |
| `rowSelect.show` | `boolean`，默认 `true` | 控制选择列显隐。隐藏时保留已选行键，重新显示后可继续选择。 |
| `rowSelect.type` | `'single' \| 'multiple'`，默认多选 | 选择方式。 |
| `rowSelect.selectedRowKeys` | `Array<string \| number>`，默认 `[]` | 初始选中及当前的选中键。 |
| `rowSelect.crossPage` | 布尔值，默认关闭 | 保留非当前页的选中键。 |
| `rowSelect.fixed` | `'left' \| 'right' \| null`，默认 `'left'` | 设置选择列固定位置，`null` 取消固定。 |
| `rowSelect.onChange` | 接收行键数组的回调 | 用户选择变化或清空时调用。当前实现写回字符串键。 |
| `table.onRowClick` | 接收 `(row, index)` 的回调 | 用户单击数据行时调用。 |

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

### 列设置如何生效

| 操作 | 结果 |
| --- | --- |
| 在抽屉中修改显隐、固定或顺序，点击「确定」 | 应用并保存修改。 |
| 直接关闭抽屉 | 丢弃尚未确认的修改。 |
| 点击「还原」 | 立即清除已保存的列显隐、固定、顺序和宽度，恢复当前列配置。已保存的分页大小和密度仍有效。 |
| 在表头拖动列宽并松开 | 保存该列宽度。未拖动过的列继续使用 `cell.width`。 |

例如，开发者把名称列的 `cell.width` 从 `160` 改成 `220`，此前拖宽到 `300` 的用户刷新后仍会看到 `300`。在列设置中点击「还原」，名称列才恢复为 `220`。

用 `cell.setting.show: false` 隐藏列设置中的条目，用 `cell.setting.disabled: true` 保留条目但禁止修改。表格中是否显示该列由列显隐配置和用户偏好决定。用 `compute` 生成整块 `cell` 配置的列在面板中不可编辑。需要在设置列表下面放提示或按钮时，可以使用 FnCrud 的 `#bodyBottom`，在基础列表的列设置中可看到这个位置。

## 表格插槽

以下为 FnCrud 的 `table.slots` 或独立 `FnTable` 的 `slots` 配置。

| 名称 | 回调上下文 |
| --- | --- |
| `top`、`bottom` | `{ data, loading }`，用于表格上下方的辅助内容。 |
| `empty` | `{ columns, loading }`，用于自定义空态。 |
