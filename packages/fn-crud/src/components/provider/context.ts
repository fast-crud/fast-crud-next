import type { ComputedRef, InjectionKey } from "vue";
import { provide, unref, type MaybeRef } from "vue";
import { translateFnCrud, type FnCrudI18n, type FnCrudLocale } from "../../locale";
import type { FnCrudColumnType, FnCrudOptions, FnCrudSearchState, FnTableProps } from "../../types/index.ts";
import { createFnFeedbackQueue } from "../feedback/fn-feedback.ts";

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
  private readonly notificationQueue = createFnFeedbackQueue();
  private readonly messageQueue = createFnFeedbackQueue();
  readonly notificationItems = this.notificationQueue.items;
  readonly messageItems = this.messageQueue.items;
  readonly dismissNotification = this.notificationQueue.remove;
  private services: FnUiServices = { notification: this.notificationQueue.api, message: this.messageQueue.api };

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
