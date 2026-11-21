import type { ComputedRef, InjectionKey } from "vue";
import { provide, unref, type MaybeRef } from "vue";
import { fnCrudLocales, type FnCrudLocale } from "../../locale";
import type { FnCrudOptions, FnCrudSearchState, FnTableProps } from "../../types/index.ts";
import { createFnNotification } from "../feedback/fn-notification.ts";

export interface FnFeedbackApi {
  success(options: any): void;
  error(options: any): void;
  warning?(options: any): void;
  warn?(options: any): void;
  info?(options: any): void;
  open?(options: any): void;
  loading?(options: any): unknown;
  destroy?(): void;
}

export interface FnUiServices {
  notification: FnFeedbackApi;
  message: FnFeedbackApi;
}

export class UiContext {
  readonly notificationItems: ReturnType<typeof createFnNotification>["items"];
  private services: FnUiServices;

  constructor() {
    const defaults = createFnNotification();
    this.notificationItems = defaults.items;
    this.services = defaults.services;
  }

  getServices(): FnUiServices {
    return this.services;
  }

  setServices(services: FnUiServices): void {
    this.services = services;
  }
}

export interface FnCrudInstallOptions {
  locale?: MaybeRef<FnCrudLocale>;
  commonOptions?: () => Partial<FnCrudOptions>;
}

export class FnCrudContext {
  private options: FnCrudInstallOptions = {};

  configure(options: FnCrudInstallOptions): void {
    this.options = options;
  }

  getCommonOptions(): Partial<FnCrudOptions> {
    return this.options.commonOptions?.() ?? {};
  }

  getMessages() {
    return fnCrudLocales[unref(this.options.locale) ?? "zh-CN"];
  }
}

export const uiContext = new UiContext();
export const fnCrudContext = new FnCrudContext();
export const fnUiServicesKey: InjectionKey<FnUiServices> = Symbol("FnUiServices");

export const fnCrudSearchKey: InjectionKey<FnCrudSearchState> = Symbol("FnCrudSearch");
export const fnTableSizeKey: InjectionKey<ComputedRef<Pick<FnTableProps, "size" | "density">>> = Symbol("FnTableSize");
export function provideFnUiServices(): void {
  provide(fnUiServicesKey, uiContext.getServices());
}
