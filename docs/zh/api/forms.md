# 表单与弹窗

## 字段放在哪一层

`columns[key].form` 配置一个字段。根级 `form` 配置整个弹窗和提交逻辑，`addForm`、`editForm` 分别覆盖公共配置。动态配置会在弹窗拥有表单上下文后解析。

| 路径 | 类型或默认行为 | 用途 |
| --- | --- | --- |
| `columns[key].form.component` | `FnComponentProps` | `name` 指定组件，`vModel` 默认 `modelValue`。 |
| `columns[key].form.value` | 任意值 | 字段初值。打开弹窗时传入的 `initialForm` 优先。 |
| `columns[key].form.order` | 数字，默认 `0` | 按升序排列。 |
| `columns[key].form.span` | 数字，默认 `12` | 表单 24 栅格占位。 |
| `columns[key].form.show` | 显示状态，可动态计算 | 隐藏字段时保留已有的表单值。 |
| `columns[key].form.rules` | 校验规则数组 | 如 `[{ required: true, message: '请输入名称' }]`。 |
| `columns[key].form.itemProps` | 对象 | 转发给字段外层的 `FnFormItem`。 |
| `form.dialog` | 弹窗配置 | 配置 `title`、`width`、`draggable`、`buttons`、`slots` 等。 |
| `form.onSubmit` | `(ctx: FnFormContext) => any`，允许 Promise | 默认调用对应新增或编辑请求并刷新列表。覆盖后由回调负责写入和刷新。 |
| `form.onReset` | `(ctx: FnFormContext) => any`，允许 Promise | 表单恢复初值后执行。 |

## 模式与初值

下面片段可放入列表配置。`dialog` 的其余公共项会保留。打开新增表单时还可以传入例如 `openAddForm({ status: 'draft' })` 的初值。

```ts
form: {
  dialog: { width: 680 },
},
addForm: {
  dialog: { title: '新建服务' },
},
editForm: {
  dialog: { title: '编辑服务' },
},
```

编辑默认以列表行初始化。配置 `request.infoRequest` 时，先请求详情，再以详情和 `openEditForm(row, initialForm?)` 的额外值初始化。请求失败会阻止弹窗打开。参阅[请求 API](./requests.md)。

## 自定义弹窗插槽

通过 `form.dialog.slots` 设置渲染回调。回调和 `form.dialog.buttons` 的按钮点击都可读取 `FnFormContext`，例如 `form`、`mode`、`validate()`、`submit()`、`close()` 和 `fullscreen`。由 `FnForm` 执行的 `onSubmit` 可读取表单数据、模式、校验和重置方法。需要在弹窗里触发提交时，使用插槽上下文的 `submit()`。

| 位置 | 可用名称 |
| --- | --- |
| 标题及左右附加区 | `title`、`headerLeft`、`headerRight` |
| 弹窗标题操作区 | `headerActionLeft`、`headerActionRight` |
| 内容周围 | `bodyTop`、`bodyLeft`、`bodyRight`、`bodyBottom` |
| 页脚 | `footerLeft`、`footer`、`footerRight`。设置 `footer` 插槽会替换默认按钮。 |

例如将这个 TSX 片段填入 `form.dialog.slots`。

```tsx
headerRight: ctx => <span>{ctx?.form?.name}</span>,
footer: ctx => (
  <>
    <FnButton text="取消" click={() => ctx?.close?.()} />
    <FnButton text="提交" type="primary" click={() => ctx?.submit?.()} />
  </>
),
```

打开 [Admin 示例](../demos/admin.md)的 `/crud/form/slots` 可查看表单区域与对应的名称。动态字段和校验见[表单用法](../recipes/forms.md)。

## 独立使用

`FnForm`、`FnFormDialog` 均可从包入口导入。`FnFormDialog` 通过实例方法 `open(options)` 接收包含 `columns` 的 `FnFormDialogOptions`，挂载后返回表单上下文。实例还公开 `close()`、`reset()`、`cancel()`、`submit()` 和 `getFormData()`。

只需展示自定义内容或确认一次操作时，参阅[独立弹窗与确认框](./modal.md)。
