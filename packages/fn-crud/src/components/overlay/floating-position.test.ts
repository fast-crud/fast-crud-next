import { expect, it } from "vitest";
import { getFloatingPosition } from "./floating-position";

const anchor = { left: 80, right: 120, top: 80, bottom: 100, width: 40, height: 20 };
const panel = { width: 60, height: 30 };
const viewport = { width: 300, height: 200 };

it.each([
  ["top", { left: 70, top: 44, arrowOffset: 30 }],
  ["bottom", { left: 70, top: 106, arrowOffset: 30 }],
  ["left", { left: 14, top: 75, arrowOffset: 15 }],
  ["right", { left: 126, top: 75, arrowOffset: 15 }],
] as const)("将浮层对齐到触发器的 %s 方向", (placement, position) => {
  expect(getFloatingPosition(anchor, panel, viewport, placement)).toEqual({ ...position, side: placement });
});

it("空间不足时翻转方向并避开视口边缘", () => {
  const nearCorner = { ...anchor, left: 0, right: 40, top: 2, bottom: 22 };
  expect(getFloatingPosition(nearCorner, panel, viewport, "top")).toEqual({ left: 8, top: 28, side: "bottom", arrowOffset: 12 });
});

it("支持 Tooltip 使用更宽的触发器间距", () => {
  expect(getFloatingPosition(anchor, panel, viewport, "top", 12)).toMatchObject({ top: 38, side: "top" });
});
