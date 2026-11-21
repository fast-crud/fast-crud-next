# 表单联动、校验与插槽

在字段的 `form` 中设置校验规则。需要读取当前表单数据时，用 `compute` 计算对应的叶子属性。

```ts
graceDays: {
  key: 'graceDays',
  title: '宽限天数',
  form: {
    value: 14,
    show: compute(({ form }) => form?.strategy !== '人工审批'),
  },
}
```

`compute` 从 `@fast-crud/fast-crud-next` 导入。在 `/crud/form/conditional` 打开编辑弹窗，切换轮换方式，观察宽限天数字段显隐。提交前清空策略名称，可以验证必填规则。

自定义表单对话框时，将 TSX 渲染函数放入 `form.dialog.slots`。例如，在标题右侧展示 `context.form.name`，在自定义页脚通过 `context.dialog.confirm` 提交。在 `/crud/form/slots` 打开新增表单，查看各插槽位置并输入流程名称。详见[表单 API](../api/forms.md)和 [Admin 启动方式](../demos/admin.md)。
