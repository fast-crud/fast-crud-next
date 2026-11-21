# 数据、字典和选择

## 分页请求

`pageRequest` 接收分页、搜索和排序参数：

点击列头会在正序、逆序和取消排序之间循环。取消后，`sort` 为 `undefined`；切换到另一列会从正序开始。

```ts
pageRequest: async ({ page, query, sort }) => {
  const response = await api.list({
    offset: page.offset,
    limit: page.limit,
    keyword: query.name,
    sortBy: sort?.prop,
    descending: sort ? !sort.asc : undefined,
  });

  return { records: response.items, total: response.total };
}
```

搜索条件放在 `query`，不要从组件内部读取 DOM。后端返回的总数必须是过滤后的总数，否则分页页码会不正确。

## 字典

`DictStore` 适合集中管理选项、标签和状态计数：

```ts
const statusDict = markRaw(new DictStore({
  data: [
    { label: "运行中", value: "running", color: "success" },
    { label: "已暂停", value: "paused", color: "default" },
  ],
}));
```

`cell.dict` 为单元格组件提供字典选项；普通文本单元格如果需要显示 label，应显式提供 `render`。这是当前 FnCrud 的职责边界，示例页面也按此方式实现。

## 跨页选择

`rowSelect.selectedRowKeys` 是选择状态的唯一数据源，`useFnCrud` 会在表格选择变化时写回该数组。业务组件可以直接观察或预置 keys，不需要额外的 `crudRef`；`onChange` 只接收 keys，适合通知业务执行副作用。开启 `rowSelect.crossPage` 后，keys 会保留跨页选择。批量操作应以 keys 为准，再由业务层回查完整记录：

```ts
rowSelect: {
  crossPage: true,
  selectedRowKeys: [],
}
```

调用 `crud.table.getSelectedRowKeys()` 可读取全部选中 key，包括跨页保留的 key。

`useFnCrud({ state, crudRef })` 会安装 `rowSelect.onChange`，将选择变化写回 `state.rowSelect.selectedRowKeys` 并继续调用用户传入的回调。默认 actionbar 提供「批量操作」下拉菜单，其中「批量删除」按选中 keys 调用 `request.delRequest`，确认成功后清空选择并刷新列表。actionbar 按钮只负责按钮配置，不接收 selectedRow 上下文；业务批量操作直接读取 `state.rowSelect.selectedRowKeys`。
