# 基础组件

`FnTag` 采用 Ant Design Vue Tag 的描边和间距。Ant Design Vue 主题通过 `useAntdvTheme` 提供状态文字、背景、边框和小圆角的主题值。Naive UI 和 Element Plus 继续使用各自映射的语义色和字号。

基础组件从 `@fast-crud/fast-crud-next` 导入，可以独立使用，也可以用作 CRUD 字段的组件。

| 组件 | 值与事件 | 常用属性 |
| --- | --- | --- |
| `FnInput` | `v-model` 绑定字符串或数字，`blur` 收到焦点事件。 | `type` 默认 `text`。设置 `type="number"` 后更新值为数字，清空时为 `undefined`。`multiline` 渲染文本域。`label` 可提供控件名称。 |
| `FnCheckbox` | `v-model` 绑定布尔值，`change` 接收 `(checked, event)`。 | `label` 显示可点击的标签文字，`text` 为无文字的复选框命名。`indeterminate` 设置半选，`disabled` 禁用。 |
| `FnSwitch` | `v-model` 绑定布尔值，默认 `false`。`change` 接收 `(checked, event)`。 | `label` 提供开关名称，`disabled` 禁用。 |
| `FnRadio` | `v-model` 绑定当前选项，`change` 接收 `(value, event)`。 | 必填 `value` 为字符串、数字或布尔值。同组使用同一个 `name`。`label` 提供选项名称。 |
| `FnRadioGroup` | `v-model` 绑定单个值。 | `label` 提供组名，`options` 接受含 `value`、`label` 的数组。可对整组或单个选项设置 `disabled`。 |
| `FnCheckboxGroup` | `v-model` 更新选中值数组。 | `label` 和 `options` 与单选组用法相同。 |
| `FnSelect` | `v-model` 绑定单个值。启用 `multiple` 后绑定数组，并将已选项显示为可移除的标签。 | `label` 可为控件和选项列表命名。输入文字筛选 `options`。启用 `clearable` 且有可清空的选项时，鼠标悬停在控件上会在展开图标的位置显示清空按钮。 |
| `FnDictTag` | 用 `options` 格式化单个值或值数组。 | 默认显示标签。`type="text"` 显示纯文本，`separator` 控制文本分隔符。 |
| `FnTag` | 默认插槽提供标签内容，无额外上下文。 | `color` 接受 `success`、`warning` 等语义色或 CSS 颜色。 |
| `FnButtonGroup` | `v-model` 绑定选中的 `value`，`change` 收到新的选中值。 | `options` 提供 `value`、`label` 等，`label` 为整组按钮提供可访问名称。 |
| `FnButton`、`FnDropdownButton` | `FnButton` 接收 `click` 回调，下拉按钮可监听 `select` 取得菜单键。 | 常用 `text`、`type`、`disabled`、`loading`、`items`。见[按钮配置](./actions.md)。 |
| `FnModal`、`FnDrawer` | 独立控制浮层。CRUD 提交表单见[表单与弹窗](./forms.md)。 | 浮层使用标题作为可访问名称。受控弹窗和纯确认操作见[独立弹窗与确认框](./modal.md)。 |

Fn 基础字段控件在 CRUD 表单、搜索区和表格单元格中会使用对应的字段标题。独立使用时，控件从自身的标签、提示或按钮文案生成无障碍名称。

## 在表单中组合组件

Admin 的 `/crud/component/*` 展示常见字段组件在 `FnCrud` 表单中的使用方式。文本、按钮、下拉、单选、复选、开关和表格选择分别对应独立页面。`FnTableSelect` 通过表单字段的 `component` 配置传入 `dict`、`crudOptions` 和 `dialog`，单击弹窗中的数据行后点击确认完成选择。

## Message 和 Notification

在 `FnConfigProvider` 的子组件中调用 `useFnUiServices()`。内置 `message` 从视口顶部居中滑入，适合简短的操作反馈。`notification` 从右上角滑入，卡片包含状态图标、标题和可选说明。点击卡片右上角可关闭该条通知，下方卡片会自动上移补位。系统开启减少动态效果时，卡片直接显示或移除。

卡片的圆角、背景和状态色随宿主主题更新。[消息与通知的样式](../themes/overview.md#消息与通知的样式)

两个服务都提供 `success`、`error`、`warning`（别名 `warn`）、`info`、`loading` 和 `open`。调用时传入字符串，或传入以下配置对象。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `message` | `string` | 可显示为短消息正文或通知标题。 |
| `content` | `string` | 省略 `message` 时读取。 |
| `description` | `string` | 通知标题下方的可选说明。 |
| `duration` | `number` | 显示时长，单位为毫秒。默认 `3000`，传入 `0` 时持续显示。 |
| `type` | `'success' \| 'error' \| 'warning' \| 'info' \| 'loading'` | `open` 使用的状态，默认 `'info'`。 |

调用 `message.destroy()` 或 `notification.destroy()` 可以清空各自的队列。如果通过主题适配器替换了反馈服务，参数和展示效果跟随适配器。

```vue
<script setup lang="tsx">
import { FnButton, useFnUiServices } from '@fast-crud/fast-crud-next'

const { message, notification } = useFnUiServices()

function showMessage() {
  message.success('保存成功')
}

function showNotification() {
  notification.info?.({
    message: '有新的版本可用',
    description: '刷新页面即可使用新版本。',
    duration: 6000,
  })
}
</script>

<template>
  <FnButton text="显示消息" :click="showMessage" />
  <FnButton text="显示通知" :click="showNotification" />
</template>
```

在三套 Admin 的「消息与通知」页面可以试用四种状态，并一次显示三条通知来观察关闭动画。[Admin 示例](../demos/admin.md#从哪里看起)

## Tooltip 和 Popover

从包入口导入 `FnTooltip` 和 `FnPopover`。两者都支持 `content` 文本、`placement`（`top`、`bottom`、`left`、`right`）、`disabled` 和 `v-model:open`。靠近视口边缘时会自动调整位置。默认插槽提供 `attrs`，绑定到实际触发元素即可关联浮层和触发器。

- `FnTooltip` 默认在上方显示，采用黑底白字。悬停或键盘焦点进入时显示说明，`#content` 可提供自定义说明内容。配色可通过[主题变量](../themes/overview.md#tooltip-的配色)调整。
- `FnPopover` 默认在下方显示，`label` 为弹出面板提供可访问名称。点击触发器打开，按 Escape 或点击外部关闭。`#content` 提供 `close()`，用于在完成操作后关闭并将焦点移回触发器。

```vue
<FnTooltip content="动态总价 = 数量 × 单价">
  <template #default="{ attrs }">
    <button type="button" v-bind="attrs">计价公式</button>
  </template>
</FnTooltip>

<FnPopover label="计价设置">
  <template #default="{ attrs }">
    <button type="button" v-bind="attrs">计价设置</button>
  </template>
  <template #content="{ close }">
    <button type="button" @click="close()">完成</button>
  </template>
</FnPopover>
```

启动任一 [Admin](../demos/admin.md)，打开 `/crud/basis/compute`。操作栏的「计价公式」展示提示内容，「计价设置」可修改新增订单的默认计价层级。

## 开关

`FnSwitch` 支持鼠标点击和键盘的空格键、回车键。开关位置和轨道颜色随绑定值更新，过渡遵循系统的减弱动效设置。

```vue
<script setup lang="ts">
import { FnSwitch } from "@fast-crud/fast-crud-next";
import { ref } from "vue";

const enabled = ref(false);
</script>

<template>
  <FnSwitch v-model="enabled" label="启用通知" />
</template>
```

在 CRUD 字段的 `form.component` 或 `cell.component` 中使用 `{ name: markRaw(FnSwitch) }`，开关会读取字段的标题作为名称。布尔字段可通过 `form.value: false` 设置初始值。启动任一 Admin 并打开 `/crud/basis/compute`，可在列表和新增、编辑表单中切换「自定义单价」。[Admin 示例](../demos/admin.md)

## 复选框、单选框与按钮组

下面的片段假设已从包入口导入 `FnCheckbox`、`FnRadio` 和 `FnButtonGroup`，并在页面中声明相应的响应式值。

```vue
<FnCheckbox v-model="allVisible" :indeterminate="someVisible && !allVisible" label="显示全部列" />

<FnRadio v-model="alignment" name="alignment" value="left" label="左对齐" />
<FnRadio v-model="alignment" name="alignment" value="right" label="右对齐" />

<FnButtonGroup
  v-model="fixed"
  label="名称列固定位置"
  :options="[
    { value: 'left', label: '左侧' },
    { value: '', label: '取消固定' },
    { value: 'right', label: '右侧' },
  ]"
/>
```

`FnCheckbox` 通过 `indeterminate` 单独控制半选状态。`FnRadio` 同组使用相同的 `name`，每项设置不同的 `value`。按钮组选项使用 `label` 命名，纯图标选项可复用提示文案 `title`。列设置抽屉使用复选框和按钮组。[表格 API](./table.md#列设置如何生效)

需要监听普通按钮的原生点击事件时，可用 `<FnButtonBase text="保存" @click="save" />`。需要在 CRUD 操作区配置普通按钮或下拉菜单时，使用 `FnButtonProps`，见[按钮与操作区](./actions.md)。

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
