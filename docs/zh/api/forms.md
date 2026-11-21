# 表单与弹窗

从 `@fast-crud/fast-crud-next` 导入 `FnForm`、`FnFormDialog` 或 `compute`。集成在 FnCrud 内时，可以直接使用以下配置。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns.<字段>.form.rules` | 校验规则数组 | 无 | 例如 `[{ required: true, message: '请输入名称' }]`。 |
| `columns.<字段>.form.show` | 布尔值或动态配置 | 按字段配置 | 可用 `compute` 读取当前表单。 |
| `form.dialog.slots` | 插槽名到渲染函数的映射 | 无 | 渲染函数接收当前表单上下文。 |
| `form.onSubmit` | 表单提交回调 | CRUD 内置提交处理 | 可覆盖新增或编辑的默认请求处理。 |

`FnFormDialog` 暴露 `open`、`close`、`reset`、`cancel`、`submit` 和 `getFormData`。

| 插槽区域 | 示例中的插槽 | 上下文示例 |
| --- | --- | --- |
| 标题 | `headerLeft`、`headerRight`、`headerActionLeft`、`headerActionRight` | `form.name` 显示当前输入。 |
| 内容 | `bodyTop`、`bodyLeft`、`bodyRight`、`bodyBottom` | 使用当前表单上下文渲染辅助信息。 |
| 页脚 | `footerLeft`、`footer`、`footerRight` | `dialog.close` 取消，`dialog.confirm` 提交，`dialog.loading` 读取提交状态。 |

查看[表单联动、校验与插槽](../recipes/forms.md)中的完整运行路径。
