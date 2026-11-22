import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFnFeedbackQueue } from "./fn-feedback.ts";

describe("内置消息与通知队列", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("默认在三秒后移除通知", () => {
    const { items, api } = createFnFeedbackQueue();
    api.error({ message: "保存失败", description: "网络异常" });

    expect(items.value).toHaveLength(1);
    expect(items.value[0]).toMatchObject({ type: "error", message: "保存失败", description: "网络异常" });

    vi.advanceTimersByTime(3000);
    expect(items.value).toHaveLength(0);
  });

  it("支持字符串、自定义时长和手动关闭单条通知", () => {
    const { items, api, remove } = createFnFeedbackQueue();
    api.success("保存成功");
    api.open({ type: "info", content: "版本更新", duration: 0 });
    api.warn({ message: "连接中断", duration: 5000 });

    const [success, persistent, warning] = items.value;
    expect(success).toMatchObject({ type: "success", message: "保存成功", description: "" });
    remove(warning!.id);
    expect(vi.getTimerCount()).toBe(1);

    vi.advanceTimersByTime(5000);
    expect(items.value).toEqual([persistent]);
    expect(persistent).toMatchObject({ type: "info", message: "版本更新" });
  });

  it("清空队列时取消计时器", () => {
    const { items, api } = createFnFeedbackQueue();
    api.info({ message: "版本更新", duration: 8000 });

    vi.advanceTimersByTime(3000);
    expect(items.value).toHaveLength(1);
    api.destroy();
    expect(items.value).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
  });
});
