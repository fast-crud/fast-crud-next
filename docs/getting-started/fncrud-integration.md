# 集成 FnCrud

FnCrud 是 Vue 3 组件。它自己提供表格、搜索、表单、弹窗、分页、行选择和通知的基础实现，不要求应用安装 Ant Design Vue、Element Plus 或 Naive UI。

## 前置条件

- Node.js 22.12 或更高版本
- Vue 3.5 或更高版本
- TypeScript 5.8 或更高版本

在当前 workspace 中安装依赖：

```sh
pnpm install
```

## 配置入口

FnCrud 通过 `@fast-crud/fast-crud-next` 包入口引入。当前 workspace 中，admin 和共享模块在 `package.json` 声明依赖：

```json
{
  "dependencies": {
    "@fast-crud/fast-crud-next": "workspace:*"
  }
}
```

在仓库根目录执行 `pnpm install` 后，包管理器会链接 `packages/fn-crud` 的公开入口，无需配置 Vite alias 或 TypeScript paths，也不要通过相对路径引用包内源码。当前包尚未作为公共 npm 包发布，仓库外应用需要自行接入该 workspace 包。

基础入口自动加载默认主题 token；需要单独加载样式或主题适配器时，使用公开子路径：

```ts
import "@fast-crud/fast-crud-next/theme/tokens.css";
import { useNaiveTheme } from "@fast-crud/fast-crud-next/theme/naive";
import { useFnAntdvUi } from "@fast-crud/fast-crud-next/theme/antdv";
```

## 根组件

`FnConfigProvider` 必须包住使用 FnCrud 的页面。它提供 FnCrud 的弹窗和通知上下文：

```vue
<script setup lang="ts">
import { FnConfigProvider } from "@fast-crud/fast-crud-next";
</script>

<template>
  <FnConfigProvider>
    <RouterView />
  </FnConfigProvider>
</template>
```

`FnConfigProvider` 当前只负责提供默认 slot 和 Fn UI 服务上下文，不承载列表 state 或全局 CRUD 配置。集成时按职责分别配置：

- `FnConfigProvider`：包裹页面，提供弹窗、通知所需的 Vue 上下文。
- `installFnCrud({ commonOptions })`：注册所有列表共享的默认 CRUD 配置。
- `uiContext.setServices({ notification, message })` 或对应 UI 适配器：替换通知和消息实现。
- `NConfigProvider`、`AConfigProvider` 等宿主组件：管理第三方 UI 框架自身的主题和 locale。

不要把 `FnCrudState` 或 `installFnCrud` 的配置对象当作 `FnConfigProvider` 的参数传入；列表配置仍通过 `useFnCrud({ state, crudRef })` 和 `<FnCrud ref="crudRef" v-bind="state" />` 传递。

## 创建列表 state

`FnCrudOptions` 描述原始配置类型；`FnCrudOptionsInput<Row>` 将顶层字段扩展为原始值或 Vue `Ref`/`ComputedRef`，用于 `reactive` 的输入泛型。`FnCrudState<Row>` 表示深层解包后的响应式状态，由 `useFnCrud` 接收并返回。

一个列表只维护一份响应式 state，并用 `crudRef` 获取 FnCrud expose。先调用 `useFnCrud({ state, crudRef })`，模板再把同一份 state 传给 `FnCrud`：

```vue
<script setup lang="ts">
import { reactive, ref } from "vue";
import { FnCrud, FnInput, type FnCrudExpose, type FnCrudOptionsInput, useFnCrud } from "@fast-crud/fast-crud-next";

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "林晓" },
  { id: 2, name: "周宁" },
];

const state = reactive<FnCrudOptionsInput<User>>({
  columns: {
    id: { key: "id", title: "编号" },
    name: {
      key: "name",
      title: "姓名",
      search: {
        component: {
          name: FnInput,
          vModel: "modelValue",
          placeholder: "搜索姓名",
        },
      },
      form: {
        rules: [{ required: true, message: "请输入姓名" }],
      },
    },
  },
  table: { rowKey: "id" },
  request: {
    pageRequest: async ({ page, query }) => {
      const keyword = String(query.name || "").trim();
      const filtered = users.filter(user => !keyword || user.name.includes(keyword));
      return {
        records: filtered.slice(page.offset, page.offset + page.limit),
        total: filtered.length,
      };
    },
  },
});

const crudRef = ref<FnCrudExpose>();
useFnCrud({ state, crudRef });
</script>

<template>
<FnCrud ref="crudRef" v-bind="state" />
</template>
```

真实项目中，`pageRequest` 应调用后端接口，把接口响应转换为 `{ records, total }`。`page.offset` 从 0 开始，`page.limit` 是当前页大小。

## 增删改请求

在 `request` 中按需实现 `addRequest`、`editRequest` 和 `delRequest`：

```ts
request: {
  pageRequest: loadUsers,
  addRequest: form => api.users.create(form),
  editRequest: form => api.users.update(Number(form.id), form),
  delRequest: id => api.users.remove(Number(id)),
}
```

请求函数返回 Promise 即可。FnCrud 在操作完成后会刷新当前列表；本地 demo 可以直接在函数中更新响应式数组。

## 全局默认配置

在应用入口调用 `installFnCrud` 注册默认项。使用工厂函数，避免多个列表共享一份可变 state：

```ts
import { installFnCrud } from "@fast-crud/fast-crud-next";

installFnCrud({
  commonOptions: () => ({
    table: { size: 14, density: "comfort" },
    pagination: { pageSize: 20 },
  }),
});
```

列表自己的配置优先于全局默认配置。

## 下一步

- 配置字段和动态联动：[`../concepts/configuration.md`](../concepts/configuration.md)
- 分页、字典和跨页选择：[`../concepts/data-and-selection.md`](../concepts/data-and-selection.md)
- 主题适配：[`../themes/overview.md`](../themes/overview.md)
