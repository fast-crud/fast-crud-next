# 列配置与动态渲染

配置入口是 `columns[key]`。同一个业务字段可同时在表格、搜索和表单中使用，每个区域可以独立覆盖显示方式。

| 路径 | 类型或默认行为 | 用途 |
| --- | --- | --- |
| `key`、`title` | 必填字符串 | 字段键与标题。通常让映射键和 `key` 一致。 |
| `type` | 字符串、字符串数组或对应的 Ref | 套用类型预设，后面的类型和显式字段配置优先。 |
| `dict` | `FnDictStore` | 字典类型从此处取得选项，可在各区域用 `component.options` 覆盖。 |
| `show` | 默认显示 | 静态控制表格列，并决定此字段是否加入 CRUD 表单。 |
| `cell` | 可动态计算 | 控制单元格的显示、渲染和列布局。 |
| `search` | 按需启用，可动态计算 | 声明该字段参与搜索，见[搜索与状态筛选](./search.md)。 |
| `form` | 按需启用，可动态计算 | 声明该字段参与表单，见[表单与弹窗](./forms.md)。 |

类型预设也可能提供 `search` 或 `form`。例如 `type: 'text'` 给两个区域配置输入框。要保留该类型的编辑能力、隐藏搜索字段，可设 `search: { show: false }`。内置类型、字典和注册方式见[字段类型与字典](../guide/column-types.md)。

## 独立控制三个区域

| 目标 | 配置 |
| --- | --- |
| 只从表格隐藏字段，保留表单和搜索 | `cell: { show: false }` |
| 只从搜索区域隐藏字段 | `search: { show: false }` |
| 只从表单隐藏字段 | `form: { show: false }` |
| 保留控件但禁止操作 | 在对应区域设置 `component: { disabled: true }`，组件需支持 `disabled`。 |
| 根据当前值决定是否禁用 | 将 `compute(...)` 放在对应区域的 `component.disabled`，读取 `row` 或 `form`。 |

如果表格显隐和代码预期不一致，检查该列是否已保存为[用户偏好](./table.md#用户偏好)。

## 单元格常用项

| 路径 | 类型或默认行为 | 用途 |
| --- | --- | --- |
| `cell.show` | 默认显示 | 隐藏单元格内容。静态配置下，外层 `show` 未设置时也参与表头显隐。 |
| `cell.width`、`cell.order` | `number \| string`、`number` | 宽度与列顺序，较小的 `order` 在前。数字宽度以 px 计。 |
| `cell.fixed`、`cell.align` | `left \| right`、`left \| center \| right` | 固定列与内容对齐。 |
| `cell.resizable` | 默认允许 | 设为 `false` 时关闭拖宽，并禁用这一列的表头排序。 |
| `cell.ellipsis` | 布尔值 | 显示单行省略内容。 |
| `cell.setting` | `{ show?: boolean, disabled?: boolean }` | 隐藏该列的设置项，或禁止在面板中修改该列。 |
| `cell.render` | `(ctx: FnRowContext<Row>) => VNodeChild` | 自定义内容，优先于组件渲染。 |
| `cell.component` | 组件配置对象 | 通过 `name` 指定组件，`vModel` 默认使用 `modelValue`。更新会写回当前行。 |
| `cell.component.options` | 选项数组或 Ref | 提供给 `FnDictTag` 等组件。启用 `tabs.refCol` 时也用作标签选项。 |
| `cell.slots.header` | 渲染回调，收到 `{ column }` | 替换列标题内容。 |
| `cell.slots.default` | 渲染回调，收到当前行上下文 | 替换单元格内容，优先于 `cell.render`。 |

列宽、顺序、固定、显隐还可能被保存的[用户偏好](./table.md)覆盖。

## 在行上下文里计算

下面是可放进 `columns` 的 TSX 片段。表格上下文提供 `row`、`index`、`form`（当前行数据），以及可选的 `getComponentRef(key?)`。

```tsx
status: {
  key: 'status',
  title: '状态',
  cell: {
    width: 120,
    render: ({ row }) => <strong>{row.status}</strong>,
  },
},
price: {
  key: 'price',
  title: '单价',
  cell: {
    component: {
      name: FnInput,
      type: 'number',
      disabled: compute(({ row }) => !row?.customPrice),
    },
  },
},
```

`FnInput` 和 `compute` 均从 `@fast-crud/fast-crud-next` 导入。普通渲染回调用 `render`，只有需要根据上下文计算配置时才使用 `compute`。当前行组件的值更新只写入列表数据，保存到服务端需要调用业务 API。打开 [Admin 示例](../demos/admin.md)的 `/crud/basis/compute` 可验证编辑联动。

### 用一个开关禁用整列输入

同一列的所有单元格需要随页面开关变化时，将同一个 `ref` 传给 `cell.component.disabled`。下面的配置可放入已有列表，`quantity` 应与行数据字段同名。

```ts
import { markRaw, ref } from 'vue'
import { FnInput } from '@fast-crud/fast-crud-next'

const quantityDisabled = ref(false)

const quantity = {
  key: 'quantity',
  title: '数量',
  cell: {
    component: {
      name: markRaw(FnInput),
      type: 'number',
      disabled: quantityDisabled,
    },
  },
}

const actionbar = {
  buttons: {
    toggleQuantity: {
      text: '切换数量输入状态',
      click: () => {
        quantityDisabled.value = !quantityDisabled.value
      },
    },
  },
}
```

把 `quantity` 放入 `columns.quantity`，把 `actionbar` 放入列表配置。单元格通过默认的 `modelValue` 写回字段，只改变当前页面的行数据。需要提交到后端时，可用编辑表单或显式保存。若只让当前行的输入取决于该行数据，则用 `compute(({ row }) => ...)`。三种联动可在 [Admin 动态计算示例](../demos/admin.md#动态计算示例怎么验证)中对照。

## 字典选项

`DictStore` 和 `DictOption` 从包入口导入。`dict-select`、`dict-radio` 和 `dict-checkbox` 把字段的 `dict.getOptions()` 绑定到各分支的 `component.options`。自定义组件也可以直接绑定该 Ref。

| 字段类型 | 表格组件 | 搜索组件 | 表单组件 |
| --- | --- | --- | --- |
| `dict-select` | `FnDictTag` | `FnSelect`，单选，可清空 | `FnSelect`，默认单选 |
| `dict-radio` | `FnDictTag` | `FnSelect`，单选，可清空 | `FnRadioGroup`，单选 |
| `dict-checkbox` | `FnDictTag` | `FnSelect`，多选，可清空 | `FnCheckboxGroup`，多选 |

| `DictStore` 构造选项 | 用途 |
| --- | --- |
| `data?: DictOption[]` | 初始选项，默认空数组。`label` 是字符串，`value` 是字符串、数字或布尔值。 |
| `getDataFunc?: () => Promise<FnTableRow[]>` | 加载原始数据，映射后更新 `getOptions().value`。 |
| `value?: string` | 原始数据的值路径，默认 `value`。 |
| `label?: string \| ((row) => string)` | 原始数据的标签路径或函数，默认 `label`。缺少标签时显示值。 |
| `immediate?: boolean` | 默认立即加载。设为 `false` 时，第一次读取 `getOptions()` 再加载。 |

例如，接口返回 `{ code, displayName }` 时，按真实字段配置映射。

```ts
const departments = new DictStore({
  getDataFunc: () => api.listDepartments(),
  value: 'code',
  label: 'displayName',
})

const departmentColumn = {
  key: 'departmentCode',
  title: '部门',
  type: 'dict-select',
  dict: departments,
}
```

使用同一个字典实例可共享选项。需要按状态搜索时，将 `tabs.refCol` 指向该字段。参阅[搜索与状态筛选](./search.md#通过-tabs-筛选)。
