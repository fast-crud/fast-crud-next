import { ref } from "vue";

export interface FnFeedbackItem {
  id: number;
  type: "success" | "error" | "warning" | "info" | "loading";
  message: string;
  description: string;
}

interface FnFeedbackOptions {
  message?: string;
  content?: string;
  description?: string;
  duration?: number;
  type?: FnFeedbackItem["type"];
}

type FnFeedbackInput = string | FnFeedbackOptions;

export function createFnFeedbackQueue() {
  const items = ref<FnFeedbackItem[]>([]);
  const timers = new Map<number, ReturnType<typeof setTimeout>>();
  let nextId = 0;

  function open(type: FnFeedbackItem["type"], options: FnFeedbackInput): void {
    const id = ++nextId;
    const settings = typeof options === "string" ? { message: options } : options;
    items.value.push({
      id,
      type,
      message: String(settings?.message ?? settings?.content ?? ""),
      description: String(settings?.description ?? ""),
    });
    const duration = settings?.duration ?? 3000;
    if (duration !== 0) {
      timers.set(id, setTimeout(() => remove(id), duration > 0 && Number.isFinite(duration) ? duration : 3000));
    }
  }

  function remove(id: number): void {
    const timer = timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.delete(id);
    }
    items.value = items.value.filter(item => item.id !== id);
  }

  function destroy(): void {
    for (const timer of timers.values()) {
      clearTimeout(timer);
    }
    timers.clear();
    items.value = [];
  }

  const api = {
    success: (options: FnFeedbackInput) => open("success", options),
    error: (options: FnFeedbackInput) => open("error", options),
    warning: (options: FnFeedbackInput) => open("warning", options),
    warn: (options: FnFeedbackInput) => open("warning", options),
    info: (options: FnFeedbackInput) => open("info", options),
    open: (options: FnFeedbackInput) => open(typeof options === "string" ? "info" : options?.type ?? "info", options),
    loading: (options: FnFeedbackInput) => open("loading", options),
    destroy,
  };

  return { items, api, remove };
}
