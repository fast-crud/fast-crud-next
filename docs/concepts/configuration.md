# FnCrud 配置

FnCrud 的配置按领域分为 `columns`、`table`、`pagination`、`rowSelect`、`rowHandle` 和 `request`。页面组件只负责组装 state，具体行为由对应领域配置负责。

## columns

每个字段至少需要 `key` 和 `title`：

```ts
columns: {
  name: {
    key: "name",
    title: "服务名称",
    search: { component: { name: FnInput, vModel: "modelValue" } },
    form: { rules: [{ required: true, message: "请输入服务名称" }] },
    cell: { order: 1, width: 220 },
  },
}
```

- `search` 控制搜索区域字段。
- `form` 控制新增和编辑字段。
- `cell` 控制表格列、宽度、顺序和渲染方式。

组件配置中的 `name` 可以是组件对象或字符串。当前类型定义仍在逐步收紧，使用自定义 Vue 组件时优先使用项目已有适配器，并在类型不完整处保留局部类型断言。

## 动态配置

使用 `compute` 根据当前行或表单上下文计算配置：

```ts
threshold: {
  key: "threshold",
  title: "阈值",
  form: compute(({ form }) => ({
    show: form?.scope !== "测试",
    component: { name: FnInput, vModel: "modelValue", type: "number" },
  })),
}
```

常见用途包括条件显示、选项联动、状态文案和行级派生值。动态字段隐藏后，表单校验也应同步确认是否仍需要该字段。

## 表格和分页

```ts
table: { rowKey: "id", minWidth: 800 },
pagination: { pageSize: 20, pageSizeOptions: ["20", "50"] },
rowHandle: { width: 140 },
```

`rowKey` 应稳定且唯一。列较多时设置 `minWidth`，避免操作列和字段内容互相挤压。

## 工具栏职责

- `actionbar`：新增、批量操作等面向当前列表的主要动作。
- `toolbar`：密度、列设置等列表视图工具。
- `rowHandle`：单行编辑、删除等行级动作。

不要把行级动作复制到全局 actionbar，也不要在页面里重复实现 FnCrud 已提供的密度和列设置逻辑。

## 按钮反馈

FnCrud 的普通按钮默认会从指针按下位置向外扩散一圈波纹，再淡出；行操作、工具栏和表单按钮使用相同反馈，无需额外配置。系统启用“减少动态效果”时会关闭波纹动画。按钮的禁用和加载状态不会触发波纹。
