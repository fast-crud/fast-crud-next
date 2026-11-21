<template>
  <div v-if="show !== false" class="fn-crud-heading">
    <FnRender v-if="slots?.default" :render="slots.default" :ctx="ctx" />
    <template v-else>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import FnRender from "./fn-render";
import type { FnSlots } from "../types/index";

defineProps<{
  show?: boolean;
  title?: string;
  description?: string;
  slots?: FnSlots;
  ctx?: Record<string, any>;
}>();
</script>

<style lang="less">
.fn-crud-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin : 10px 0;
  h2 {
    margin: 0;
    font-size: 18px;
  }
  p {
    margin: 0;
    color: #8490a3;
    font-size: 13px;
  }
  .dark & p {
    color: rgba(255, 255, 255, 0.55);
  }
}
</style>
