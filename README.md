# Fast Crud Next

Fast Crud Next 是基于 Vue 3 和 TypeScript 的 FnCrud 开发与演示 workspace。FnCrud 源码位于 `packages/fn-crud`，示例 admin 位于 `packages/fn-admin`，分别展示本地 Fn 组件与 Ant Design Vue、Element Plus、Naive UI 的集成方式。

FnCrud 的基础交互不依赖任何 UI 框架，包含搜索、状态标签、分页、行选择、新增、编辑、删除、密度切换和列设置。主题适配器按需加载，基础入口不会强制引入第三方 UI 框架。

## 环境要求

- Node.js 22.12 或更高版本
- npm 10 或更高版本

## 启动项目

```sh
npm install
cd packages/fn-crud
npm run dev
```

Vite 启动后会输出本地访问地址。三套 admin 需要在各自目录启动：

```sh
cd packages/fn-admin/fn-admin-antdv4
npm run dev -- --port 5173

cd packages/fn-admin/fn-admin-element
npm run dev -- --port 5174

cd packages/fn-admin/fn-admin-naive
npm run dev -- --port 5175
```

在对应包目录执行生产打包和预览：

```sh
npm run build
npm run preview
```

根目录的 `npm test` 会运行 workspace 中的 Vitest 测试；`npm run typecheck` 用于运行根配置的 Vue 和 TypeScript 类型检查。

FnCrud demo 的生产打包和预览命令如下：

```sh
cd packages/fn-crud
npm run build
npm run preview
```

## 目录结构

```text
packages/
  fn-crud/              FnCrud 核心组件、类型、组合式函数、主题和测试
  fn-admin/
    shared/             三套 admin 共用的 CRUD 示例页面和组件
    fn-admin-antdv4/    Ant Design Vue 示例
    fn-admin-element/   Element Plus 示例
    fn-admin-naive/     Naive UI 示例
docs/
  getting-started/      集成和首次使用
  concepts/             配置、请求、字典和选择模型
  themes/               token 与主题适配
  demos/                admin 示例说明
  development/          开发和文档约定
```

## 集成 FnCrud

最小集成由四步组成：引入 FnCrud、创建单一响应式 state、调用 `useFnCrud` 初始化、在模板中把同一份 state 传给 `FnCrud`。应用根部还需要放置 `FnConfigProvider`，它负责 FnCrud 的弹窗和通知服务。

```ts
import { reactive } from "vue";
import { type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";

interface User { id: number; name: string }
const users: User[] = [{ id: 1, name: "林晓" }, { id: 2, name: "周宁" }];

const crudState = reactive<FnCrudState<User>>({
  columns: {
    id: { key: "id", title: "编号" },
    name: {
      key: "name",
      title: "姓名",
      form: { rules: [{ required: true, message: "请输入姓名" }] },
    },
  },
  request: {
    pageRequest: async ({ page, query }) => {
      const keyword = String(query.name || "").trim();
      const all = keyword ? users.filter(user => user.name.includes(keyword)) : users;
      return { records: all.slice(page.offset, page.offset + page.limit), total: all.length };
    },
  },
  table: { rowKey: "id", size: 14, density: "comfort" },
});

useFnCrud(crudState);
```

```vue
<FnCrud v-bind="crudState" />
```

模板和根组件：

```vue
<FnConfigProvider>
  <FnCrud v-bind="crudState" />
</FnConfigProvider>
```

应用启动时可调用 `installFnCrud({ commonOptions: () => options })` 注册全局默认配置。FnCrud 解析配置时会调用该工厂函数；列表自己的 state 优先于全局默认值。

完整集成说明、Vite alias、增删改请求、动态字段和表单校验见 [`docs/getting-started/fncrud-integration.md`](docs/getting-started/fncrud-integration.md)。

## UI 和主题

FnCrud 提供自己的表格、弹窗、表单、通知和按钮基础组件，图标由 Lucide Vue 提供。主题默认值位于 `packages/fn-crud/src/theme/tokens.css`，可直接覆盖 `--fn-*` CSS 变量。Naive UI 和 Ant Design Vue 主题适配器独立放在对应目录中，应用按需调用。

主题和三套 admin 的差异说明见 [`docs/themes/overview.md`](docs/themes/overview.md)。

## 文档

文档入口：[`docs/README.md`](docs/README.md)。新功能的使用方式必须在实现完成后同步补充到 `docs/` 对应模块，具体约定见 [`docs/development/documentation.md`](docs/development/documentation.md)。

## 测试

测试文件与实现代码放在一起，命名为 `*.test.ts`。运行全部测试：

```sh
npm test
```
