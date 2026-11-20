import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import FnFormItem from "./fn-form-item.vue";

async function renderItem(props: { help?: string; error?: string; label?: string }): Promise<string> {
  return renderToString(createSSRApp({ render: () => h(FnFormItem, props, { default: () => h("textarea") }) }));
}

describe("FnFormItem 提示区域", () => {
  it("始终保留提示节点，helper 常驻且 error 优先显示", async () => {
    const withHelper = await renderItem({ help: "辅助说明" });
    const withError = await renderItem({ help: "辅助说明", error: "校验失败" });
    const empty = await renderItem({});

    expect(withHelper).toContain('class="fn-form-item-help fn-form-item-message"');
    expect(withHelper).toContain("辅助说明");
    expect(withError).toContain('class="fn-form-item-error-message fn-form-item-message"');
    expect(withError).toContain('role="alert"');
    expect(withError).toContain("校验失败");
    expect(withError).not.toContain("辅助说明");
    expect(empty).toContain('class="fn-form-item-message"');
  });

  it("控件插槽与提示信息分行渲染", async () => {
    const html = await renderItem({ label: "备注", help: "辅助说明" });

    expect(html).toContain('<div class="fn-form-item-field">');
    expect(html).toContain("<textarea></textarea>");
    expect(html).toContain('class="fn-form-item-help fn-form-item-message"');
    expect(html.indexOf("</textarea>")).toBeLessThan(html.indexOf("辅助说明"));
  });
});
