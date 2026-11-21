# 快速开始

FnCrud 为 Vue 3 应用提供表格、搜索、分页和增删改表单。下面以仓库内的应用为例，接入一个可搜索、分页的列表。

## 安装依赖

在仓库根目录执行 `pnpm install`。使用 FnCrud 的 workspace 应用需要在自己的 `package.json` 中声明依赖。

```json
{
  "dependencies": {
    "@fast-crud/fast-crud-next": "workspace:*"
  }
}
```

当前包通过 workspace 链接，暂未发布到公共 npm 仓库。

## 创建列表

使用 `FnConfigProvider` 提供弹窗和通知所需的上下文。每个列表维护一份响应式 `state`，交给 `useFnCrud` 初始化，再通过 `v-bind` 传给 `FnCrud`。

```vue
<script setup lang="tsx">
import { reactive } from 'vue'
import {
  FnConfigProvider,
  FnCrud,
  FnInput,
  type FnCrudState,
  useFnCrud,
} from '@fast-crud/fast-crud-next'

interface User {
  id: number
  name: string
}

const users: User[] = [
  { id: 1, name: '小林' },
  { id: 2, name: '小周' },
]

const state = reactive<FnCrudState<User>>({
  columns: {
    id: { key: 'id', title: '编号' },
    name: {
      key: 'name',
      title: '姓名',
      search: { component: { name: FnInput, vModel: 'modelValue' } },
    },
  },
  table: { rowKey: 'id' },
  actionbar: { show: false, buttons: {} },
  request: {
    pageRequest: async ({ page, query }) => {
      const keyword = String(query.name ?? '').trim()
      const filtered = users.filter(user => user.name.includes(keyword))

      return {
        records: filtered.slice(page.offset, page.offset + page.limit),
        total: filtered.length,
      }
    },
  },
})

useFnCrud({ state })
</script>

<template>
  <FnConfigProvider>
    <FnCrud v-bind="state" />
  </FnConfigProvider>
</template>
```

接入后端时，在 `pageRequest` 中传递 `query`、`page.offset` 和 `page.limit`，再将响应转换成 `{ records, total }`。其中 `records` 是当前页数据，`total` 是过滤后、分页前的总数。

参阅[核心配置](./configuration.md)，或运行 [Admin 示例](../demos/admin.md) 查看完整的新增、编辑和删除流程。
