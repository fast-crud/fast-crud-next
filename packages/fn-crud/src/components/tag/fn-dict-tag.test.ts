import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";
import FnDictTag from "./fn-dict-tag.vue";

it("默认按选项标签和颜色渲染 FnTag，保留未知值", async () => {
  const app = createSSRApp({
    render: () => h(FnDictTag, { modelValue: [0, "other"], options: [{ value: 0, label: "停用", color: "warning" }] }),
  });
  const html = await renderToString(app);
  expect(html).toContain("class=\"fn-tag\"");
  expect(html).toContain("--fn-color-warning");
  expect(html).toContain(">停用<");
  expect(html).toContain(">other<");
});

it("文本模式使用指定分隔符并正确处理布尔值", async () => {
  const app = createSSRApp({
    render: () => h(FnDictTag, { modelValue: [false, true], type: "text", separator: " / " }),
  });
  expect(await renderToString(app)).toContain(">false / true<");
});
