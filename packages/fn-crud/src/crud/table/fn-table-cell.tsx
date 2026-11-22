import set from "lodash-es/set";
import { toDisplayString, type FunctionalComponent, type HTMLAttributes, type PropType, type VNodeChild } from "vue";
import FnComponentRender from "../../components/render/fn-component-render.ts";
import FnTooltip from "../../components/overlay/fn-tooltip.vue";
import type { FnTableColumn, FnTableRow, FnRowContext } from "../../types/index.ts";

interface FnTableCellProps {
  column: FnTableColumn<FnTableRow> & { key: string };
  context: FnRowContext;
  value: unknown;
  tooltip?: string;
}

const FnTableCell: FunctionalComponent<FnTableCellProps, { componentRef: [instance: object | null] }> = (
  { column, context, value, tooltip },
  { emit },
) => {
  const { ellipsis, show, slots } = column;
  const content = renderContent();
  const hasTooltip = Boolean(column.tooltip) && show !== false;
  if (!hasTooltip && slots?.default) return content;

  return (
    <div class={["fn-table-cell", { "fn-table-cell--ellipsis": ellipsis }]}>
      {hasTooltip ? (
        <FnTooltip content={tooltip} disabled={!tooltip} v-slots={{
          default: ({ attrs }: { attrs: HTMLAttributes }) => (
            <span {...attrs} class="fn-table-cell-trigger" tabindex={tooltip ? 0 : undefined}>{content}</span>
          ),
        }} />
      ) : content}
    </div>
  );

  function renderContent(): VNodeChild {
    const { render, component, title } = column;
    if (slots?.default) return slots.default(context);
    if (show === false) return null;
    if (typeof render === "function") return render(context);
    if (component) {
      const componentProps = { ...component } as Record<string, any>;
      const modelProp = componentProps.vModel || "modelValue";
      if (componentProps.modelValue === undefined) {
        componentProps.modelValue = componentProps[modelProp] ?? value;
      }
      if (componentProps[modelProp] === undefined) {
        componentProps[modelProp] = componentProps.modelValue;
      }
      return <FnComponentRender
        {...componentProps}
        name={componentProps.name}
        ref={instance => emit("componentRef", instance)}
        scope="table-cell"
        fieldLabel={title}
        onUpdate:modelValue={nextValue => {
          set(context.row, column.key, nextValue);
        }}
      />;
    }
    return toDisplayString(value ?? "—");
  }
};

FnTableCell.props = {
  column: { type: Object as PropType<FnTableCellProps["column"]>, required: true },
  context: { type: Object as PropType<FnRowContext>, required: true },
  value: { type: null, required: true },
  tooltip: String,
};
FnTableCell.emits = ["componentRef"];

export default FnTableCell;
