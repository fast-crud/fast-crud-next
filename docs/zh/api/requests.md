# 请求 API

每个列表通过 `FnCrudState<Row>['request']` 接入数据。FnCrud 发出搜索、排序、分页等参数，应用把它们转换成服务端需要的格式。

## 请求回调

| 配置 | 签名 | 触发时机 |
| --- | --- | --- |
| `pageRequest` | `(query: FnTablePageQuery) => Promise<FnTablePageResult<Row>>` | 必填。挂载、查询、切页、排序和刷新时请求列表。 |
| `infoRequest` | `(id: string \| number) => Promise<Record<string, any>>` | 可选。在编辑弹窗打开前加载详情。省略时使用列表行。 |
| `addRequest` | `(form: Record<string, any>) => Promise<any>` | 默认新增表单校验通过后调用。 |
| `editRequest` | `(form: Record<string, any>) => Promise<any>` | 默认编辑表单校验通过后调用。 |
| `delRequest` | `(id: string \| number) => Promise<any>` | 删除确认后调用，内置批量删除按选中行键逐条调用。 |

默认新增、编辑、删除请求成功后刷新当前列表。成功返回值可由业务自己定义，失败应拒绝 Promise。使用原生 `fetch` 时，检查 `response.ok` 并在失败时抛出错误。FnCrud 当前将内部生成的行键转成字符串，后端接线时按接口约定转换。

## 分页请求与返回

`FnTablePageQuery` 和 `FnTablePageResult<Row>` 均可从 `@fast-crud/fast-crud-next` 导入。

```ts
interface FnTablePageQuery {
  page: { offset: number; limit: number }
  query: Record<string, any>
  sort?: { prop: string; asc: boolean }
}

interface FnTablePageResult<Row> {
  records: Row[]
  total: number
  tabsCounts?: Record<string, number>
}
```

- `page.offset` 从 0 开始，等于 `(当前页 - 1) × limit`。
- `query` 是当前列表搜索值，过滤掉空字符串、`null` 与 `undefined`。
- `sort.prop` 是列的 `key`。取消排序时 `sort` 为 `undefined`。
- `records` 只返回当前页，`total` 返回过滤后的匹配总数。 `tabsCounts` 的键对应标签值。

分页转换见[分页、搜索与排序](../recipes/paging.md)。请求失败、写入回调和验证路线见[增删改](../recipes/mutations.md)。
