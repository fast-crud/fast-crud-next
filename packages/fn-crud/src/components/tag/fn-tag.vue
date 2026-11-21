<template>
  <span class="fn-tag" :style="tagStyle"><slot /></span>
</template>

<script setup lang="tsx">
import { computed } from "vue";

const props = defineProps<{ color?: string }>();
const semanticColors = new Map([
  ["primary", ["info", "var(--fn-color-primary, #1677ff)"]],
  ["info", ["info", "var(--fn-color-primary, #1677ff)"]],
  ["success", ["success", "#52c41a"]],
  ["warning", ["warning", "#faad14"]],
  ["danger", ["error", "#ff4d4f"]],
  ["error", ["error", "#ff4d4f"]],
]);
const tagStyle = computed(() => {
  if (!props.color || props.color === "default") return undefined;
  const status = semanticColors.get(props.color);
  if (!status) return { "--fn-tag-bg": props.color, "--fn-tag-text": "#fff", "--fn-tag-border": "transparent" };

  const [name, fallback] = status;
  const color = `var(--fn-color-${name}, ${fallback})`;
  const surface = "var(--fn-color-bg-container, #fff)";
  return {
    "--fn-tag-text": color,
    "--fn-tag-bg": `var(--fn-color-${name}-bg, color-mix(in srgb, ${color} 10%, ${surface}))`,
    "--fn-tag-border": `var(--fn-color-${name}-border, color-mix(in srgb, ${color} 40%, ${surface}))`,
  };
});
</script>

<style lang="less">
.fn-tag {
  display: inline-block;
  box-sizing: border-box;
  max-width: 100%;
  margin-inline-end: 8px;
  padding-inline: 7px;
  border: 1px solid var(--fn-tag-border, var(--fn-color-border, #d9d9d9));
  border-radius: var(--fn-tag-border-radius, 4px);
  background: var(--fn-tag-bg, var(--fn-color-fill-alter, #fafafa));
  color: var(--fn-tag-text, var(--fn-color-text, rgba(0, 0, 0, 0.88)));
  font-size: var(--fn-tag-font-size, 12px);
  line-height: 20px;
  text-align: start;
  overflow-wrap: anywhere;
  cursor: pointer;
}
</style>
