import { defineComponent, h, inject, provide, resolveComponent, toRaw, toRef, type Component } from "vue";
import { fnFormContextKey } from "../form/context.ts";
import { fnFieldLabelKey } from "./context.ts";

export default defineComponent({
  name: "FnComponentRender",
  inheritAttrs: false,
  props: {
    name: { type: [String, Object, Function] as unknown as () => string | Component, required: true },
    vModel: { type: String, default: "modelValue" },
    modelValue: { type: null as unknown as () => any },
    scope: String,
    fieldKey: String,
    fieldLabel: String,
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, emit, slots }) {
    const formContext = inject(fnFormContextKey, undefined);
    const fieldLabel = inject(fnFieldLabelKey, undefined);
    provide(fnFieldLabelKey, toRef(() => props.fieldLabel ?? fieldLabel?.value));
    return () => {
      const component = typeof props.name === "string" ? resolveComponent(props.name) : toRaw(props.name);
      const modelProp = props.vModel || "modelValue";
      const componentAttrs = { ...attrs } as Record<string, any>;
      componentAttrs[modelProp] = props.modelValue;
      componentAttrs[`onUpdate:${modelProp}`] = (value: any) => {
        emit("update:modelValue", value);
        if (props.scope === "form" && props.fieldKey) {
          void formContext?.validateField(props.fieldKey);
        }
      };
      if (slots.default) componentAttrs.default = slots.default;
      return h(component, componentAttrs);
    };
  },
});
