# 全局安装与语言

在应用入口、挂载 Vue 应用前调用 `installFnCrud`。列表由 `useFnCrud({ state })` 初始化，弹窗与通知服务由 `FnConfigProvider` 提供。

```ts
import { installFnCrud } from '@fast-crud/fast-crud-next'

installFnCrud({
  locale: 'zh-CN',
  commonOptions: () => ({
    table: { density: 'comfort' },
    pagination: { pageSize: 20 },
  }),
})
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `locale` | `MaybeRef<FnCrudLocale>` | `'zh-CN'` | 内置翻译使用的语言，支持 `zh-CN` 和 `en-US`。 |
| `i18n` | `FnCrudI18n` | 无 | 宿主翻译实例。提供后，FnCrud 调用它的 `global.t(key)`。 |
| `commonOptions` | CRUD 配置工厂 | 无 | 内置默认值、全局配置、当前列表配置依次深度合并，后者优先。 |

使用内置翻译时，可传入响应式 `locale` 实现动态切换。参阅[快速开始](./getting-started.md)和[主题集成](../themes/overview.md)。

## 与 vue-i18n 共用实例

将 FnCrud 词表放到宿主各语言的 `fnCrud` 命名空间，再把同一个实例传给 `installFnCrud`。

```ts
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { fnCrudLocales, installFnCrud } from '@fast-crud/fast-crud-next'
import App from './App.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages: {
    zh: { fnCrud: fnCrudLocales['zh-CN'] },
    en: { fnCrud: fnCrudLocales['en-US'] },
  },
})

installFnCrud({ i18n })
createApp(App).use(i18n).mount('#app')
```

修改 `i18n.global.locale.value` 后，当前页面的内置操作栏和编辑标题会随语言更新。单个列表也可以通过 `useFnCrud({ state, i18n })` 指定翻译实例，该列表优先使用传入的实例。
