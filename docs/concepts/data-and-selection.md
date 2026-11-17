# 数据、字典和选择

## 分页请求

`pageRequest` 接收分页、搜索和排序参数：

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

开启 `rowSelect.crossPage` 后，`onChange` 的 keys 会保留跨页选择；rows 只代表当前已经加载页的记录。批量操作应以 keys 为准，再由业务层回查完整记录：

```ts
rowSelect: {
  crossPage: true,
  onChange: keys => {
    selectedKeys.value = keys;
  },
}
```

调用 `crud.table.getSelectedRowKeys()` 可读取全部选中 key，`crud.table.getSelectedRows()` 只返回当前页记录。
