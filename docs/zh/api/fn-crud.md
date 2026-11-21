# FnCrud 配置与实例方法

`FnCrud`、`useFnCrud`、`FnCrudState<Row>` 和 `FnCrudExpose<Row>` 均从 `@fast-crud/fast-crud-next` 导入。创建页面见[快速开始](../guide/getting-started.md)。

## 配置入口

| 要改什么 | 配置 | 参阅 |
| --- | --- | --- |
| 字段、显示方式、类型预设 | `columns` | [列配置](./columns.md) |
| 请求、分页协议、编辑详情 | `request` | [请求 API](./requests.md) |
| 搜索字段、查询按钮、状态标签 | `search`、`tabs` | [搜索与状态筛选](./search.md) |
| 表单模式、标题、校验和插槽 | `form`、`addForm`、`editForm` | [表单与弹窗](./forms.md) |
| 操作栏、工具栏与行按钮 | `actionbar`、`toolbar`、`rowHandle` | [按钮与操作区](./actions.md) |
| 行键、分页、选择和列设置 | `table`、`pagination`、`rowSelect`、`preferenceStorage` | [表格和偏好](./table.md) |
| 标题与顶部元素排布 | `heading`、`layout` | [布局与插槽](#布局与插槽) |

`useFnCrud({ state, crudRef?, i18n? })` 将默认项、全局 `commonOptions` 和页面配置深度合并到 `state`，并返回这个响应式对象。模板通过 `v-bind` 传入同一份 state。除列表字段外，配置里需要保留独立响应式值时，可通过 `ref` 或 `computed` 提供。

## 获取实例

在已有列表页面的 `<script setup>` 中导入 `ref` 和 `FnCrudExpose`，创建实例引用。这里的 `User` 是页面的行类型。

```ts
import { ref } from 'vue'
import { useFnCrud, type FnCrudExpose } from '@fast-crud/fast-crud-next'

const crudRef = ref<FnCrudExpose<User>>()
useFnCrud({ state, crudRef })
```

在模板中添加同名 ref。挂载后即可调用 `crudRef.value` 上的方法。

```vue
<FnCrud ref="crudRef" v-bind="state" />
```

| 方法 | 返回值与用途 |
| --- | --- |
| `table.refresh()` | `Promise<void>`。使用当前页、搜索条件和排序重新请求。 |
| `table.turnPage({ current, pageSize })` | `Promise<void>`。指定从 1 开始的页码和每页条数，重新请求。 |
| `table.getSelectedRowKeys()` | 选中行键。当前实现以字符串返回，包括跨页保留的行键。 |
| `table.clearSelection()` | 清空列表选中项。 |
| `table.delete(rowOrId)` | `Promise<void>`。打开确认弹窗，确认后调用删除请求并刷新。取消时也会在弹窗关闭后结束。 |
| `search.getSearchForm()` | 搜索状态的浅拷贝。 |
| `form.openAddForm(initialForm?)` | `Promise<FnFormContext>`。打开新增表单，可预填数据。 |
| `form.openEditForm(row, initialForm?)` | `Promise<FnFormContext>`。使用列表行或详情初始化，再覆盖 `initialForm`。 |
| `form.openFormDialog(options)` | `Promise<FnFormContext>`。打开由调用方完整配置的表单。 |
| `form.getFormData()`、`form.close()` | 读取或关闭当前表单。无表单时数据为 `undefined`。 |

打开表单的方法在表单挂载后返回上下文。提交完成由表单的 `onSubmit` 处理。

## 常见任务直达

| 要完成的任务 | 对应配置或方法 |
| --- | --- |
| 查询接口为什么拿不到条件或排序 | [分页请求与返回](./requests.md#分页请求与返回) |
| 编辑先取详情，再把主键提交给更新接口 | [接入增删改请求](../recipes/mutations.md#接入请求并显示按钮) |
| 一个字段只在表格显示，或只在编辑表单禁用 | [列配置与动态渲染](./columns.md) |
| 替换搜索按钮或让 Tabs 参与同一次查询 | [搜索与状态筛选](./search.md) |
| 自定义行按钮，或在外部操作选中记录 | [按钮与操作区](./actions.md) · [字典和跨页选择](../recipes/selection.md) |
| 给弹窗加自定义页脚并触发校验和提交 | [自定义弹窗标题和页脚](../recipes/forms.md#自定义弹窗标题和页脚) |
| 配置列宽、列显隐或记住用户分页大小 | [表格、分页、选择与偏好](./table.md) |

## 布局与插槽

默认顶部布局先显示标题，然后排列操作栏、Tabs、搜索、工具栏。`layout` 可自行定义 `[{ cols: [{ type: 'header' }, { type: 'search' }] }]`，行和列都可提供 `style`。没放入布局的区域不会渲染。

| FnCrud 模板插槽 | 效果与可用值 |
| --- | --- |
| `#default` | 替换表格主体，收到表格 props，如 `data`、`columns`、`loading`。 |
| `#header` | 替换标题区域，收到 `selectedRowKeys`。 |
| `#search` | 替换搜索区域，收到 `FnSearchContext`。 |
| `#bodyBottom` | 列设置面板底部，无额外上下文。 |

以上区域也可用 `slots` 对象中的同名渲染回调配置。
