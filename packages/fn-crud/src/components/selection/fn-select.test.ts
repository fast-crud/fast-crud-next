import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";
import FnSelect from "./fn-select.vue";
import { countVisibleTags } from "./select-tag-layout";

const options = [
  { value: 0, label: "零" },
  { value: false, label: "否" },
  { value: "active", label: "启用" },
];

it("多选显示数组中的所有选中项，包括数字和布尔值", async () => {
  const app = createSSRApp(() => h(FnSelect, { multiple: true, modelValue: [0, false], options }));
  const html = await renderToString(app);

  expect(html).toContain('role="combobox"');
  expect(html).not.toContain("<select");
  expect(html).toContain('aria-label="移除 零"');
  expect(html).toContain('aria-label="移除 否"');
  expect(html).not.toContain('aria-label="移除 启用"');
});

it("多选显示外部写入的单个值", async () => {
  const app = createSSRApp(() => h(FnSelect, { multiple: true, modelValue: false, options }));
  const html = await renderToString(app);

  expect(html).toContain('aria-label="移除 否"');
  expect(html).not.toContain('aria-label="移除 零"');
});

it("单选在收起时显示字典标签", async () => {
  const app = createSSRApp(() => h(FnSelect, { modelValue: 0, options }));
  const html = await renderToString(app);

  expect(html).toContain('value="零"');
  expect(html).not.toContain("fn-select-tag");
});

it("只在有值且可清空时渲染悬停清空按钮", async () => {
  const render = (modelValue: number | undefined, disabled = false) => renderToString(createSSRApp(() => h(FnSelect, {
    clearable: true, disabled, modelValue, options,
  })));
  const selected = await render(0);
  expect(selected).toContain('aria-label="清空选择"');
  expect(selected).toContain('aria-label="展开选项"');
  for (const html of [await render(undefined), await render(0, true)]) {
    expect(html).toContain('aria-label="展开选项"');
    expect(html).not.toContain('aria-label="清空选择"');
  }
});

it("只有多选且关闭 wrap 时才启用单行布局", async () => {
  const render = (multiple: boolean) => renderToString(createSSRApp(() => h(FnSelect, {
    multiple, modelValue: false, options, wrap: false,
  })));
  expect(await render(true)).toContain("fn-select-content--single-line");
  expect(await render(false)).not.toContain("fn-select-content--single-line");
});

it("最小宽度支持像素数值和 CSS 长度", async () => {
  const render = (minWidth: number | string) => renderToString(createSSRApp(() => h(FnSelect, {
    multiple: true, wrap: false, style: { width: "200px" }, minWidth, options,
  })));
  expect(await render(160)).toContain('style="width:200px;min-width:160px;"');
  expect(await render("12rem")).toContain('style="width:200px;min-width:12rem;"');
});

it("按可用宽度显示最多的标签，同时为输入框和 +N 留出空间", () => {
  const widths = [40, 52, 40];
  expect(countVisibleTags(widths, 155, 14, 3, [22])).toBe(3);
  expect(countVisibleTags(widths, 138, 14, 3, [22])).toBe(2);
  expect(countVisibleTags(widths, 87, 14, 3, [22])).toBe(1);
  expect(countVisibleTags(widths, 60, 14, 3, [22])).toBe(1);
});

it("使用对应的位数宽度计算溢出计数", () => {
  const widths = Array.from({ length: 11 }, () => 30);
  expect(countVisibleTags(widths, 107, 14, 3, [22, 32])).toBe(2);
  expect(countVisibleTags(widths, 82, 14, 3, [22, 32])).toBe(1);
});

it("空间不足时保留第一个标签，由布局截断标签文字", () => {
  expect(countVisibleTags([240, 40, 40], 90, 14, 3, [22])).toBe(1);
  expect(countVisibleTags([240], 90, 14, 3, [22])).toBe(1);
  expect(countVisibleTags([], 0, 14, 3, [22])).toBe(0);
});
