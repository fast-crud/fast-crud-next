# 独立弹窗与确认框

`FnModal` 用于展示自定义内容，打开状态由页面控制。`FnModal.confirm(options)` 适用于删除等需要确认的单次操作。`FnFormDialog` 用于需要字段配置、校验和表单提交的弹窗。参阅[表单与弹窗](./forms.md)。

## 在页面里打开弹窗

```vue
<script setup lang="tsx">
import { ref } from 'vue'
import { FnButton, FnModal } from '@fast-crud/fast-crud-next'

const open = ref(false)
const note = ref('')
</script>

<template>
  <FnButton text="填写备注" :click="() => open = true" />
  <FnModal v-model:open="open" title="备注" :width="480" @closed="note = ''">
    <label>
      备注内容
      <textarea v-model="note" />
    </label>
    <template #footer="{ close }">
      <FnButton text="关闭" :click="close" />
    </template>
  </FnModal>
</template>
```

| 属性或事件 | 用法 |
| --- | --- |
| `v-model:open` | 绑定打开状态，组件关闭时会触发 `update:open`。 |
| `title`、`width`、`draggable` | 设置标题、宽度和是否允许拖动。宽度支持数字像素值和 CSS 字符串。 |
| `confirmLoading` | 控制默认确认按钮的加载状态，并作为插槽上下文的 `loading` 提供。 |
| `confirm`、`reset` | 点击对应默认按钮时发出。页面可在监听器中实现自己的处理。 |
| `closed` | 关闭过渡结束后发出，适合清除上一次编辑的临时值。 |

## 自定义插槽

模板插槽和 `slots` 对象支持相同名称。两者同时配置同一名称时，模板插槽优先。

| 区域 | 插槽 |
| --- | --- |
| 标题 | `headerLeft`、`title`、`headerRight` |
| 标题操作区 | `headerActionLeft`、`headerActionRight` |
| 内容 | `bodyTop`、`bodyLeft`、`default`、`bodyRight`、`bodyBottom` |
| 页脚 | `footerLeft`、`footer`、`footerRight` |

独立弹窗的插槽收到 `{ close, confirm, loading }`。`close()` 关闭弹窗，`confirm()` 触发组件的 `confirm` 事件。自定义 `footer` 会替换默认按钮。`FnFormDialog` 的 `dialog.slots` 使用[表单上下文](./forms.md#自定义弹窗插槽)，提交时调用 `submit()`。

## 命令式确认

确保页面已经挂载在 `FnConfigProvider` 内。它会注册确认框服务。将下面的函数绑定到页面按钮即可验证。

```ts
import { FnModal } from '@fast-crud/fast-crud-next'

async function confirmArchive() {
  const confirmed = await FnModal.confirm<boolean>({
    title: '归档记录',
    body: () => '确定归档这条记录？',
    buttons: {
      confirm: { text: '归档', click: () => true },
    },
  })
  if (confirmed) {
    // 在这里执行归档操作。
  }
}
```

确认框关闭后返回确认回调的结果，取消后返回 `undefined`。需要在写入失败时保留弹窗，可将异步写入放进 `buttons.confirm.click` 并让失败抛出错误。内置删除和批量删除使用同类确认流程，可在 [Admin 示例](../demos/admin.md)中验证。
