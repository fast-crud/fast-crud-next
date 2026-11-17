# FnCrud 设计待优化

以下事项来自 `fn-admin` 示例开发时的直接使用记录，先保留为后续设计输入，不在样例任务中改变公共行为。

## 已验证的摩擦点

- 组件配置的 `FnComponentProps.name` 只声明为 `string`，但实际渲染器需要接收 Vue `Component`；示例传入 `FnInput` 时只能用 `as any` 绕过类型。建议把字段名调整为 `Component | string`，并为组件适配器提供可推断的 v-model 类型。
- `reactive<FnCrudState<Row>>` 会递归解包选项里的响应式对象（例如 `DictStore` 内的 Ref），导致运行时仍有效的配置无法通过类型检查。当前示例只能先构造对象再断言回 `FnCrudState<Row>`。需要区分“用户配置输入类型”和 Vue 深层响应式后的状态类型。
- `rowSelect.onChange(keys, rows)` 中，启用 `crossPage` 后 `keys` 会保留跨页选择，而 `rows` 只能包含当前已加载页的记录。调用方必须自行按 key 回查数据，这个边界应在回调命名和文档中明确，或提供完整选择项解析 API。
- `cell.dict` 目前为单元格组件提供选项，但普通文本单元格仍显示原始 value，不会自动映射 label。字典列表需要自己写 `render` 做映射；应明确 dict 的职责，或为标准文本展示提供一致的 value resolver。
- 每个列表的本地数据页都要重复编写过滤、分页、增改删和 ID 分配。请求接口应继续保持可替换，但 demo/mock 场景可以有轻量的本地数据适配工具，减少样例噪音。

## 后续验证

- 用真实主题适配器分别验证字典标签的颜色、表单控件绑定和窄屏搜索布局，再决定是否调整 `DictStore` 或组件渲染契约。
- 评估 FnCrud 配置对象的字段归属与 `rowHandle`、`actionbar`、`toolbar` 的职责边界；目前示例无需为此引入新抽象。
