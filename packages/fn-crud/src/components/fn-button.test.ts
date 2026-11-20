import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse, compileScript } from "@vue/compiler-sfc";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";
import { computed, ref } from "vue";
import type { FnButtonProps } from "../types/index";

const filename = fileURLToPath(new URL("./fn-button.vue", import.meta.url));
const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
const script = compileScript(descriptor, { id: "fn-button-test", fs: { fileExists: existsSync, readFile: path => readFileSync(path, "utf8") } });
const compiled = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const require = createRequire(import.meta.url);
const module = { exports: {} as any };
const loadDependency = (name: string) => (name === "vue" ? require(name) : {});
new Function("require", "module", "exports", compiled.outputText)(loadDependency, module, module.exports);

describe("FnButton", () => {
  it("按 buttonType 分发基础按钮和下拉按钮", () => {
    const template = descriptor.template?.content ?? "";

    expect(template).toContain("buttonType === 'dropdown'");
    expect(template).toContain("<FnDropdownButton");
    expect(template).toContain("<FnButtonBase");
  });

  it("默认显示按钮", () => {
    expect(module.exports.default.props.show.default).toBe(true);
  });

  it("剥离 wrapper 配置并调用业务闭包，不生成 CRUD context", () => {
    const click = vi.fn();
    const setup = module.exports.default.setup(
      { buttonType: "button", text: "编辑", click, context: { type: "row", row: { id: 1 } } },
      { emit: vi.fn(), expose: vi.fn() }
    );

    setup.handleClick();

    expect(setup.buttonProps.value).toEqual(expect.objectContaining({ text: "编辑" }));
    expect(setup.buttonProps.value).not.toHaveProperty("context");
    expect(click).toHaveBeenCalledWith();
  });

  it("支持响应式按钮文案并随 computed 更新", () => {
    const enabled = ref(false);
    const button: FnButtonProps = {
      text: computed(() => enabled.value ? "禁用数量输入" : "启用数量输入"),
    };
    const setup = module.exports.default.setup(button, { emit: vi.fn(), expose: vi.fn() });

    expect(setup.buttonProps.value.text).toBe("启用数量输入");
    enabled.value = true;
    expect(setup.buttonProps.value.text).toBe("禁用数量输入");
  });

  it("只接受 click 回调", () => {
    const legacyOnClick = vi.fn();
    const setup = module.exports.default.setup({ onClick: legacyOnClick }, { emit: vi.fn(), expose: vi.fn() });

    setup.handleClick();

    expect(legacyOnClick).not.toHaveBeenCalled();
  });
});
