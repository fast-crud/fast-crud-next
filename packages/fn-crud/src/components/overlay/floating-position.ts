export type FnFloatingPlacement = "top" | "bottom" | "left" | "right";

const opposite: Record<FnFloatingPlacement, FnFloatingPlacement> = {
  top: "bottom", bottom: "top", left: "right", right: "left",
};

export function getFloatingPosition(
  anchor: Pick<DOMRect, "top" | "bottom" | "left" | "right" | "width" | "height">,
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
  placement: FnFloatingPlacement,
  gap = 6,
) {
  const padding = 8;
  const available = {
    top: anchor.top,
    bottom: viewport.height - anchor.bottom,
    left: anchor.left,
    right: viewport.width - anchor.right,
  };
  const required = (placement === "top" || placement === "bottom" ? panel.height : panel.width) + gap + padding;
  const alternative = opposite[placement];
  const side = available[placement] < required && available[alternative] > available[placement] ? alternative : placement;
  const left = side === "left" ? anchor.left - panel.width - gap
    : side === "right" ? anchor.right + gap
    : anchor.left + (anchor.width - panel.width) / 2;
  const top = side === "top" ? anchor.top - panel.height - gap
    : side === "bottom" ? anchor.bottom + gap
    : anchor.top + (anchor.height - panel.height) / 2;

  const x = Math.max(padding, Math.min(left, viewport.width - panel.width - padding));
  const y = Math.max(padding, Math.min(top, viewport.height - panel.height - padding));
  const vertical = side === "top" || side === "bottom";
  const length = vertical ? panel.width : panel.height;
  const center = vertical ? anchor.left + anchor.width / 2 - x : anchor.top + anchor.height / 2 - y;
  const inset = Math.min(10, length / 2);

  return { left: x, top: y, side, arrowOffset: Math.max(inset, Math.min(center, length - inset)) };
}
