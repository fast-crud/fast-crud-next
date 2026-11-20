# Fast Crud Next

Fast Crud Next 是基于 Vue 3 和 TypeScript 的 FnCrud 组件库。源码位于 `src/`，项目不依赖 Ant Design Vue。

## 环境要求

- Node.js 22.12 或更高版本
- npm 10 或更高版本

## 开发与构建

```sh
npm install
```

`npm run build` 打包组件库，`npm run typecheck` 运行 Vue 和 TypeScript 类型检查，`npm test` 运行 Vitest 测试。

## 目录结构

```text
src/
  index.ts             组件库公开入口
  fn-crud.vue          FnCrud 核心组件
  compute.ts / use.tsx 配置计算和组合式函数
  dict.tsx / *.ts      字典、配置合并和偏好
  components/          基础 UI 组件
  form/ modal/ table/  表单、弹窗和表格
  theme/               主题 token 和适配器
```

## 使用 FnCrud

为列表创建一份响应式 state，调用 `useFnCrud` 初始化，再将同一份 state 通过 `v-bind` 传给组件。`useFnCrud` 会为 state 添加工具栏密度切换处理器，表格配置放在 `table` 中。

```ts
import { reactive } from "vue";
import { type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";

const crudState = reactive<FnCrudState>({
  columns: {},
  request: {
    pageRequest: async ({ page }) => ({ records: [], total: 0 }),
  },
  table: { size: 14, density: "comfort" },
});

useFnCrud({ state: crudState });
```

```vue
<FnCrud v-bind="crudState" />
```

应用启动时可调用 `installFnCrud({ commonOptions: () => options })` 注册全局默认配置。FnCrud 解析配置时会调用该工厂函数；列表自己的 state 优先于全局默认值。

## UI 和主题

FnCrud 提供自己的表格、弹窗、表单、通知和按钮基础组件，图标由 Lucide Vue 提供。主题默认值位于 `src/theme/tokens.css`，可直接覆盖 `--fn-*` CSS 变量。Naive UI 主题适配器独立放在对应目录中，不需要安装 UI 框架。

## 测试

测试文件与实现代码放在一起，命名为 `*.test.ts`。运行全部测试：

```sh
npm test
```
