import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse, compileScript } from "@vue/compiler-sfc";
import ts from "typescript";
import { describe, it, expect, vi } from "vitest";

const filename = fileURLToPath(new URL("./fn-button-base.vue", import.meta.url));
const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
const script = compileScript(descriptor, { id: "fn-button-base-test", fs: { fileExists: existsSync, readFile: path => readFileSync(path, "utf8") } });
const compiled = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const require = createRequire(import.meta.url);
const module = { exports: {} as any };
const loadDependency = (name: string) => {
  if (name === "vue") {
    return require(name);
  }
  if (name === "@lucide/vue" || name === "../icon/fn-icon.vue" || name === "./fn-dropdown-button.vue") {
    return {};
  }
  if (name === "./use-fn-button-ripple.ts") {
    return {
      useFnButtonRipple: () => {
        const ripples = require("vue").ref([]);
        let id = 0;
        return {
          ripples,
          createRipple: () => { ripples.value = [...ripples.value, ++id]; },
          removeRipple: (rippleId: number) => { ripples.value = ripples.value.filter((ripple: number) => ripple !== rippleId); },
        };
      },
    };
  }
  return require(name);
};
new Function("require", "module", "exports", compiled.outputText)(loadDependency, module, module.exports);

describe("FnButtonBase 基础行为", () => {
  it("只发出原生 click 事件，不处理业务上下文", () => {
    const emit = vi.fn();
    const setup = module.exports.default.setup({ disabled: false, loading: false }, { expose: () => {}, emit });
    const button = {};

    setup.handleClick({ currentTarget: button });

    expect(emit).toHaveBeenCalledWith("click", { currentTarget: button });
    expect(setup.ripples.value).toHaveLength(1);
  });

  it("支持 danger、禁用状态和自定义主色", () => {
    const setup = module.exports.default.setup({ type: "default", danger: true, disabled: true, primaryColor: "#4c63ff" }, { expose: () => {}, emit: () => {} });
    setup.handleClick({ currentTarget: {} });
    expect(setup.buttonClasses.value).toMatchObject({ "fn-button-default": true, "fn-button-danger": true, "fn-button-disabled": true });
    expect(setup.buttonStyle.value["--fn-button-primary"]).toBe("#4c63ff");
  });

  it("默认圆角形状不会覆盖 primary 按钮类型", () => {
    const setup = module.exports.default.setup({ type: "primary", shape: "default" }, { expose: () => {}, emit: () => {} });
    expect(setup.buttonClasses.value).toMatchObject({ "fn-button-primary": true, "fn-button-shape-default": true });
    expect(setup.buttonClasses.value["fn-button-default"]).toBeUndefined();
  });

  it("点击按钮时创建外圈波纹", () => {
    const setup = module.exports.default.setup({ disabled: false, loading: false }, { expose: () => {}, emit: () => {} });
    const button = {};

    setup.handleClick({ currentTarget: button, detail: 1 });

    expect(setup.ripples.value).toHaveLength(1);
  });

  it("禁用或加载时不生成波纹", () => {
    for (const props of [{ disabled: true, loading: false }, { disabled: false, loading: true }]) {
      const setup = module.exports.default.setup(props, { expose: () => {}, emit: () => {} });
      setup.handleClick({ currentTarget: {}, detail: 1 });

      expect(setup.ripples.value).toHaveLength(0);
    }
  });
});
