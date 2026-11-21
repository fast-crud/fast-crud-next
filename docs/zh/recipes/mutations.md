# 新增、编辑和删除

从能查询的列表开始。这里以用户列表为例，`api` 是应用已有的请求模块，`loadUsers` 是已经接好的分页函数。Django 项目可参考[从接口到页面的完整示例](../guide/django.md)。

## 接入请求并显示按钮

```ts
// 添加到 state
rowHandle: { width: 150 },
request: {
  pageRequest: loadUsers,
  infoRequest: id => api.getUser(Number(id)),
  addRequest: form => api.createUser(form),
  editRequest: form => api.updateUser(Number(form.id), form),
  delRequest: id => api.deleteUser(Number(id)),
}
```

开启操作栏可使用内置新增按钮。行操作区负责编辑和删除。示例接口使用数字主键，所以适配层调用 `Number(id)`。使用 UUID 等字符串主键时直接保留原值。

编辑弹窗优先使用 `infoRequest` 的响应初始化。确保响应含更新接口要用的 `id`。列表行已经带有全部可编辑字段时，可省略详情请求。

## 设置表单字段和模式

```ts
columns: {
  id: { key: 'id', title: '编号', form: { show: false } },
  name: {
    key: 'name',
    title: '姓名',
    type: 'text',
    form: { rules: [{ required: true, message: '请输入姓名' }] },
  },
},
form: { dialog: { width: 600 } },
addForm: { dialog: { title: '新增用户' } },
editForm: { dialog: { title: '编辑用户' } },
```

校验通过后才执行写入。使用 `fetch` 时检查 `response.ok`，失败时抛出错误以保留表单并显示失败提示。使用内置提交逻辑时，写入成功后会刷新列表。覆盖 `form.onSubmit` 时，在回调内自行提交并刷新。

## 验证

在 [Admin 请求 Mock](../demos/admin.md) 的 `/crud/basis/request-mock` 新增一条服务，编辑负责人，再删除该服务。先尝试提交空名称，确认提示校验错误且列表不变。保存后搜索更新的数据，再删除并确认列表刷新。[请求回调签名](../api/requests.md) · [表单配置与上下文](../api/forms.md)
