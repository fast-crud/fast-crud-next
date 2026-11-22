# 全局安装与语言

在应用入口、挂载 Vue 应用前调用 `installFnCrud`。列表由 `useFnCrud({ state })` 初始化，弹窗、短消息与通知服务由 `FnConfigProvider` 提供。[Message 和 Notification](../api/components.md#message-和-notification)

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

## 默认滚动条

`FnConfigProvider` 内的原生滚动容器默认使用与 `FnTable` 相同的细滚动条。滑块和悬停颜色分别跟随 `--fn-color-text-tertiary` 和 `--fn-color-primary`，容器自己的滚动条样式优先生效。

```vue
<script setup lang="tsx">
import { FnConfigProvider } from '@fast-crud/fast-crud-next'
</script>

<template>
  <FnConfigProvider>
    <div style="max-height: 120px; overflow: auto">
      <p v-for="item in 20" :key="item">记录 {{ item }}</p>
    </div>
  </FnConfigProvider>
</template>
```

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
