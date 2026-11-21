import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse, compileScript } from "@vue/compiler-sfc";
import ts from "typescript";
import { expect, it, vi } from "vitest";

function loadComponent(name: string, dependencies: Record<string, unknown> = {}) {
  const filename = fileURLToPath(new URL(`${name === "fn-checkbox" || name === "fn-radio" ? "../selection" : "."}/${name}.vue`, import.meta.url));
  const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
  const script = compileScript(descriptor, { id: `${name}-test`, fs: { fileExists: existsSync, readFile: path => readFileSync(path, "utf8") } });
  const compiled = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const require = createRequire(import.meta.url);
  const module = { exports: {} as any };
  const loadDependency = (id: string) => id in dependencies ? dependencies[id] : require(id);
  new Function("require", "module", "exports", compiled.outputText)(loadDependency, module, module.exports);
  return module.exports.default;
}

const FnCheckbox = loadComponent("fn-checkbox");
const FnRadio = loadComponent("fn-radio");
const FnButtonGroup = loadComponent("fn-button-group", { "../fn-icon.vue": {} });

it("FnCheckbox 把受控布尔值变化通过 update 和 change 发出", () => {
  const emit = vi.fn();
  const setup = FnCheckbox.setup({ modelValue: false, disabled: false, indeterminate: true }, { emit, expose: () => {} });
  const event = { target: { checked: true } } as unknown as Event;

  setup.change(event);

  expect(emit).toHaveBeenNthCalledWith(1, "update:modelValue", true);
  expect(emit).toHaveBeenNthCalledWith(2, "change", true, event);
});

it("FnRadio 仅在选中时发出选项值", () => {
  const emit = vi.fn();
  const setup = FnRadio.setup({ modelValue: "left", value: "right", disabled: false }, { emit, expose: () => {} });

  setup.change({ target: { checked: false } } as unknown as Event);
  expect(emit).not.toHaveBeenCalled();
  setup.change({ target: { checked: true } } as unknown as Event);

  expect(emit).toHaveBeenNthCalledWith(1, "update:modelValue", "right");
  expect(emit).toHaveBeenNthCalledWith(2, "change", "right", expect.anything());
});

it("FnButtonGroup 阻止禁用选项更新并提交有效选项", () => {
  const emit = vi.fn();
  const options = [{ value: "left" }, { value: "right", disabled: true }];
  const setup = FnButtonGroup.setup({ modelValue: "left", options, label: "固定位置", disabled: false }, { emit, expose: () => {} });

  setup.select("right");
  expect(emit).not.toHaveBeenCalled();
  setup.select("left");

  expect(emit).toHaveBeenNthCalledWith(1, "update:modelValue", "left");
  expect(emit).toHaveBeenNthCalledWith(2, "change", "left");
});
