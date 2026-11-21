import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";
import FnCheckbox from "./fn-checkbox.vue";
import FnSwitch from "./fn-switch.vue";

it("把复选框标签与原生输入关联，并保留输入属性", async () => {
  const html = await renderToString(createSSRApp(FnCheckbox, {
    label: "显示全部列",
    id: "show-all",
    disabled: true,
  }));

  expect(html).toMatch(/^<label\b.*<input\b[^>]*id="show-all"[^>]*>.*显示全部列.*<\/label>$/);
  expect(html).toMatch(/<input\b[^>]*\bdisabled\b/);
});

it("省略标签时保持无文字复选框结构", async () => {
  const html = await renderToString(createSSRApp(FnCheckbox, { "aria-label": "选择行" }));

  expect(html).toMatch(/^<span\b.*<input\b[^>]*aria-label="选择行"/);
  expect(html).not.toContain("fn-checkbox-label");
});

it.each([true, false])("渲染开关的布尔状态 %s 和禁用状态", async (modelValue) => {
  const html = await renderToString(createSSRApp(FnSwitch, {
    modelValue,
    disabled: true,
    "aria-label": "启用通知",
  }));

  expect(html).toContain('type="button"');
  expect(html).toContain('role="switch"');
  expect(html).toContain(`aria-checked="${modelValue}"`);
  expect(html).toContain('aria-label="启用通知"');
  expect(html).toMatch(/\bdisabled\b/);
});
