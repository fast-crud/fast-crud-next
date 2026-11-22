# 分页、搜索与排序

从[快速开始](../guide/getting-started.md)的列表出发，把本地分页换成后端请求。为搜索字段配置 `columns.<字段>.search`。后端应将收到的排序字段映射到允许排序的字段。

```ts
const request: FnCrudState<User>['request'] = {
  pageRequest: async ({ page, query, sort }) => {
    const response = await api.listUsers({
      offset: page.offset,
      limit: page.limit,
      name: query.name,
      sortBy: sort?.prop,
      ascending: sort?.asc,
    })

    return { records: response.items, total: response.total }
  },
}
```

这里的 `api.listUsers` 是应用自己的请求函数。先按搜索条件过滤，再排序并分页。返回过滤后的总数，分页器据此计算页数。取消排序时，`sort` 为 `undefined`。

**运行示例。** 启动任一 [Admin](../demos/admin.md)，打开 `/crud/basis/request-mock`。搜索服务名称，点击启用了 `cell.sortable: true` 的「最近更新」列切换排序，或用「状态」列的[表头筛选](../api/table.md#表头筛选)选中多个状态。确认后 `query.status` 为选中值数组，服务端按任一匹配状态返回结果。面板内的「重置」会清除该列条件。请求类型见[请求 API](../api/requests.md)。

「状态」列配置了 `type: 'dict-select'` 和 `dict`，表格用 `FnDictTag` 按字典颜色显示标签，新增和编辑表单用字典下拉框。`cell.filter.options` 也从同一份字典的 `getOptions().value` 读取选项。参阅[字典选项与显示](../guide/column-types.md#字典选项与显示)。

## 每页条数

在 `state.pagination` 中配置 `pageSizeOptions` 可指定下拉顺序。例如设为 `['10', '20', '50']`，并将 `pageSize` 设为 `20`，打开下拉时 `20 条/页` 会在第二项显示为已选中。选择其他条数会回到第一页。

在 Admin 的 `/crud/feature/compact-pagination` 可试用这个下拉框。默认选项之外的当前条数会追加到末尾。
