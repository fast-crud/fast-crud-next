# FnModal 弹窗

`FnModal` 通过 `v-model:open` 控制显示。打开和关闭时会自动播放淡入淡出及轻微缩放动画，无需额外配置。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FnModal } from "@fn-crud/index";

const open = ref(false);
function onAfterClose() {
  console.log("弹窗关闭动画完成");
}
</script>

<template>
  <button type="button" @click="open = true">打开弹窗</button>
  <FnModal v-model:open="open" title="编辑记录" @after-close="onAfterClose">
    <p>弹窗内容</p>
  </FnModal>
</template>
```

`after-close` 在关闭动画结束后触发，适合清理弹窗内容或完成异步对话流程。系统开启“减少动态效果”时，过渡时长会缩短到接近即时。
