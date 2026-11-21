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

## 自定义弹窗标题和页脚

在 `<script setup lang="tsx">` 中把渲染函数传给 `form.dialog.slots`。标题可以读取当前表单数据，页脚可以调用表单弹窗提供的操作。

```tsx
form: {
  dialog: {
    slots: {
      headerRight: ({ form }) => <span>{form?.name}</span>,
      footer: ({ close, submit }) => (
        <div>
          <FnButton text="取消" click={close} />
          <FnButton text="提交" type="primary" click={submit} />
        </div>
      ),
    },
  },
}
```

在 `/crud/form/slots` 打开新增表单，输入流程名称，确认标题同步显示。点击自定义提交按钮，观察校验或保存结果。各插槽位置和操作详见[表单 API](../api/forms.md)。[Admin 启动方式](../demos/admin.md)
