# Agent 开发指南

## 沟通语言

- 任何情况下优先使用中文，包括思考、沟通、文档、界面文案和日志。技术名词、代码标识符、依赖名称和命令按需保留原文。

## 项目范围

- 本仓库是 Fast Crud Next 当前的开发工作区。除非任务明确要求，否则所有实现都留在本仓库。
- 项目是独立的 Vue 3 + TypeScript CRUD 组件开发与演示项目。
- `src/crud` 维护 FnCrud 及其本地 UI 基础组件。不要依赖 Fast Crud 或 `@certd/ui-client`。
- 不添加 Ant Design Vue。基础表格、表单、搜索、弹窗和工具栏应使用本地 Fn 组件或原生 HTML 控件；可选主题适配器必须保持独立，不得由基础入口加载。
- demo 数据和页面展示放在 `src/App.vue`；可复用的组件行为放在 `src/crud`。

## 设计原则

- 每类配置和运行时状态都应有明确的唯一所有者，并沿单一数据流传递。组合多个来源时明确优先级，在所属边界合成完整配置；不要再用 `formOptions` 这类嵌套载荷重复包装已经合并的配置。
- 配置处理分为两个连续阶段：先使用 `useMerge().merge` 深度合并各来源，再由拥有正确上下文的组件解析 `compute(...)` 等动态值。动态性优先放在叶子属性；只有对象结构本身随上下文变化时才整体计算。
- 组件按职责分工：状态由一个组件持有，回调由对应领域组件执行，组合组件负责映射配置与协调生命周期。不要让多个组件重复维护状态或重复解释同一份配置。
- API 的返回值和事件应准确表达生命周期与数据语义。需要等待子组件挂载才能构造有效 context 时，等待后返回该 context；按钮回调负责动作，不用 Promise 返回值替代已有的 context。

## 实现约定

- Vue 单文件组件使用 Vue 3 Composition API 和 `<script setup lang="tsx">`；公开配置、事件和组合式函数保留明确的 TypeScript 类型。
- 配置示例优先保留静态对象结构；动态值优先使用叶子节点属性上的 `ref`、`computed` 或 `compute(...)`，不要仅为动态单个属性包装整块 `form`、`cell` 或 `component`。只有对象结构本身确实随上下文变化时才整体使用 `compute(...)`。
- 所有返回 VNode 的 render 方法使用 TSX/JSX 语法编写，不使用 `h()` 拼接 render 树。
- 优先复用现有 Fn 组件和原生 HTML 控件，不为基础交互引入 UI 框架。
- 读取或写入对象嵌套路径时优先使用 `lodash-es/get` 和 `lodash-es/set`，不要手写 `split('.')` 配合循环或 `reduce` 遍历路径；普通记录键、配置键和数组索引访问不属于路径操作，不需要强行替换。
- 组件库已有图标使用 `@lucide/vue`。
- 所有 Vue 组件样式统一使用 `<style lang="less">`，并用 Less 大括号嵌套结构编写；默认不使用 `scoped`。选择器应尽量嵌套在组件名对应的根 class 下，避免无根 class 的全局规则；Teleport/Portal、Transition 状态等根节点外渲染的内容，可使用有明确组件前缀的独立根 class。确需使用 `scoped` 时应说明原因；可复用组件需要保留日间和夜间主题表现。
- CRUD state 使用单一数据源：通过 `reactive<FnCrudState>()` 创建，调用 `useFnCrud(state)` 初始化，并将同一份 state 通过 `v-bind` 传给 FnCrud。
- `useFnCrud` 负责构建一套 `crudOptions`，并通过 `v-bind="crudOptions"` 传给 FnCrud；FnCrud 在内部为各内置子组件分别计算 props，再通过 `v-bind` 传给对应子组件。不要在 FnCrud 模板中逐项展开传递子组件 props；除控制显隐所需的 `v-if` 等条件外，子组件配置应集中在对应的 `xxxProps` 中。
- 配置合并是 FnCrud 的核心逻辑，不限于表单：涉及配置对象合并时优先使用 `useMerge().merge` 做深度合并，避免浅展开丢失嵌套配置；它会保留数组覆盖、Ref 和叶子 `compute(...)` 等动态值语义。`useFnCrud` 按默认值、全局 `commonOptions`、局部 state 的优先级合并 `crudOptions`；FnCrud 的各 `xxxProps` 再组合所属配置与内置回调、运行时状态和插槽，并将完整 props 集中传给对应子组件。新增或调整配置时应明确来源优先级及回调保留规则，避免调用方拆开向组件传递多份配置。
- 表单配置是上述合并逻辑的一个具体场景：打开新增/编辑表单时，以公共 `form` 为基础合并对应的 `addForm` / `editForm`，模式配置覆盖公共配置，得到单份表单选项后通过一个 options 对象传给 FnFormDialog；默认请求处理直接作为 `onSubmit`，允许用户配置覆盖；动态值由 FnFormDialog 使用当前 form context 解析。
- Actionbar 和 Toolbar 各由对应的内置组件负责渲染与内部行为：使用 FnActionbar 承载 actionbar 配置，Toolbar 内部处理按钮和列设置。不要在 FnCrud 中自行遍历 Toolbar 按钮或渲染列设置，也不要为 Actionbar、Toolbar 转发或渲染没有用途的默认 slot。
- 项目尚未正式发布，公开配置和行为变更无需保留旧字段或内部兼容兜底；应直接迁移仓库内调用方、示例和测试到最清晰的新接口。用户可观察或修改的运行时状态应归入对应的 `crudState` 领域配置，并由 `useFnCrud(state)` 安装写回回调，避免组件内部维护重复数据源。
- 表格选择状态的唯一数据源为 `crudState.rowSelect.selectedRowKeys`；`useFnCrud(state)` 初始化空数组并安装 `onChange` 写回，FnCrud 不另存一份选择 keys。
- 使用 `installFnCrud({ commonOptions: () => options })` 注册全局默认项；不要为每个列表复制一份可变用户 state。
- 可被用户或内部组件修改的配置通常由 `crudState` 持有，并由 `useFnCrud(state)` 安装写回回调；组件通过语义明确的更新事件或回调表达修改，不要求强行使用 `v-model`。
- 列设置偏好（显隐、固定、顺序和用户调整后的宽度）是独立于开发者 `columns[key].cell` 的用户数据源，由 `FnCrud` 内部 `ref` 持有并持久化。表格列由开发者配置与用户偏好合并，用户偏好优先；不要通过 `useFnCrud` 改写开发者列配置，也不要在未调整宽度时保存宽度覆盖。
- `pageSize` 和 `density` 的用户偏好同样由 `FnCrud` 内部状态持有，通过 computed 与开发者配置合并。用户修改时触发 `pagination` / `table` 的 `update` 回调并保存偏好；`useFnCrud` 的自动写回应保留并调用使用者传入的回调。
- 更新事件应贴合数据结构。列设置事件由 `FnCrud` 内部处理；列宽通过 `FnTable` 的 `column-resize({ key, width })` 事件更新内部用户偏好。其他用户可修改配置仍按其领域的单一数据源处理，避免把事件逐层转发到 FnCrud 再中转写入。
- 行为变更应添加聚焦测试；测试文件放在被测实现附近。
- 开发新功能后，必须在 `docs/` 对应模块补充该功能的集成方式、配置项和使用示例；README 只保留入口和简要说明。
- 每个组件支持的默认插槽和具名插槽都必须有可运行的 CRUD 示例；示例要像 Fast Crud 插槽示例一样标出每个插入位置，并演示该插槽可用的上下文。新增或调整插槽时同步更新示例页和对应文档。

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
- 页面样式或展示改动完成后，可直接打开这三个页面做对比和验证；普通 UI 开发无需额外执行编译或生产打包。不要控制屏幕，用你自己的浏览器查看。
- 行为逻辑改动仍按需运行相关测试或类型检查。不要通过关闭检查或弱化组件类型约束来掩盖错误。
- 路由或页面导入路径修复无需执行 `vite build`；优先通过文件存在性、编辑器诊断或开发服务器 HMR 做轻量验证，只有任务明确要求时才运行生产构建。
