export type FnRenderSlot = (ctx?: Record<string, any>) => any;
export type FnSlots = Partial<Record<string, FnRenderSlot>>;

export type FnComponentProps = {
  name?: import("vue").Component | string;
  vModel?: string;
  props?: Record<string, any>;
  [key: string]: any;
};
