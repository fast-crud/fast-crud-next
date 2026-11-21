import { getCurrentInstance, onBeforeUnmount, ref, type CSSProperties } from "vue";

export interface FnButtonRipple {
  id: number;
  active: boolean;
  style: CSSProperties;
}

function isValidWaveColor(color: string): boolean {
  if (!color || color === "transparent" || color === "#fff" || color === "#ffffff" || color === "rgb(255, 255, 255)" || color === "rgba(255, 255, 255, 1)") {
    return false;
  }

  const rgb = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!rgb) {
    return true;
  }
  if (rgb[1] === rgb[2] && rgb[2] === rgb[3]) {
    return false;
  }
  return rgb[4] === undefined || Number(rgb[4]) > 0;
}

function getWaveColor(element: HTMLElement): string {
  const style = getComputedStyle(element);
  return [style.borderTopColor, style.borderColor, style.backgroundColor].find(isValidWaveColor) || "var(--fn-color-primary, #1677ff)";
}

export function useFnButtonRipple() {
  const ripples = ref<FnButtonRipple[]>([]);
  let nextId = 0;
  const pendingFrames = new Set<number>();
  const cleanupTimers = new Set<number>();

  function createRipple(element: HTMLElement): void {
    const computedStyle = getComputedStyle(element);
    const borderLeft = Number.parseFloat(computedStyle.borderLeftWidth) || 0;
    const borderTop = Number.parseFloat(computedStyle.borderTopWidth) || 0;
    const borderRadius = [
      computedStyle.borderTopLeftRadius,
      computedStyle.borderTopRightRadius,
      computedStyle.borderBottomRightRadius,
      computedStyle.borderBottomLeftRadius,
    ].join(" ");
    const ripple: FnButtonRipple = {
      id: ++nextId,
      active: false,
      style: {
        left: `${-borderLeft}px`,
        top: `${-borderTop}px`,
        width: `${element.offsetWidth}px`,
        height: `${element.offsetHeight}px`,
        borderRadius,
        "--fn-wave-color": getWaveColor(element),
      } as CSSProperties,
    };
    ripples.value = [...ripples.value, ripple];

    const frame = requestAnimationFrame(() => {
      pendingFrames.delete(frame);
      const current = ripples.value.find(item => item.id === ripple.id);
      if (current) current.active = true;
    });
    pendingFrames.add(frame);

    const timer = window.setTimeout(() => {
      cleanupTimers.delete(timer);
      removeRipple(ripple.id);
    }, 2200);
    cleanupTimers.add(timer);
  }

  function removeRipple(id: number): void {
    ripples.value = ripples.value.filter(ripple => ripple.id !== id);
  }

  if (getCurrentInstance()) {
    onBeforeUnmount(() => {
      for (const frame of pendingFrames) cancelAnimationFrame(frame);
      for (const timer of cleanupTimers) window.clearTimeout(timer);
    });
  }

  return { ripples, createRipple, removeRipple };
}
