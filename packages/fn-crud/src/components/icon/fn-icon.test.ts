import { Trash2 } from "@lucide/vue";
import { expect, it, vi } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import FnIcon from "./fn-icon.vue";

it.each([
  [undefined, "1em"],
  [16, "16"],
  ["1.25em", "1.25em"],
] as const)("renders size %s without a Vue prop warning", async (size, expected) => {
  const app = createSSRApp(() => h(FnIcon, { icon: Trash2, size }));
  const warnHandler = vi.fn();
  app.config.warnHandler = warnHandler;

  const html = await renderToString(app);

  expect(html).toContain(`width="${expected}"`);
  expect(html).toContain(`height="${expected}"`);
  expect(warnHandler).not.toHaveBeenCalled();
});
