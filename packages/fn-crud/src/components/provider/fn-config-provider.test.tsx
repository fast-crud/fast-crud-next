import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";
import FnConfigProvider from "./fn-config-provider.vue";
import { uiContext } from "./context.ts";

it("将默认插槽放在滚动条样式的作用范围内", async () => {
  const app = createSSRApp(() => (
    <main>
      <FnConfigProvider><div id="provider-content" /></FnConfigProvider>
      <div id="sibling-content" />
    </main>
  ));

  expect(await renderToString(app)).toMatch(
    /<div class="[^"]*\bfn-config-provider\b[^"]*">.*<div id="provider-content"><\/div>.*<\/div><div id="sibling-content">/s,
  );
});

it("在各自的位置渲染消息和通知", async () => {
  const { message, notification } = uiContext.getServices();
  message.success({ content: "已复制", duration: 0 });
  notification.error({ message: "提交失败", description: "请稍后重试", duration: 0 });

  try {
    const html = await renderToString(createSSRApp(() => <FnConfigProvider />));
    expect(html).toMatch(/class="fn-message fn-feedback-stack".*?<span>已复制<\/span>/s);
    expect(html).toMatch(/class="fn-notification fn-feedback-stack".*?提交失败.*?请稍后重试.*?aria-label="关闭通知"/s);
  } finally {
    message.destroy?.();
    notification.destroy?.();
  }
});
