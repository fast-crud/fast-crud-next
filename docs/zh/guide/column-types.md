# 字段类型

在 `columns[key].type` 声明字段类型，即可复用单元格、搜索和表单配置。字段仍可用 `cell`、`search` 和 `form` 覆盖默认值。

```vue
<script setup lang="tsx">
import { DictStore, FnButton, FnCrud, addTypes, useFnCrud, type FnCrudOptions } from '@fast-crud/fast-crud-next'
import { reactive, ref } from 'vue'

addTypes({
  required: { form: { rules: [{ required: true, message: '请填写备注' }] } },
})

const statusType = ref('dict-select')
const statusDict = new DictStore({ data: [{ value: 'active', label: '生效' }] })
const state = reactive<FnCrudOptions>({
  columns: {
    status: { key: 'status', title: '状态', type: statusType, dict: statusDict },
    note: { key: 'note', title: '备注', type: ['textarea', 'colspan', 'required'],
      form: { component: { rows: 4 } } },
  },
  tabs: { refCol: 'status' },
  request: { pageRequest: async () => ({ records: [{ status: 'active', note: '示例' }], total: 1 }) },
})
useFnCrud({ state })
</script>

<template>
  <FnButton text="切换状态类型" :click="() => statusType = statusType === 'text' ? 'dict-select' : 'text'" />
  <FnCrud v-bind="state" />
</template>
```

## 内置类型

| 类型 | 默认配置 |
| --- | --- |
| `text` | 搜索、表单使用单行输入。 |
| `password` | 搜索、表单使用密码输入。 |
| `textarea` | 搜索使用单行输入，表单使用多行输入。 |
| `number` | 搜索、表单使用数字输入。输入有效数字时更新为 `number`，清空时更新为 `undefined`。 |
| `select` | 搜索、表单使用下拉框。在各分支的 `component.options` 传入 `{ value, label }` 数组。 |
| `dict-select` | 使用字段的 `DictStore` 生成下拉选项和单元格标签。搜索可清空，表单可用 `component.multiple: true` 开启多选。显式提供的 `component.options` 优先。 |
| `dict-radio` | 搜索使用单选 `FnSelect`，表单使用 `FnRadioGroup`。 |
| `dict-checkbox` | 搜索使用多选 `FnSelect`，已选项显示为可移除的标签。表单使用 `FnCheckboxGroup`，两者均绑定选项值数组。 |
| `colspan` | 表单字段占满 24 栅格，可与其他类型组合。 |

可通过 `search.show: false` 或 `form.show: false` 隐藏对应字段。类型数组从左到右合并，靠后的配置优先，字段显式配置最后应用。`search.columns` 和用户列偏好继续各自覆盖搜索和表格配置。

## 注册字段类型

包入口导出 `addTypes(types: Record<string, FnCrudColumnType>)`。也可在应用入口使用 `installFnCrud({ columnTypes: { required: { form: { rules: [{ required: true }] } } } })`。两种方式共用注册表，同名定义采用最后注册的完整配置。只安装语言或公共配置时，先前注册的类型仍然可用。

类型定义可声明 `cell`、`search`、`form`，也可用接收只读字段配置的函数返回这些分支。字段依赖当前行、表单或搜索值时，在对应配置中使用 `compute(...)`。开发环境会报告未知类型，其余已知类型和显式配置照常合并。

## 运行时切换

可以修改响应式 state 中的 `type`，也可提供 `ref` 或 `computed`。表格、搜索和 Tabs 会立即使用新类型。当前搜索值保留，查询仍由原有交互触发。新增和编辑表单在每次打开时使用当前类型。将 `type` 设为 `undefined` 或空数组可移除类型默认值。

在 [Admin 示例](../demos/admin.md)打开 `/crud/dict/credentials`，点击「状态改用文本」可以查看状态列、筛选控件和 Tabs 的变化。关闭并重新打开表单即可查看新类型。

## 字典选项与显示

三种字典类型从字段的 `dict.getOptions()` 取得同一个 Ref，并绑定到各分支的 `component.options`。显式提供的 `options` 优先。单元格默认由 `FnDictTag` 渲染标签，设 `cell.component.type: 'text'` 可显示纯文本。

```ts
const statusDict = new DictStore({
  value: 'status.id',
  label: row => row.status.title,
  getDataFunc: async () => [
    { status: { id: 1, title: '生效' }, color: 'success' },
    { status: { id: 0, title: '停用' }, color: 'default' },
  ],
})
```

未指定映射时读取原始行的 `value` 和 `label`。选项保留字符串、数字或布尔值以及 `color`、`disabled` 等属性。凭证示例的「环境」用 `search.component.multiple: true` 启用多选搜索，在新增和编辑表单用单选组。
