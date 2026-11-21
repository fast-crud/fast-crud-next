# 请求 API

请求函数位于 `FnCrudState<Row>['request']`。分页输入和输出类型可从 `@fast-crud/fast-crud-next` 导入。

```ts
type PageRequest<Row> = (query: FnTablePageQuery) => Promise<FnTablePageResult<Row>>
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `request.pageRequest` | `PageRequest<Row>` | 必填 | 查询当前页，返回 `records` 和 `total`。 |
| `request.addRequest` | `(form: Record<string, any>) => Promise<any>` | 无 | 内置新增表单提交时调用。 |
| `request.editRequest` | `(form: Record<string, any>) => Promise<any>` | 无 | 内置编辑表单提交时调用。 |
| `request.delRequest` | `(id: string \| number) => Promise<any>` | 无 | 内置删除确认后调用，批量删除按行键调用。 |

`FnTablePageQuery` 包含 `page: { offset, limit }`、`query` 和可选的 `sort: { prop, asc }`。`offset` 从零开始。`FnTablePageResult<Row>` 返回当前页 `records`、过滤后的总数 `total`，并可提供 `tabsCounts`。

参阅[分页、搜索与排序](../recipes/paging.md)和[增删改](../recipes/mutations.md)。
