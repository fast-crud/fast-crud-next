# Agent 开发指南

## 沟通语言

- 任何情况下优先使用中文，包括思考、沟通、文档、界面文案和日志。技术名词、代码标识符、依赖名称和命令按需保留原文。

## 项目范围

- 本仓库是 Fast Crud Next 当前的开发工作区。除非任务明确要求，否则所有实现都留在本仓库。
- 项目是独立的 Vue 3 + TypeScript CRUD 组件开发与演示项目。
- FnCrud 核心源码、表单、表格、provider、主题和 UI 基础组件按领域直接放在 `src/` 下。不要依赖 Fast Crud 或 `@certd/ui-client`。
- 不添加 Ant Design Vue。基础表格、表单、搜索、弹窗和工具栏应使用本地 Fn 组件或原生 HTML 控件；可选主题适配器必须保持独立，不得由基础入口加载。
- 本包只维护可复用组件，不在包内保留 demo 应用入口。

## 实现约定

- Vue 单文件组件使用 Vue 3 Composition API 和 `<script setup lang="tsx">`；公开配置、事件和组合式函数保留明确的 TypeScript 类型。
- 所有返回 VNode 的 render 方法使用 TSX/JSX 语法编写，不使用 `h()` 拼接 render 树。
- 优先复用现有 Fn 组件和原生 HTML 控件，不为基础交互引入 UI 框架。
- 组件库已有图标使用 `@lucide/vue`。
- 所有 Vue 组件样式统一使用 `<style lang="less">`，并用 Less 大括号嵌套结构编写；默认不使用 `scoped`。选择器应尽量嵌套在组件名对应的根 class 下，避免无根 class 的全局规则；Teleport/Portal、Transition 状态等根节点外渲染的内容，可使用有明确组件前缀的独立根 class。确需使用 `scoped` 时应说明原因；可复用组件需要保留日间和夜间主题表现。
- `packages/fn-crud/src` 的样式中禁止使用 `.ant-*`、`.n-*`、`.el-*` 等第三方 UI 组件类选择器进行样式覆盖；样式应基于本地 Fn 组件类和主题变量实现。
- CRUD state 使用单一数据源：通过 `reactive<FnCrudState>()` 创建，调用 `useFnCrud({ state, crudRef })` 初始化，并将同一份 state 通过 `v-bind` 传给 FnCrud。
- 项目尚未正式发布，公开配置和行为变更无需保留旧字段或内部兼容兜底；应直接迁移仓库内调用方、示例和测试到最清晰的新接口。用户可观察或修改的运行时状态应归入对应的 `crudState` 领域配置，并由 `useFnCrud({ state, crudRef })` 安装写回回调，避免组件内部维护重复数据源。
- 表格选择状态的唯一数据源为 `crudState.rowSelect.selectedRowKeys`；`useFnCrud({ state, crudRef })` 初始化空数组并安装 `onChange` 写回，FnCrud 不另存一份选择 keys。
- 使用 `installFnCrud({ commonOptions: () => options })` 注册全局默认项；不要为每个列表复制一份可变用户 state。
- 可被用户或内部组件修改的配置通常由 `crudState` 持有，并由 `useFnCrud({ state, crudRef })` 安装写回回调；组件通过语义明确的更新事件或回调表达修改，不要求强行使用 `v-model`。
- 列设置偏好（显隐、固定、顺序和用户调整后的宽度）是独立于开发者 `columns[key].cell` 的用户数据源，由 `FnCrud` 内部 `ref` 持有并持久化。表格列由开发者配置与用户偏好合并，用户偏好优先；不要通过 `useFnCrud` 改写开发者列配置，也不要在未调整宽度时保存宽度覆盖。
- `pageSize` 和 `density` 的用户偏好同样由 `FnCrud` 内部状态持有，通过 computed 与开发者配置合并。用户修改时触发 `pagination` / `table` 的 `update` 回调并保存偏好；`useFnCrud` 的自动写回应保留并调用使用者传入的回调。
- 更新事件应贴合数据结构。列设置事件由 `FnCrud` 内部处理；列宽通过 `FnTable` 的 `column-resize({ key, width })` 事件更新内部用户偏好。其他用户可修改配置仍按其领域的单一数据源处理，避免把事件逐层转发到 FnCrud 再中转写入。
- 行为变更应添加聚焦测试；测试文件放在被测实现附近。
- 开发新功能后，必须在仓库根目录 `docs/` 对应模块补充该功能的集成方式、配置项和使用示例；README 只保留入口和简要说明。
- 每个组件支持的默认插槽和具名插槽都必须有可运行的 CRUD 示例；示例要像 Fast Crud 插槽示例一样标出每个插入位置，并演示该插槽可用的上下文。新增或调整插槽时同步更新示例页和对应文档。

## 常用命令

- `npm test`：运行 Vitest 测试。
- `npm run build`：执行 Vite 生产打包。
- `npm run typecheck`：运行 Vue 和 TypeScript 类型检查。

针对改动运行相应测试和构建。不要通过关闭检查或弱化组件类型约束来掩盖错误。
