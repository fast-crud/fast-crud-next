# 搜索与状态筛选

## 定义搜索字段

优先用 `columns[key].search`。如果搜索项没有对应的表格字段，可写在 `search.columns[key]`。两处配置同名字段时，`search.columns[key]` 覆盖列的搜索配置。

| 路径 | 类型或默认行为 | 用途 |
| --- | --- | --- |
| `search.show` | 默认显示 | 控制整条搜索区域。 |
| `columns[key].search.show` | 默认显示 | 控制该搜索字段。 |
| `columns[key].search.order` | `number`，默认 `0` | 按升序排列。 |
| `columns[key].search.width` | `number \| string` | 数字转换为 px，也可以使用 CSS 长度。 |
| `columns[key].search.component` | 组件配置对象 | `name` 指定组件，额外字段透传给组件。 |
| `columns[key].search.component.options` | 选项数组或 Ref | 为下拉框、单选组、复选组等组件提供选项。 |
| `search.buttons` | `Record<string, FnButtonProps<FnSearchContext>>` | 默认提供查询和重置。传入按钮对象后，由该对象完整定义按钮。 |
| `search.formProps` | 对象 | 转发到搜索区域的原生 `form`。 |

点击查询或在输入框按 Enter，会从第 1 页发起请求。重置将当前显示的搜索字段清为空字符串再查询。`query` 会排除 `''`、`null` 和 `undefined`，保留 `false` 与 `0`。详见[请求 API](./requests.md)。

### 自定义搜索按钮

按钮回调接收 `FnSearchContext`，其中 `form` 是搜索状态，`reset()` 和 `search()` 均会触发查询。下面片段可放入列表配置。

```ts
search: {
  buttons: {
    search: { text: '查询', click: ctx => ctx.search() },
    reset: { text: '清空', click: ctx => ctx.reset() },
    available: {
      text: '仅看启用',
      click: ctx => {
        ctx.form.enabled = true
        ctx.search()
      },
    },
  },
},
```

## 通过 Tabs 筛选

`tabs.refCol` 指向筛选字段。Tabs 读取类型合成后静态 `cell` 的 `component.options`，支持数组和 Ref，并与 `tabs.tabs` 按值合并。点击标签会将字符串、数字或布尔类型的原值写入同名搜索字段并从第 1 页查询。计数优先使用请求响应中以标签值的字符串形式为键的 `tabsCounts`，其次使用标签配置的 `count`，缺省为 0。未设置 `refCol` 时，点击只会触发查询。

| 插槽 | 上下文 | 行为 |
| --- | --- | --- |
| `<template #search>` 或 `search.slots.default` | `FnSearchContext` | 替换整个搜索区域。 |
| `search.slots.before`、`after` | `FnSearchContext` | 添加在搜索区域头尾。 |
| `search.slots.buttons` | 搜索上下文加 `buttons` 配置 | 替换搜索按钮区，可直接调用 `ctx.search()`、`ctx.reset()`。 |
| `tabs.slots.before`、`after` | `{ tabs, modelValue }` | 添加在标签区头尾。 |
| `tabs.slots.item` | `{ item, active }` | 自定义标签内容。 |

在 [Admin 请求 Mock](../demos/admin.md)的 `/crud/basis/request-mock` 搜索服务名称。打开 `/crud/dict/credentials` 可验证标签筛选和计数。`tabs.refCol` 读取到选项时，首位默认显示「全部」，点击后清除该字段的筛选。可通过 `tabs.tabs[""]` 覆盖该标签的配置，设置 `show: false` 可隐藏。
