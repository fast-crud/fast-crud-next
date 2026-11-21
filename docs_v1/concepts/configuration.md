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
  form: {
    show: compute(({ form }) => form?.scope !== "测试"),
    component: { name: FnInput, vModel: "modelValue", type: "number" },
  },
}
```

常见用途包括条件显示、选项联动、状态文案和行级派生值。动态字段隐藏后，表单校验也应同步确认是否仍需要该字段。

配置对象保持静态；单个属性需要响应式或依赖上下文时，将 `ref` 或 `compute(...)` 放在该叶子属性上。同一行的组件通过 `vModel` 自动写回字段，单价输入的 `disabled` 可直接按 `row.customPrice` 计算。整列开关可以读取组件外部的 `ref`，再通过 `actionbar.buttons` 切换。

```ts
const disabledRef = ref(false);
const crudState = reactive<FnCrudState>({
  columns: {
    quantity: {
      key: "quantity",
      title: "数量",
      cell: {
        width: 90,
        component: {
          name: FnInput,
          vModel: "modelValue",
          type: "number",
          disabled: disabledRef,
        },
      },
    },
  },
  actionbar: {
    buttons: {
      toggleQuantity: {
        text: "切换数量输入状态",
        click: () => { disabledRef.value = !disabledRef.value; },
      },
    },
  },
  request: { pageRequest },
});
useFnCrud({ state: crudState });
```

表单中的开关组件通过 `vModel` 写回字段值，关联字段可将 `compute` 放在 `form.show` 上控制显隐。完整示例见 [Admin 示例](../demos/admin-examples.md#ant-design-vue-动态计价)。

## 表格和分页

```ts
table: { rowKey: "id", minWidth: 800, size: 14, density: "comfort" },
pagination: { pageSize: 20, pageSizeOptions: ["20", "50"] },
rowHandle: { width: 140 },
```

`rowKey` 应稳定且唯一。列较多时设置 `minWidth`，避免操作列和字段内容互相挤压。

`rowHandle.buttons` 会由操作列的 `cell.render` 统一渲染；按钮及下拉菜单项使用 `click` 回调接收当前行的 `FnRowContext<Row>`，可读取 `row`、`form` 和 `index`。也可以直接传入 `rowHandle.render` 自定义整列内容。`rowSelect` 同样通过内部 table column 的 `render` 生成行控件，因此表格行组件只负责构造行上下文、解析 `cell: compute(...)` 并遍历列配置。

表格列可在表头右侧拖动调整宽度；拖动时会显示列边界预览，松开后保存该列宽度。未设置 `cell.width` 的普通列默认宽度为 `120px`。调用 `useFnCrud({ state: crudState })` 时会把系统默认选项 `defaultCrudOptions`、全局 `commonOptions` 和页面用户配置依次合并回同一份 state；系统默认选项包含 key 为 `__fn_blank_column` 的无标题、不可调整宽度的自动空白列。该列排列在普通列之后、`rowHandle` 操作列之前，用来吸收容器剩余宽度，且不会出现在列设置中。

常规 CRUD 配置由 `crudState` 持有，调用 `useFnCrud({ state: crudState })` 后，`table` 和 `pagination` 的更新回调会自动写回 state，并保留用户传入的回调。列设置、`pageSize` 和 `density` 的用户偏好由 `FnCrud` 内部状态单独保存，再通过 computed 与开发者配置合并；用户交互会触发对应的 `update` 回调并保存偏好。列设置偏好与开发者配置的 `columns[key].cell` 分开存储，用户偏好优先；用户没有调整宽度时不保存宽度覆盖，继续使用开发者的 `cell.width`。列设置中的显隐优先级高于开发者的 `column.show` 和 `cell.show`。

`cell.setting.show: false` 会在列设置抽屉中隐藏整行。`cell.setting.disabled: true` 会保留设置行并禁用操作。动态 `cell: compute(...)` 列也会显示为禁用。显隐、固定和排序调整会在点击「确定」后应用到表格并保存，直接关闭抽屉会丢弃本次调整。点击「还原」会清除已保存的列偏好。

```ts
columns: {
  environment: {
    key: "environment",
    title: "环境",
    cell: { width: 120, setting: { show: false } },
  },
  status: {
    key: "status",
    title: "状态",
    cell: { width: 120, setting: { disabled: true } },
  },
}
```

```ts
const crudState = reactive<FnCrudState<Row>>({
  columns: {
    name: { key: "name", title: "名称", cell: { width: 220 } },
  },
  table: { density: "compact", size: 14 },
  request: { pageRequest },
});
useFnCrud({ state: crudState });
```

可通过 `slots.bodyBottom` 添加列设置列表下方的内容。修改 `cell.setting` 后，打开的抽屉会即时更新。AntDV 的基础列表示例用这个插槽提供了两个切换按钮。

```tsx
slots: {
  bodyBottom: () => <FnButton type="default" text="切换环境列设置显隐" click={toggleEnvironmentSetting} />,
}
```

### 自定义表格渲染

`slots.default` 可以替换标准 `FnTable`。render 函数接收完整的表格 props，包括当前 `data`、`columns`、`loading` 和 `sort`；没有配置该 slot 时，FnCrud 自动显示内置 FnTable。自定义渲染需自行实现列排序、宽度调整、选择和行操作等交互。

```tsx
slots: {
  default: ({ data, columns, loading }) => {
    const keys = Object.keys(data[0] ?? columns).filter(key => key !== "__fn_blank_column" && key !== "rowHandle");
    return (
      <div class="custom-table">
        {loading && <div>加载中...</div>}
        <table>
          <thead><tr>{keys.map(key => <th key={key}>{columns[key]?.title ?? key}</th>)}</tr></thead>
          <tbody>
            {data.map((row, index) => <tr key={row.id ?? index}>{keys.map(key => <td key={key}>{String(row[key] ?? "")}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    );
  },
}
```

可运行示例见 AntDV 的 `/crud/form/slots` 页面，该页展示自定义表格上下文和表单对话框插槽。

## 工具栏职责

- `actionbar`：新增、批量操作等面向当前列表的主要动作。
- `toolbar`：密度、列设置等列表视图工具。
- `rowHandle`：单行编辑、删除等行级动作。

不要把行级动作复制到全局 actionbar，也不要在页面里重复实现 FnCrud 已提供的密度和列设置逻辑。

`actionbar.buttons` 中的按钮可设置 `order`，数字越小越靠前。未设置 `order` 的按钮排在已排序按钮之后，并保持配置顺序；系统默认的「添加」按钮也遵循相同规则。

`useFnCrud({ state })` 会为 actionbar 提供「批量操作」下拉菜单，默认包含「批量删除」。有选中行且配置了 `request.delRequest` 时菜单可用；删除前会确认，成功后清空 `rowSelect.selectedRowKeys` 并刷新列表。`rowSelect.selectedRowKeys` 是选择状态的唯一数据源，业务操作可直接读取或写回它：

```ts
const crudState = reactive<FnCrudState<Row>>({
  rowSelect: { crossPage: true, selectedRowKeys: [] },
  columns: { name: { key: "name", title: "名称" } },
  request: { pageRequest, delRequest },
});
useFnCrud({ state: crudState });

async function publishSelected() {
  await api.publish(crudState.rowSelect!.selectedRowKeys!);
  crudState.rowSelect!.selectedRowKeys = [];
}
```

默认菜单可用 `actionbar.buttons.batch` 配置覆盖；actionbar 按钮不接收选择状态上下文。业务批量操作直接读取 `crudState.rowSelect.selectedRowKeys`。

## 按钮反馈

FnCrud 的普通按钮默认会从指针按下位置向外扩散一圈波纹，再淡出；行操作、工具栏和表单按钮使用相同反馈，无需额外配置。系统启用“减少动态效果”时会关闭波纹动画。按钮的禁用和加载状态不会触发波纹。
