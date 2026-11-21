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

**运行示例。** 启动任一 [Admin](../demos/admin.md)，打开 `/crud/basis/request-mock`，搜索服务名称，点击列标题切换排序，再清除条件切换页码。请求适配器与列表位于共享 Admin 的 `views/crud/basis/request-mock`。请求类型见[请求 API](../api/requests.md)。
