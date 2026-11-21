import { createSSRApp, type ButtonHTMLAttributes } from "vue";
import { renderToString, type SSRContext } from "vue/server-renderer";
import { expect, it } from "vitest";
import FnPopover from "./fn-popover.vue";
import FnTooltip from "./fn-tooltip.vue";

it("用 aria-describedby 关联 Tooltip 和触发器", async () => {
  const context: SSRContext = {};
  const app = createSSRApp(() => (
    <FnTooltip open content="计价公式" v-slots={{
      default: ({ attrs }: { attrs: ButtonHTMLAttributes }) => <button {...attrs}>说明</button>,
    }} />
  ));
  const html = await renderToString(app, context);
  const id = html.match(/aria-describedby="([^"]+)"/)?.[1];

  expect(id).toBeTruthy();
  expect(context.teleports?.body).toContain(`id="${id}"`);
  expect(context.teleports?.body).toContain('role="tooltip"');
  expect(context.teleports?.body).toContain("计价公式");
});

it("用 aria-controls 关联 Popover，并把关闭操作传给内容插槽", async () => {
  const context: SSRContext = {};
  const app = createSSRApp(() => (
    <FnPopover open label="计价设置" v-slots={{
      default: ({ attrs }: { attrs: ButtonHTMLAttributes }) => <button {...attrs}>打开设置</button>,
      content: ({ close }: { close: () => void }) => <button onClick={close}>完成</button>,
    }} />
  ));
  const html = await renderToString(app, context);
  const id = html.match(/aria-controls="([^"]+)"/)?.[1];

  expect(id).toBeTruthy();
  expect(html).toContain('aria-expanded="true"');
  expect(context.teleports?.body).toContain(`id="${id}"`);
  expect(context.teleports?.body).toContain('role="dialog"');
  expect(context.teleports?.body).toContain('aria-label="计价设置"');
  expect(context.teleports?.body).toContain("完成");
});
