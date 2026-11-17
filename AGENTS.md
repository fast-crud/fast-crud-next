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
- 可被用户或内部组件修改的配置通常由 `crudState` 持有，并由 `useFnCrud(state)` 安装写回回调；组件通过语义明确的更新事件或回调表达修改，不要求强行使用 `v-model`。
- 列设置偏好（显隐、固定、顺序和用户调整后的宽度）是独立于开发者 `columns[key].cell` 的用户数据源，由 `FnCrud` 内部 `ref` 持有并持久化。表格列由开发者配置与用户偏好合并，用户偏好优先；不要通过 `useFnCrud` 改写开发者列配置，也不要在未调整宽度时保存宽度覆盖。
- `pageSize` 和 `density` 的用户偏好同样由 `FnCrud` 内部状态持有，通过 computed 与开发者配置合并。用户修改时触发 `pagination` / `table` 的 `update` 回调并保存偏好；`useFnCrud` 的自动写回应保留并调用使用者传入的回调。
- 更新事件应贴合数据结构。列设置事件由 `FnCrud` 内部处理；列宽通过 `FnTable` 的 `column-resize({ key, width })` 事件更新内部用户偏好。其他用户可修改配置仍按其领域的单一数据源处理，避免把事件逐层转发到 FnCrud 再中转写入。
- 行为变更应添加聚焦测试；测试文件放在被测实现附近。
- 开发新功能后，必须在 `docs/` 对应模块补充该功能的集成方式、配置项和使用示例；README 只保留入口和简要说明。

## Admin CRUD 页面约定

- Ant Design Vue、Element Plus、Naive UI admin 的 CRUD 页面按 fast-crud admin 的分类放在 `src/views/crud/<category>/<page>/`，分类优先使用 `basis`、`dict`、`feature`、`form`、`component` 等领域目录。
- 每个 CRUD 页面目录包含 `api.ts`、`index.vue` 和 `mock.ts`：API 请求放在 `api.ts`，页面与 FnCrud 配置放在 `index.vue`，该页 mock 数据和路由放在 `mock.ts`。
- CRUD 路由应与分类目录对应，例如 `src/views/crud/basis/basic/index.vue` 使用 `/crud/basis/basic`。更改路径时同步更新侧栏、页面标题、文档，并为已有地址保留重定向。
- 非 CRUD 页面不强行套用上述文件结构。

## 常用命令

- `npm run dev`：启动 Vite 开发服务器。
- `npm test`：运行 Vitest 测试。
- `npm run build`：执行 Vite 生产打包。
- `npm run typecheck`：运行 Vue 和 TypeScript 类型检查。
- `npm run preview`：本地预览生产打包结果。

## Admin 实时开发

- 用户日常会同时启动三套 admin 页面，修改代码后通过 Vite HMR 实时查看效果：AntDV `http://localhost:5173`、Element `http://localhost:5174`、Naive `http://localhost:5175`。
- 页面样式或展示改动完成后，可直接打开这三个页面做对比和验证；普通 UI 开发无需额外执行编译或生产打包。
- 行为逻辑改动仍按需运行相关测试或类型检查。不要通过关闭检查或弱化组件类型约束来掩盖错误。
- 路由或页面导入路径修复无需执行 `vite build`；优先通过文件存在性、编辑器诊断或开发服务器 HMR 做轻量验证，只有任务明确要求时才运行生产构建。
