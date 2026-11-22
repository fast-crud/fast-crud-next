import type { InjectionKey, Ref } from "vue";

export const fnFieldLabelKey: InjectionKey<Readonly<Ref<string | undefined>>> = Symbol("fnFieldLabel");
