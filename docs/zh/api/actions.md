# 按钮与操作区

FnCrud 内置的新增、批量操作、批量删除、编辑、删除和表单确认、取消按钮默认使用 Lucide 图标。可通过对应按钮配置的 `icon` 属性更换图标。

从按钮需要的上下文选择配置位置。各操作区统一使用 `FnButtonProps<Context>`。

| 位置 | `click` 收到的上下文 | 内置操作 |
| --- | --- | --- |
| `actionbar.buttons` | 无。通过页面闭包或 `crudRef` 读取列表状态。 | `add` 打开新增。 `batch` 内含批量删除，有选中项且配置了 `delRequest` 时可用。 |
| `toolbar.buttons` | 无。适合刷新、导出等列表操作。 | 内置密度和列设置入口。 |
| `rowHandle.buttons` | `FnRowContext<Row>` | 配置了 `rowHandle` 才显示操作列，包含 `edit` 和 `delete`。删除依赖 `delRequest`。 |
| `search.buttons` | `FnSearchContext` | 默认查询与重置，详见[搜索](./search.md)。 |
| `form.dialog.buttons` | `FnFormContext` | 默认 `reset`、`cancel`、`confirm`，详见[表单](./forms.md)。 |

## 常用配置

| 字段 | 类型或默认行为 | 用途 |
| --- | --- | --- |
| `show`、`disabled`、`loading` | 布尔值 | 控制显隐、禁用与加载状态。 |
| `text`、`type`、`icon` | 文案、样式名、Vue 组件 | 控制展示，例如 `type: 'primary'` 或 `type: 'link'`。 |
| `click` | `(context: Context) => void` | 调用对应区域的操作。可在函数内提交异步业务。 |
| `buttonType` | `'button' \| 'dropdown'` | 普通按钮或下拉按钮。 |
| `items` | `FnButtonItem<Context>[]` | 下拉项用 `key`、`label`、`click` 定义。 |
| `order` | `number` | 操作栏按此字段升序排列。 |

保留编辑按钮的原有行为时，修改 `rowHandle.buttons.edit.text` 即可。设置 `rowHandle.buttons.edit.click` 会替换内置点击行为。需要完整控制操作列时，可用 `rowHandle.render`。

```ts
rowHandle: {
  width: 180,
  buttons: {
    delete: { show: false },
    clone: {
      text: '复制为新记录',
      type: 'link',
      click: ({ row }) => {
        void crudRef.value?.form.openAddForm({ name: row.name })
      },
    },
  },
},
```

`crudRef` 的绑定方式见 [FnCrud API](./fn-crud.md)。在 [Admin 示例](../demos/admin.md)的 `/crud/feature/selection` 可验证基于选中键触发的批量操作，在 `/crud/basis/compute` 可查看操作栏按钮如何修改页面状态。
