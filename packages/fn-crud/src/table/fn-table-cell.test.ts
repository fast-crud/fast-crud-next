import { createRenderer, defineComponent, h, reactive } from "vue";
import { expect, it } from "vitest";
import FnComponentRender from "../components/fn-component-render";
import { updateCellValue } from "./cell-value";

interface TestNode {
  type: string;
  props: Record<string, any>;
  children: TestNode[];
  parent?: TestNode;
}

const renderer = createRenderer<TestNode, TestNode>({
  createElement: type => ({ type, props: {}, children: [] }),
  createText: () => ({ type: "#text", props: {}, children: [] }),
  createComment: () => ({ type: "#comment", props: {}, children: [] }),
  setText: () => {},
  setElementText: node => { node.children = []; },
  patchProp: (node, key, _previous, next) => { node.props[key] = next; },
  insert: (node, parent, anchor) => {
    node.parent = parent;
    const index = anchor ? parent.children.indexOf(anchor) : -1;
    if (index < 0) parent.children.push(node);
    else parent.children.splice(index, 0, node);
  },
  remove: node => {
    const index = node.parent?.children.indexOf(node) ?? -1;
    if (index >= 0) node.parent!.children.splice(index, 1);
    node.parent = undefined;
  },
  parentNode: node => node.parent || null,
  nextSibling: node => {
    const siblings = node.parent?.children || [];
    return siblings[siblings.indexOf(node) + 1] || null;
  },
});

function findInput(node: TestNode): TestNode | undefined {
  if (node.type === "input") return node;
  return node.children.map(findInput).find(Boolean);
}

it("FnComponentRender 的 vModel 更新会写回当前行字段", () => {
  const row = reactive({ quantity: 4 });
  const Input = defineComponent({
    props: { modelValue: Number },
    emits: ["update:modelValue"],
    setup: (_props, { emit }) => () => h("input", { onChange: () => emit("update:modelValue", 9) }),
  });
  const root: TestNode = { type: "root", props: {}, children: [] };
  const app = renderer.createApp({
    render: () => h(FnComponentRender, {
      name: Input,
      vModel: "modelValue",
      modelValue: row.quantity,
      "onUpdate:modelValue": (value: unknown) => updateCellValue(row, "quantity", value),
    }),
  });

  app.mount(root);
  findInput(root)?.props.onChange();

  expect(row.quantity).toBe(9);
  app.unmount();
});

it("vModel 可写回嵌套字段", () => {
  const row = reactive({ order: { quantity: 4 } });

  updateCellValue(row, "order.quantity", 9);

  expect(row.order.quantity).toBe(9);
});
