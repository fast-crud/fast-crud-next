import { describe, expect, it, vi } from "vitest";
import FnRender from "./fn-render.ts";

describe("FnRender 上下文 getter", () => {
  it("每次渲染都从 getContext 读取最新上下文", () => {
    const render = vi.fn((ctx?: Record<string, any>) => ctx?.value);
    const getContext = vi
      .fn()
      .mockReturnValueOnce({ value: 1 })
      .mockReturnValueOnce({ value: 2 });
    const renderFn = FnRender.setup?.({ render, ctx: { value: 0 }, getContext }, {} as any) as () => unknown;

    expect(renderFn()).toBe(1);
    expect(renderFn()).toBe(2);
    expect(render).toHaveBeenNthCalledWith(1, { value: 1 });
    expect(render).toHaveBeenNthCalledWith(2, { value: 2 });
  });
});
