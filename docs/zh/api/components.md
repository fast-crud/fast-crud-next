# 基础组件

`FnTag` 采用 Ant Design Vue Tag 的描边和间距。Ant Design Vue 主题通过 `useAntdvTheme` 提供状态文字、背景、边框和小圆角的主题值。Naive UI 和 Element Plus 继续使用各自映射的语义色和字号。

基础组件从 `@fast-crud/fast-crud-next` 导入，可以独立使用，也可以用作 CRUD 字段的组件。

| 组件 | 值与事件 | 常用属性 |
| --- | --- | --- |
| `FnInput` | `v-model` 绑定字符串或数字，`blur` 收到焦点事件。 | `type` 默认 `text`。设置 `type="number"` 后更新值为数字，清空时为 `undefined`。`multiline` 渲染文本域。 |
| `FnCheckbox` | `v-model` 绑定布尔值，`change` 接收 `(checked, event)`。 | `indeterminate` 设置半选，`disabled` 禁用。 |
| `FnRadio` | `v-model` 绑定当前选项，`change` 接收 `(value, event)`。 | 必填 `value` 为字符串、数字或布尔值。同组使用同一个 `name`。 |
| `FnRadioGroup` | `v-model` 绑定单个值。 | `options` 接受含 `value`、`label` 的数组。可对整组或单个选项设置 `disabled`。 |
| `FnCheckboxGroup` | `v-model` 更新选中值数组。 | `options` 与单选组相同。 |
| `FnSelect` | `v-model` 绑定单个值。启用 `multiple` 后绑定数组，并将已选项显示为可移除的标签。 | 输入文字筛选 `options`。启用 `clearable` 且有可清空的选项时，鼠标悬停在控件上会在展开图标的位置显示清空按钮。 |
| `FnDictTag` | 用 `options` 格式化单个值或值数组。 | 默认显示标签。`type="text"` 显示纯文本，`separator` 控制文本分隔符。 |
| `FnTag` | 默认插槽提供标签内容，无额外上下文。 | `color` 接受 `success`、`warning` 等语义色或 CSS 颜色。 |
| `FnButtonGroup` | `v-model` 绑定选中的 `value`，`change` 收到新的选中值。 | `options` 提供 `value`、`label` 等，`label` 为整组按钮提供可访问名称。 |
| `FnButton`、`FnDropdownButton` | `FnButton` 接收 `click` 回调，下拉按钮可监听 `select` 取得菜单键。 | 常用 `text`、`type`、`disabled`、`loading`、`items`。见[按钮配置](./actions.md)。 |
| `FnModal`、`FnDrawer` | 独立控制浮层。CRUD 提交表单见[表单与弹窗](./forms.md)。 | 纯确认操作可用 `FnModal.confirm(options)`。 |

## 使用自定义字段组件

字段的 `component.name` 可以是组件本身或已注册的组件名。把组件属性放在 `component` 对象内部。省略 `vModel` 时，FnCrud 传递 `modelValue` 并监听 `update:modelValue`。如果自定义组件使用 `value` 和 `update:value`，将 `vModel` 设为 `'value'`。

```ts
component: {
  name: MyInput,
  vModel: 'value',
  placeholder: '输入名称',
},
```

内置输入的例子见[快速开始](../guide/getting-started.md)。表单弹窗里使用按钮替换页脚，见[表单联动与插槽](../recipes/forms.md)。

在 [Admin 凭证示例](../demos/admin.md)中，环境筛选使用多选 `FnSelect`，编辑使用单选组。状态列用 `FnDictTag` 向 `FnTag` 的默认插槽传入字典标签。

`FnSelect` 支持方向键浏览、Enter 选择、Esc 收起。多选时，输入为空可用 Backspace 移除最后一个可移除的标签。

多选标签默认允许换行。设置 `wrap: false` 可固定为单行，至少显示第一个标签，过长时省略文字，其余放不下的标签显示为 `+N`。悬停可查看折叠项，展开列表后仍可取消任意已选项。`minWidth` 设置控件最小宽度，数字按像素处理，也可传入 CSS 长度。凭证示例的环境筛选使用 `search: { component: { multiple: true, wrap: false, minWidth: 160 } }`。
## FnIcon 图标尺寸

`FnIcon` 默认使用 `1em`，随继承的字号缩放。可通过 `size` 指定尺寸，例如 `:size="16"` 或 `size="1.25em"`。
