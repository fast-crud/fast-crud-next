import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";
import FnButtonBase from "./fn-button-base.vue";
import FnButtonGroup from "./fn-button-group.vue";
import FnDropdownButton from "./fn-dropdown-button.vue";

it("按钮使用自身文案，纯图标按钮使用提示文案", async () => {
  const textButton = await renderToString(createSSRApp(FnButtonBase, { text: "保存", tooltip: "保存当前记录" }));
  const iconButton = await renderToString(createSSRApp(FnButtonBase, { tooltip: "关闭" }));

  expect(textButton).toContain('aria-label="保存"');
  expect(iconButton).toContain('aria-label="关闭"');
});

it("纯图标下拉按钮从提示文案获取名称", async () => {
  const html = await renderToString(createSSRApp(FnDropdownButton, { tooltip: "更多操作", items: [] }));

  expect(html).toContain('aria-label="更多操作"');
  expect(html).toContain('aria-haspopup="menu"');
  expect(html).toContain('aria-expanded="false"');
});

it("按钮组从选项文案和选中值生成名称及状态", async () => {
  const html = await renderToString(createSSRApp(FnButtonGroup, {
    label: "固定位置",
    modelValue: "left",
    options: [{ value: "left", title: "固定到左侧" }],
  }));

  expect(html).toContain('aria-label="固定位置"');
  expect(html).toContain('aria-label="固定到左侧" aria-pressed="true"');
});
