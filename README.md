# Fast Crud Next

Fast Crud Next 是基于 Vue 3 和 TypeScript 的 FnCrud 开发与演示 workspace。核心组件位于 `packages/fn-crud`，Ant Design Vue、Element Plus 和 Naive UI 的示例位于 `packages/fn-admin`。

## 中文文档

从[中文文档首页](docs/zh/index.md)或[快速开始](docs/zh/guide/getting-started.md)了解 FnCrud。三套 Demo 的启动命令见 [Admin 示例](docs/zh/demos/admin.md)。

在仓库根目录运行以下命令启动文档站：

```sh
pnpm install
pnpm docs:dev
```

使用 `pnpm docs:build` 构建文档，使用 `pnpm docs:preview` 预览构建产物。

修改公开配置或行为时，运行 `pnpm docs:check` 定位相关章节。详见[文档维护](docs/zh/development/documentation.md)。

## 开发检查

- `pnpm test` 运行 Vitest 测试。
- `pnpm typecheck` 运行 Vue 和 TypeScript 类型检查。
