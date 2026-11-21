import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";
import FnCheckbox from "../selection/fn-checkbox.vue";
import FnComponentRender from "./fn-component-render.ts";

it("accepts a local component object as name", async () => {
  const app = createSSRApp(defineComponent({
    setup() {
      return () => h(FnComponentRender, {
        name: FnCheckbox,
        modelValue: true,
        "aria-label": "自定义单价",
      });
    },
  }));

  const html = await renderToString(app);

  expect(html).toContain('type="checkbox"');
  expect(html).toContain('aria-label="自定义单价"');
  expect(html).toMatch(/\bchecked(?:\s|>)/);
});
