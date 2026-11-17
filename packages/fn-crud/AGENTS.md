# Agent 开发指南

## 沟通语言

- 任何情况下优先使用中文，包括思考、沟通、文档、界面文案和日志。技术名词、代码标识符、依赖名称和命令按需保留原文。

## 项目范围

- 本仓库是 Fast Crud Next 当前的开发工作区。除非任务明确要求，否则所有实现都留在本仓库。
- 项目是独立的 Vue 3 + TypeScript CRUD 组件开发与演示项目。
- `src/crud` 维护 FnCrud 及其本地 UI 基础组件。不要依赖 Fast Crud 或 `@certd/ui-client`。
- 不添加 Ant Design Vue。基础表格、表单、搜索、弹窗和工具栏应使用本地 Fn 组件或原生 HTML 控件；可选主题适配器必须保持独立，不得由基础入口加载。
- demo 数据和页面展示放在 `src/App.vue`；可复用的组件行为放在 `src/crud`。

## 实现约定

- Vue 单文件组件使用 Vue 3 Composition API 和 `<script setup>`；公开配置、事件和组合式函数保留明确的 TypeScript 类型。
- 优先复用现有 Fn 组件和原生 HTML 控件，不为基础交互引入 UI 框架。
- 组件库已有图标使用 `@lucide/vue`。
- 组件样式使用 `<style lang="less">`，选择器放在组件根 class 下组织；可复用组件需要保留日间和夜间主题表现。
- CRUD state 使用单一数据源：通过 `reactive<FnCrudState>()` 创建，调用 `useFnCrud(state)` 初始化，并将同一份 state 通过 `v-bind` 传给 FnCrud。
- 使用 `installFnCrud({ commonOptions: () => options })` 注册全局默认项；不要为每个列表复制一份可变用户 state。
- 行为变更应添加聚焦测试；测试文件放在被测实现附近。
- 开发新功能后，必须在仓库根目录 `docs/` 对应模块补充该功能的集成方式、配置项和使用示例；README 只保留入口和简要说明。

## 常用命令

- `npm run dev`：启动 Vite 开发服务器。
- `npm test`：运行 Vitest 测试。
- `npm run build`：执行 Vite 生产打包。
- `npm run typecheck`：运行 Vue 和 TypeScript 类型检查。
- `npm run preview`：本地预览生产打包结果。

针对改动运行相应测试和构建。不要通过关闭检查或弱化组件类型约束来掩盖错误。
