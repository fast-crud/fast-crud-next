# 快速开始

先打开仓库里的示例，确认本地环境可以运行，再把最小列表放进自己的 Vue 页面。使用 Django 做后端时，可以直接跟着 [Django 实战](./django.md)走完前后端接通。维护已有 Fast Crud 页面时，先看[迁移对照](./from-fast-crud.md)。

## 先运行一个完整页面

需要 Node.js 22.12+ 和 pnpm 10。打开仓库根目录的终端，运行以下命令。

```sh
pnpm install
pnpm --filter @fast-crud/fn-admin-antdv4 dev --port 5173
```

在浏览器访问 `http://localhost:5173/crud/basis/request-mock`。看到服务列表后，试一次搜索和新增。端口被占用时，使用终端实际输出的地址。

## 创建自己的 Vue 应用

FnCrud 当前通过 workspace 提供。在已经执行过 `pnpm install` 的仓库根目录创建 Vue 应用。

```sh
pnpm create vite packages/fncrud-demo --template vue-ts --no-interactive
cd packages/fncrud-demo
pnpm add "@fast-crud/fast-crud-next@workspace:*"
pnpm add -D @vitejs/plugin-vue-jsx less
```

更新新应用的 `vite.config.ts`。Vue 插件编译单文件组件，JSX 插件编译 FnCrud 源码里的 TSX，Less 处理组件样式。

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx()],
})
```

## 创建列表

将以下内容放进新应用的 `src/App.vue`。Vue 模板生成的 `src/main.ts` 会挂载该组件。

```vue
<script setup lang="tsx">
import { markRaw, reactive } from 'vue'
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
      search: { component: { name: markRaw(FnInput), vModel: 'modelValue' } },
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

## 启动并检查

```sh
pnpm dev
```

打开终端显示的本地地址，应看到两行数据。搜索「小林」后应只剩一行。若提示无法解析包，确认应用位于 `packages/` 下，且在仓库根目录安装过依赖。若出现 JSX 或预处理器报错，核对 Vite 插件和 Less。

- `FnConfigProvider` 提供弹窗和通知上下文。
- `useFnCrud({ state })` 初始化配置和回调。模板绑定同一份响应式 state。
- `pageRequest` 在列表加载或刷新时收到分页和搜索条件。返回的 `records` 是当前页数据，`total` 是过滤后、分页前的总数。

接入真实接口时，继续阅读[分页、搜索与排序](../recipes/paging.md)和[请求 API](../api/requests.md)。配置结构见[核心配置](./configuration.md)。
