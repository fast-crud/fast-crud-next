# 核心配置

## 配置结构

| 配置项 | 用途 |
| --- | --- |
| `columns` | 按字段组织配置。`cell` 控制表格单元格，`search` 控制搜索字段，`form` 控制表单字段。 |
| `request` | `pageRequest` 加载分页数据，可按需提供 `addRequest`、`editRequest` 和 `delRequest`。 |
| `table`、`pagination` | 配置行标识、密度和分页。 |
| `rowSelect` | 配置行选择及选中的行键。 |
| `form`、`addForm`、`editForm` | 配置公共表单与新增、编辑模式的差异。打开表单时，模式配置覆盖公共配置。 |
| `actionbar`、`toolbar`、`rowHandle` | 配置操作栏、工具栏和行操作。 |

## 全局默认项

应用启动时可通过 `installFnCrud` 注册默认配置。`useFnCrud` 按内置默认值、全局 `commonOptions`、当前列表配置的顺序深度合并，后者优先。

```ts
import { installFnCrud } from '@fast-crud/fast-crud-next'

installFnCrud({
  commonOptions: () => ({
    table: { density: 'comfort' },
    pagination: { pageSize: 20 },
  }),
})
```

## 动态配置

根据页面状态变化的属性可使用 Vue 的 `ref` 或 `computed`。需要读取当前行或表单上下文时，使用 `compute(...)`。例如，根据表单中的轮换方式决定是否显示轮换周期字段。单个属性变化时，把动态值放在对应的叶子属性上。

在 [Admin 示例](../demos/admin.md) 中可查看动态配置和条件表单的联动效果。
