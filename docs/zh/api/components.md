# 基础组件

基础组件由 `@fast-crud/fast-crud-next` 导出，可以独立组合，也可以用作 CRUD 字段的组件。

| 组件 | 用途 | 使用示例 |
| --- | --- | --- |
| `FnInput` | 搜索与表单输入 | 在字段 `component` 中设置 `{ name: FnInput, vModel: 'modelValue' }`。 |
| `FnCheckbox`、`FnRadio` | 复选与单选 | 通过组件的 `modelValue` 绑定当前值。 |
| `FnButton` | 执行操作 | `<FnButton text="保存" type="primary" :click="save" />`。 |
| `FnButtonGroup`、`FnDropdownButton` | 组合操作 | 用于分组或下拉形式的操作入口。 |
| `FnModal`、`FnDrawer` | 展示浮层内容 | 页面需要管理浮层时可独立使用；CRUD 表单见[表单与弹窗](./forms.md)。 |

先在[快速开始](../guide/getting-started.md)运行 `FnInput` 搜索。表单弹窗中独立使用按钮的例子见[表单联动与插槽](../recipes/forms.md)。
