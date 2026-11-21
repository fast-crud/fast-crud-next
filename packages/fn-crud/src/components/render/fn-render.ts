import { defineComponent, type PropType } from "vue";
import type { FnRenderSlot } from "./types";

export default defineComponent({
  name: "FnRender",
  props: {
    render: { type: Function as PropType<FnRenderSlot>, required: true },
    ctx: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    getContext: { type: Function as PropType<() => Record<string, any> | undefined> },
  },
  setup(props) {
    return () => props.render(props.getContext?.() ?? props.ctx);
  },
});
