<script setup lang="tsx">
import { computed, ref } from "vue";
import { FnButton, FnModal } from "@fast-crud/fast-crud-next";
import { adminPreferences, adminText } from "../preferences";

const props = defineProps<{ path: string }>();
const sources: Partial<Record<string, () => Promise<string>>> = import.meta.glob<string>(["../views/crud/*/*/index.vue", "../views/components/*/index.vue"], {
  query: "?raw",
  import: "default",
});
const sourcePath = computed(() => `../views${props.path}/index.vue`);
const loadSource = computed(() => sources[sourcePath.value]);
const open = ref(false);
const source = ref<string>();
const highlightedSource = ref<string>();
const loading = ref(false);
const failed = ref(false);

async function openSource() {
  const load = loadSource.value;
  if (!load) return;
  open.value = true;
  if (loading.value || source.value !== undefined) return;
  loading.value = true;
  failed.value = false;
  try {
    const code = await load();
    source.value = code;
    highlightedSource.value = await import("./highlight-demo-source")
      .then(({ highlightDemoSource }) => highlightDemoSource(code))
      .catch(() => undefined);
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Teleport v-if="loadSource" to="body">
    <button type="button" class="demo-source-trigger" @click="openSource">
      {{ adminText("查看源码", "View source") }}
    </button>
    <FnModal v-model:open="open" :title="`${path}/index.vue`" :width="900">
      <div class="demo-source-code" :class="{ 'demo-source-code--dark': adminPreferences.dark }">
        <p v-if="loading" role="status">{{ adminText("正在加载源码…", "Loading source…") }}</p>
        <p v-else-if="failed" role="alert">{{ adminText("加载失败，请关闭后重试。", "Loading failed. Close the dialog and try again.") }}</p>
        <div v-else-if="highlightedSource" tabindex="0" v-html="highlightedSource"></div>
        <pre v-else tabindex="0"><code>{{ source }}</code></pre>
      </div>
      <template #footer="{ close }">
        <FnButton :text="adminText('关闭', 'Close')" :click="close" />
      </template>
    </FnModal>
  </Teleport>
</template>

<style lang="less">
.demo-source-trigger {
  position: fixed;
  inset-inline-end: 0;
  inset-block-end: 72px;
  z-index: 900;
  min-height: 34px;
  padding: 6px 12px;
  border: 0;
  border-radius: 6px 0 0 6px;
  background: rgb(24 29 36 / 76%);
  color: #fff;
  font: inherit;
  font-size: 13px;
  line-height: 1.5;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: rgb(24 29 36 / 94%);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -4px;
  }
}

.demo-source-code {
  line-height: 1.5;
  pre {
    margin: 0;
    padding: 16px;
    max-height: 65vh;
    overflow: auto;
    border: 1px solid rgb(127 127 127 / 24%);
    border-radius: 6px;
    background: rgb(127 127 127 / 10%);
    color: inherit;
    font: 13px/1.65 "Cascadia Mono", Consolas, monospace;
    tab-size: 2;

    code { font: inherit; }
  }

  .shiki {
    background-color: var(--shiki-light-bg, #fff);

    &, span { color: var(--shiki-light, inherit); }
  }

  &--dark .shiki {
    background-color: var(--shiki-dark-bg, #24292e);

    &, span { color: var(--shiki-dark, inherit); }
  }
}
</style>
