import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { compileScript, parse } from "@vue/compiler-sfc";
import { Check, Minus } from "@lucide/vue";
import ts from "typescript";
import { createRenderer, nextTick, ref, type Component } from "vue";
import { expect, it } from "vitest";
import type { FnOptionValue } from "./types";

const require = createRequire(import.meta.url);

function loadComponent(path: string): Component {
  const filename = fileURLToPath(new URL(path, import.meta.url));
  const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
  const script = compileScript(descriptor, {
    id: path,
    inlineTemplate: true,
    fs: { fileExists: existsSync, readFile: file => readFileSync(file, "utf8") },
  });
  const { outputText } = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const module = { exports: {} as { default: Component } };
  function loadDependency(name: string) {
    if (name.endsWith(".vue")) return { __esModule: true, default: loadComponent(name) };
    if (name === "@lucide/vue") return { Check, Minus };
    return require(name);
  }
  new Function("require", "module", "exports", outputText)(loadDependency, module, module.exports);
  return module.exports.default;
}

const FnRadioGroup = loadComponent("./fn-radio-group.vue");
const FnCheckboxGroup = loadComponent("./fn-checkbox-group.vue");

interface HostElement {
  tag: string;
  props: Record<string, any>;
  children: HostElement[];
  parent?: HostElement;
}

function element(tag: string): HostElement {
  return { tag, props: {}, children: [] };
}

const renderer = createRenderer<HostElement, HostElement>({
  createElement: element,
  createText: () => element("#text"),
  createComment: () => element("#comment"),
  setText: () => undefined,
  setElementText: () => undefined,
  patchProp: (node, key, _oldValue, value) => { node.props[key] = value; },
  parentNode: node => node.parent ?? null,
  nextSibling: node => node.parent?.children[(node.parent.children.indexOf(node)) + 1] ?? null,
  insert(node, parent, anchor) {
    node.parent = parent;
    const index = anchor ? parent.children.indexOf(anchor) : parent.children.length;
    parent.children.splice(index, 0, node);
  },
  remove(node) {
    const children = node.parent?.children;
    if (children) children.splice(children.indexOf(node), 1);
  },
});

const options = [
  { value: 0, label: "关闭" },
  { value: false, label: "未确认" },
  { value: 2, label: "隐藏", show: false },
  { value: 3, label: "禁用", disabled: true },
];

function inputs(node: HostElement): HostElement[] {
  return node.tag === "input" ? [node] : node.children.flatMap(inputs);
}

it("单选组只更新一个值，且保留选项原始类型", async () => {
  const selected = ref<FnOptionValue>();
  const root = element("root");
  const app = renderer.createApp(() => (
    <FnRadioGroup modelValue={selected.value} options={options} onUpdate:modelValue={(value: FnOptionValue) => { selected.value = value; }} />
  ));
  app.mount(root);
  const [first, second, disabled] = inputs(root);
  expect(inputs(root)).toHaveLength(3);
  expect(first.props.name).toBe(second.props.name);
  expect(second.props.checked).toBe(false);
  expect(disabled.props.disabled).toBe(true);
  second.props.onChange({ target: { checked: true } });
  await nextTick();
  expect(selected.value).toBe(false);
  expect(second.props.checked).toBe(true);
  app.unmount();
});

it("复选组切换项目时发出新数组并保留其他选中项", async () => {
  const selected = ref<FnOptionValue[]>([0]);
  const root = element("root");
  const app = renderer.createApp(() => (
    <FnCheckboxGroup modelValue={selected.value} options={options} onUpdate:modelValue={(value: FnOptionValue[]) => { selected.value = value; }} />
  ));
  app.mount(root);
  const [first, second] = inputs(root);
  second.props.onChange({ target: { checked: true } });
  await nextTick();
  expect(selected.value).toEqual([0, false]);
  first.props.onChange({ target: { checked: false } });
  expect(selected.value).toEqual([false]);
  app.unmount();
});
