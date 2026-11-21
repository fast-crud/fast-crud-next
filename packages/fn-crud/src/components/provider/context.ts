import type { ComputedRef, InjectionKey } from "vue";
import { provide, unref, type MaybeRef } from "vue";
import { translateFnCrud, type FnCrudI18n, type FnCrudLocale } from "../../locale";
import type { FnCrudColumnType, FnCrudOptions, FnCrudSearchState, FnTableProps } from "../../types/index.ts";
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
  i18n?: FnCrudI18n;
  commonOptions?: () => Partial<FnCrudOptions>;
  columnTypes?: Record<string, FnCrudColumnType>;
}

export class FnCrudContext {
  private options: FnCrudInstallOptions = {};

  configure(options: FnCrudInstallOptions): void {
    this.options = options;
  }

  getCommonOptions(): Partial<FnCrudOptions> {
    return this.options.commonOptions?.() ?? {};
  }

  t(key: string, i18n = this.options.i18n): string {
    return i18n ? i18n.global.t(key) : translateFnCrud(unref(this.options.locale) ?? "zh-CN", key);
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
