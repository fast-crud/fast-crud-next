import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";
import FnCheckbox from "../selection/fn-checkbox.vue";
import FnSwitch from "../selection/fn-switch.vue";
import FnSearch from "../../crud/search/fn-search.vue";
import FnTable from "../../crud/table/fn-table.vue";
import { fnCrudSearchKey } from "../provider/context.ts";
import FnComponentRender from "./fn-component-render.ts";

it("accepts a local component object as name", async () => {
  const app = createSSRApp(defineComponent({
    setup() {
      return () => h(FnComponentRender, {
        name: FnCheckbox,
        modelValue: true,
        fieldLabel: "自定义单价",
      });
    },
  }));

  const html = await renderToString(app);

  expect(html).toContain('type="checkbox"');
  expect(html).toContain('aria-label="自定义单价"');
  expect(html).toMatch(/\bchecked(?:\s|>)/);
});

it("从表单标题关联开关和可见标签", async () => {
  const { default: FnForm } = await import("../form/fn-form.vue");
  const html = await renderToString(createSSRApp(FnForm, {
    columns: { custom: { title: "自定义单价", component: { name: FnSwitch } } },
  }));

  const controlId = html.match(/<label[^>]* for="([^"]+)"/)?.[1];
  expect(controlId).toBeTruthy();
  expect(html.match(/<button[^>]*role="switch"[^>]*>/)?.[0]).toContain(`id="${controlId}"`);
  expect(html).toContain('aria-label="自定义单价"');
});

it("搜索控件优先读取字段标题，输入提示仍单独显示", async () => {
  const app = createSSRApp(FnSearch, {
    columns: { name: { title: "名称", component: { placeholder: "输入关键词" }, width: 180 } },
  });
  app.provide(fnCrudSearchKey, { form: {}, search: () => {} });

  const html = await renderToString(app);
  expect(html.match(/<input[^>]*>/)?.[0]).toContain('aria-label="名称"');
  expect(html).toContain('placeholder="输入关键词"');
  expect(html).toContain('style="width:180px;"');
});

it("表格里的交互控件从列标题获取名称", async () => {
  const html = await renderToString(createSSRApp(FnTable, {
    data: [{ custom: true }],
    columns: { custom: { key: "custom", title: "自定义单价", cell: { component: { name: FnSwitch } } } },
  }));

  expect(html.match(/<button[^>]*role="switch"[^>]*>/)?.[0]).toContain('aria-label="自定义单价"');
});
