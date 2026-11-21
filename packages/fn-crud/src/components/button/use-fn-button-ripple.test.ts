import { describe, expect, it, vi } from "vitest";
import { useFnButtonRipple } from "./use-fn-button-ripple.ts";

describe("FnButton 波纹生命周期", () => {
  it("允许连续波纹并按动画完成事件分别清理", () => {
    const { ripples, createRipple, removeRipple } = useFnButtonRipple();
    vi.stubGlobal("getComputedStyle", () => ({
      borderLeftWidth: "1px",
      borderTopWidth: "1px",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
      borderBottomRightRadius: "4px",
      borderBottomLeftRadius: "4px",
      borderTopColor: "rgb(64, 158, 255)",
      borderColor: "rgb(64, 158, 255)",
      backgroundColor: "rgb(64, 158, 255)",
    }));
    vi.stubGlobal("requestAnimationFrame", () => 1);
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("window", { setTimeout: () => 1, clearTimeout: vi.fn() });
    const button = { offsetWidth: 100, offsetHeight: 32 } as HTMLElement;

    createRipple(button);
    createRipple(button);
    expect(ripples.value).toHaveLength(2);
    expect(ripples.value[0].style).toMatchObject({ left: "-1px", top: "-1px", width: "100px", height: "32px", "--fn-wave-color": "rgb(64, 158, 255)" });

    removeRipple(ripples.value[0].id);

    expect(ripples.value).toHaveLength(1);
    expect(ripples.value[0].id).toBe(2);
    vi.unstubAllGlobals();
  });
});
