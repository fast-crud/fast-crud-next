# fn-admin shared 包

`@fast-crud/fn-admin-shared` 是 monorepo 内供三个 admin 示例共用的 workspace 包，源码位于 `packages/fn-admin/shared`。admin 应用通过 `workspace:*` 依赖它，Vite 直接编译包内 TypeScript 和 Vue 源码。

## 集成

在 workspace 内的 admin `package.json` 添加依赖：

```json
{
  "dependencies": {
    "@fast-crud/fn-admin-shared": "workspace:*"
  }
}
```

使用包提供的偏好状态、mock 注册、CRUD API、演示组件和共享页面：

```ts
import { adminPreferences, toggleAdminTheme } from '@fast-crud/fn-admin-shared/preferences'
import { registerMockModules } from '@fast-crud/fn-admin-shared/mock'
import { createCrudApi } from '@fast-crud/fn-admin-shared/mock/crud-api'
import DemoSelect from '@fast-crud/fn-admin-shared/components/DemoSelect.vue'
import SelectionCrud from '@fast-crud/fn-admin-shared/views/SelectionCrud.vue'
```

## 导出路径

- `@fast-crud/fn-admin-shared/preferences`：语言、主题偏好状态及切换函数。
- `@fast-crud/fn-admin-shared/mock`：mock Axios 初始化和模块注册。
- `@fast-crud/fn-admin-shared/mock/*`：mock 数据工具、HTTP 客户端和 CRUD API。
- `@fast-crud/fn-admin-shared/components/*`：共享演示组件。
- `@fast-crud/fn-admin-shared/views/*`：共享 CRUD 演示页面。

包通过 workspace 依赖 `@fast-crud/fn-crud`，并将 Vue 声明为 peer dependency，保证共享页面与宿主使用同一 Vue 实例。
