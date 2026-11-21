# 新增、编辑和删除

在同一个列表的 `request` 中接入写操作。下面的 `api` 由应用提供，编辑时需按自己的数据模型取出记录 ID。

```ts
request: {
  pageRequest: loadUsers,
  addRequest: form => api.createUser(form),
  editRequest: form => api.updateUser(Number(form.id), form),
  delRequest: id => api.deleteUser(Number(id)),
}
```

公共字段配置放在 `columns.<字段>.form`。新增与编辑使用不同标题或行为时，在 `addForm`、`editForm` 中覆盖公共 `form`。内置请求处理成功后刷新列表；请求失败由页面的错误处理流程反馈。

在 [Admin 请求 Mock](../demos/admin.md) 的 `/crud/basis/request-mock` 新增一条服务，编辑负责人，再删除该服务。请求签名见[请求 API](../api/requests.md)。
