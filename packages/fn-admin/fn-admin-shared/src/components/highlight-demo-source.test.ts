import { expect, it } from "vitest";
import { highlightDemoSource } from "./highlight-demo-source";

it("highlights Vue templates, TSX scripts and Less styles in both themes", async () => {
  const source = `<template><FnCrud v-bind="state" /></template>
<script setup lang="tsx">
const render = () => <FnCrud />;
</script>
<style lang="less">
.demo { color: @text; }
</style>`;

  const html = await highlightDemoSource(source);

  expect(html).toContain("shiki-themes github-light github-dark");
  expect(html).toContain("--shiki-dark:");
  expect(html).toMatch(/<span style="[^"]+">template<\/span>/);
  expect(html).toMatch(/<span style="[^"]+">const<\/span>/);
  expect(html).toMatch(/&#x3C;<\/span><span style="[^"]+">FnCrud<\/span>/);
  expect(html).toMatch(/@<\/span><span style="[^"]+">text<\/span>/);
  expect(html).not.toMatch(/<(?:script|style|FnCrud)\b/);
});
