import { describe, expect, it, vi } from "vitest";
import { fnCrudContext, UiContext } from "./context.ts";
import { installFnCrud } from "../../crud/use/use-fn-crud";

describe("Fn UI contexts", () => {
  it("分别管理内置消息与通知", () => {
    const context = new UiContext();
    const { message, notification } = context.getServices();

    notification.error({ message: "请求失败", duration: 0 });
    message.success({ content: "保存成功", duration: 0 });
    expect(context.notificationItems.value[0]).toMatchObject({ type: "error", message: "请求失败" });
    expect(context.messageItems.value[0]).toMatchObject({ type: "success", message: "保存成功" });

    notification.destroy?.();
    expect(context.notificationItems.value).toHaveLength(0);
    expect(context.messageItems.value).toHaveLength(1);
  });

  it("installs common CRUD options through installFnCrud", () => {
    const commonOptions = { pagination: { pageSize: 25 } };
    installFnCrud({ commonOptions: () => commonOptions });

    expect(fnCrudContext.getCommonOptions()).toBe(commonOptions);
    fnCrudContext.configure({ commonOptions: () => ({}) });
  });

  it("allows the AntDV adapter to replace UI services", () => {
    const context = new UiContext();
    const services = { notification: { success: vi.fn(), error: vi.fn() }, message: { success: vi.fn(), error: vi.fn() } };

    context.setServices(services);

    expect(context.getServices()).toBe(services);
  });
});
