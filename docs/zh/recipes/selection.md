# 字典和跨页选择

## 字典

```ts
import { markRaw } from 'vue'
import { DictStore } from '@fast-crud/fast-crud-next'

const statusDict = markRaw(new DictStore({
  data: [{ label: '运行中', value: 'running', color: 'success' }],
}))
```

使用 `cell.dict` 给单元格提供字典；展示自定义文本或标签时，可通过 `cell.render` 渲染。打开 `/crud/dict/credentials` 查看状态与筛选的组合。

## 跨页选择

```ts
rowSelect: {
  crossPage: true,
  selectedRowKeys: [],
}
```

`useFnCrud` 将选中键写回 `state.rowSelect.selectedRowKeys`。业务批量操作读取这些键，必要时再向后端查询记录。在 `/crud/feature/selection` 选中一行、翻页再选一行，检查批量操作是否包含两页的选中项。参阅 [Admin 示例](../demos/admin.md)和[表格 API](../api/table.md)。
