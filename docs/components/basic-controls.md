# Fn 基础控件

`FnCheckbox`、`FnRadio` 和 `FnButtonGroup` 是可单独导入的 Vue 控件，使用 Fn 主题变量并兼容明暗主题。

```ts
import { FnButtonGroup, FnCheckbox, FnRadio } from "@fast-crud/fast-crud-next";
```

## 复选框

`FnCheckbox` 使用布尔值 `v-model`，支持 `disabled`、`indeterminate` 和原生 input 属性。`change` 事件参数为 `(checked, event)`。

```vue
<FnCheckbox v-model="visible" aria-label="显示服务名称" />
<FnCheckbox :model-value="someVisible" :indeterminate="someVisible && !allVisible" aria-label="全选" />
```

## 单选框

`FnRadio` 使用 `modelValue` 和 `value` 比较选中项。需要互斥的一组单选框应传入相同的 `name`；`change` 参数为 `(value, event)`。

```vue
<FnRadio v-model="alignment" name="alignment" value="left" aria-label="左对齐" />
<FnRadio v-model="alignment" name="alignment" value="right" aria-label="右对齐" />
```

## 按钮组

`FnButtonGroup` 接收 `options`、必填的无障碍组名 `label` 和当前 `modelValue`。每个选项可配置 `value`、可见文本 `label`、tooltip `title`、`ariaLabel`、Lucide `icon` 和 `disabled`。

```vue
<FnButtonGroup
  v-model="fixed"
  label="名称列固定位置"
  :options="[
    { value: 'left', title: '固定到左侧', ariaLabel: '固定到左侧', icon: ChevronLeft },
    { value: '', title: '取消固定', ariaLabel: '取消固定', icon: X },
    { value: 'right', title: '固定到右侧', ariaLabel: '固定到右侧', icon: ChevronRight },
  ]"
/>
```

控件发出 `update:modelValue` 和 `change` 事件。按钮组选中状态使用 `aria-pressed` 暴露。

## 按钮

`FnButtonBase` 是不依赖 CRUD 的基础按钮，使用 `FnButtonBaseProps`。CRUD 配置中的 `buttonProps` 使用 `FnButtonProps`，由 `FnButton` 根据 `buttonType` 选择基础按钮或下拉按钮。业务上下文应由调用方绑定到 `click` 或菜单项回调中。

```ts
import { FnButton, FnButtonBase } from "@fast-crud/fast-crud-next";
import type { FnButtonBaseProps, FnButtonProps } from "@fast-crud/fast-crud-next";

const plainButton: FnButtonBaseProps = { text: "保存", type: "primary" };
const dropdownButton: FnButtonProps = {
  text: "更多操作",
  buttonType: "dropdown",
  items: [{ key: "archive", label: "归档", click: () => archiveCurrentRecord() }],
};
```

```vue
<FnButtonBase v-bind="plainButton" @click="save" />
<FnButton v-bind="dropdownButton" />
```
