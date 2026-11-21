---
description: 将 Fast Crud 页面的请求、列、表单和插槽逐项迁到 FnCrud。
---

# 从 Fast Crud 迁移

已有 Fast Crud 页面的开发者可以先迁一个列表。保留现有路由和后端 API，把列表的初始化、请求适配和界面配置改成 FnCrud 的写法。先让列表查出数据，再恢复新增、编辑、删除和自定义交互。

## FnCrud 相比 Fast Crud 改进了什么

FnCrud 延续了 Fast Crud 通过字段配置生成表格、搜索和表单的方式，重新设计了组件依赖、页面状态和请求接入。

- **基础组件自带，UI 框架按需接入。** Fast Crud 的常见集成需要选择一套 UI 适配包。FnCrud 自带表格、表单、按钮、弹窗和通知，可以用于只搭了 Vue 的应用。已有 Ant Design Vue、Element Plus 或 Naive UI 的项目，可以接入对应主题。 [主题集成](../themes/overview.md)
- **配置和模板绑定同一份状态。** Fast Crud 从 `crudOptions` 生成 `crudBinding`。FnCrud 用 `useFnCrud({ state })` 初始化响应式 `state`，模板直接绑定它。修改分页大小、选中行键或按钮状态时，可以沿页面里这份 state 找到对应配置。 [核心配置](./configuration.md)
- **首屏自动查询，请求转换集中在请求函数里。** FnCrud 挂载后调用 `pageRequest`。在同一个函数里把分页、搜索和排序参数转为后端格式，再把结果转为 `{ records, total }`。新增和编辑直接收到表单数据，删除收到行键，已有 API 可以通过薄适配层继续使用。 [请求 API](../api/requests.md)
- **字段联动写在发生变化的属性上。** 用 `compute` 读取当前行或表单，只计算需要变化的 `show`、`disabled` 等属性。用 TSX 自定义单元格或弹窗内容时，可直接读取对应上下文。比如根据轮换方式显示宽限天数，或在弹窗标题里显示正在输入的流程名称。 [表单联动与插槽](../recipes/forms.md)
- **用户偏好和开发者默认值分别保存。** 用户调整列顺序、列宽、固定位置、每页条数或密度后，刷新页面可恢复。默认保存在浏览器，也可以接入业务自己的存储。页面仍可在列配置中定义默认布局。 [表格、选择与偏好](../api/table.md)

## 写法对照

| Fast Crud 常见写法 | FnCrud 对应写法 |
| --- | --- |
| `app.use(FastCrud, …)` 和 `@fast-crud/ui-*` | 从 workspace 引入 `FnCrud`，用 `FnConfigProvider` 包住页面。全局配置用 `installFnCrud({ commonOptions })`，宿主 UI 的主题按需接入。 |
| `createCrudOptions`、`useFs` 与 `crudBinding` | 创建 `reactive<FnCrudState<Row>>`，调用 `useFnCrud({ state, crudRef })`，模板绑定同一份 `state`。 |
| `onMounted(() => crudExpose.doRefresh())` | 挂载后自动查询。后续主动刷新用 `crudRef.value?.table.refresh()`。 |
| `request.transformQuery` 与 `request.transformRes` | 在 `pageRequest` 或共用请求函数里转换参数、响应。 |
| `columns[name].column` | 用 `columns[name].cell` 配置表格表现，搜索和表单分别放到同一列的 `search`、`form`。 |
| `form.wrapper`、`form.doSubmit` | 弹窗属性放到 `form.dialog`。默认提交调用 `request.addRequest` 或 `request.editRequest`，自定义提交用 `form.onSubmit`。 |
| `dict({ data })` 与 `type: 'dict-select'` | 在列上设置 `type: 'dict-select', dict: new DictStore({ data })`，按 FnCrud 字段类型重新核对默认控件。 |
| `slots.cell_name` | 用 `columns.name.cell.render` 渲染该列，在其他插槽位置按对应组件的配置编写。 |

FnCrud 当前以源码 workspace 包提供。给同一 workspace 的应用声明 `"@fast-crud/fast-crud-next": "workspace:*"`，从根目录安装依赖。依赖和 Provider 的位置见[快速开始](./getting-started.md)，配色与消息服务接入见[主题集成](../themes/overview.md)。

## 1. 让列表先查出数据

把下面的组件放进现有路由，将 `./api` 换成项目里的请求模块。示例中的 `api.listUsers` 接收从 1 开始的 `current` 和每页条数 `size`，并返回解包后的 `{ items, total }`。

```vue
<script setup lang="tsx">
import { reactive, ref } from 'vue'
import {
  FnConfigProvider,
  FnCrud,
  type FnCrudExpose,
  type FnCrudState,
  useFnCrud,
} from '@fast-crud/fast-crud-next'
import * as api from './api'

interface User {
  id: number
  name: string
}

const crudRef = ref<FnCrudExpose<User>>()
const state = reactive<FnCrudState<User>>({
  id: 'users',
  table: { rowKey: 'id' },
  columns: {
    id: { key: 'id', title: '编号', cell: { width: 90 } },
    name: { key: 'name', title: '姓名', type: 'text' },
  },
  request: {
    pageRequest: async ({ page, query, sort }) => {
      const response = await api.listUsers({
        current: Math.floor(page.offset / page.limit) + 1,
        size: page.limit,
        name: query.name,
        orderBy: sort?.prop,
        ascending: sort?.asc,
      })
      return { records: response.items, total: response.total }
    },
  },
})

useFnCrud({ state, crudRef })
</script>

<template>
  <FnConfigProvider>
    <FnCrud ref="crudRef" v-bind="state" />
  </FnConfigProvider>
</template>
```

- **首屏请求两次**。移除旧页挂载时的手动刷新。
- **页码从第二页开始偏移**。确认后端需要的是 1 起始的页码还是 0 起始的偏移量。后端接收 `offset` 和 `limit` 时直接传 `page`。
- **请求 200，列表却为空**。检查 `records` 是否是数组，使用 Axios 原始响应时先取 `response.data`。搜索后返回的 `total` 应是筛选后的总记录数。
- **搜索字段读不到**。FnCrud 的筛选值位于 `query`，确认字段名和 `columns` 的键一致。排序清除时 `sort` 为 `undefined`。
- **旧的请求转换未执行**。逐一迁移 `transformQuery` 中的字段改名和清理规则，以及 `transformRes` 中的响应解包及总数转换。

[请求参数和返回值](../api/requests.md)

## 2. 恢复新增、编辑和删除

把下面的回调加进第一步的 `request`，将 `api` 方法名改为项目里的对应方法。在列表的 `state` 加上 `rowHandle: { width: 150 }`，即可显示行内编辑和删除按钮。

```ts
addRequest: form => api.create(form),
editRequest: form => api.update(Number(form.id), form),
delRequest: id => api.remove(Number(id)),
infoRequest: id => api.get(Number(id)),
```

- `addRequest` 和 `editRequest` 直接接收表单数据。沿用 `({ form, row })` 解构会读到错误的值。
- `delRequest` 接收行键。示例后端使用数字 ID，所以在适配层调用 `Number(id)`。字符串键按业务约定原样传递。
- `infoRequest` 可选，只在打开编辑时调用。表单通常以当前行为初始值，有详情请求时则以详情响应为基础。确保详情返回更新接口需要的 ID，调用 `openEditForm(row, initialForm)` 传入的初始值还会覆盖这些字段。

把字段校验迁到 `columns.<字段>.form.rules`，把公共弹窗属性迁到 `form.dialog`。新增、编辑有差异时，分别通过 `addForm.dialog`、`editForm.dialog` 覆盖。保留默认提交时，请求成功会刷新列表。若设置 `onSubmit` 接管提交，请在回调内完成写入和刷新。提交失败时抛出错误，弹窗会保留并提示失败。

[增删改示例](../recipes/mutations.md) · [表单与弹窗 API](../api/forms.md)

## 3. 迁移联动与自定义渲染

下面两段分别配置 `columns.graceDays` 的表单分支与 `columns.name` 的表格分支。条件由当前表单值决定，TSX 渲染函数读取当前行。

```tsx
// columns.graceDays
graceDays: {
  key: 'graceDays',
  title: '宽限天数',
  type: 'number',
  form: { show: compute(({ form }) => form?.strategy === '自动轮换') },
},

// columns.name
name: {
  key: 'name',
  title: '姓名',
  type: 'text',
  cell: { render: ({ row }) => <strong>{row.name}</strong> },
},
```

从 FnCrud 包导入 `compute`。迁移时把联动放在 `show`、`disabled` 等发生变化的属性上，按读取位置区分 `form` 和 `row`。自定义搜索区用 `#search` 或 `slots.search`。表单弹窗的标题、内容和页脚通过 `form.dialog.slots` 定制，例如 `headerRight` 可读取 `context.form.name`。

碰到依赖 Fast Crud 扩展的上传器、自定义组件或字典时，逐一接到当前字段的 `component`、`cell.render` 或 `DictStore`。若旧按钮或插槽在运行时读取行和表单，检查新位置实际提供的上下文，再迁移回调。

[字段类型](./column-types.md) · [表单联动与插槽](../recipes/forms.md)

## 迁完一页怎么验收

1. 打开原路由，确认首屏只发一次列表请求。搜索、排序、翻页后对照请求参数和总条数。
2. 新增一条、打开编辑、修改后保存，再删除。检查编辑详情带有记录 ID，失败时表单保留并显示错误，成功后列表刷新。
3. 恢复自定义单元格、表单联动和操作按钮。多选跨页时，从 `state.rowSelect.selectedRowKeys` 读取已选键，确认批量操作使用了正确的主键。
4. 刷新页面验证列和分页偏好。给每个列表配置稳定且唯一的 `id`，避免偏好互相覆盖。

三套 Admin 的 `/crud/basis/request-mock` 已接好查询和写操作，`/crud/form/conditional` 提供表单联动对照。[Admin 启动方式](../demos/admin.md)

## Fast Crud 原文

[集成示例](https://github.com/fast-crud/fast-crud/blob/main/docs/zh/guide/start/integration.md) · [请求配置](https://github.com/fast-crud/fast-crud/blob/main/docs/zh/api/crud-options/request.md) · [表单配置](https://github.com/fast-crud/fast-crud/blob/main/docs/zh/api/crud-options/form.md) · [插槽配置](https://github.com/fast-crud/fast-crud/blob/main/docs/zh/api/crud-options/slots.md)
