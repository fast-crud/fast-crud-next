import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse, compileScript } from "@vue/compiler-sfc";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";

const filename = fileURLToPath(new URL("./fn-dropdown-button.vue", import.meta.url));
const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
const script = compileScript(descriptor, { id: "fn-dropdown-button-test", fs: { fileExists: existsSync, readFile: path => readFileSync(path, "utf8") } });
const compiled = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const require = createRequire(import.meta.url);
const module = { exports: {} as any };
const loadDependency = (name: string) => {
  if (name === "vue") {
    return { ...require(name), inject: (key: string, defaultValue: unknown) => (key === "table-size" ? { value: { size: 12, density: "compact" } } : defaultValue) };
  }
  if (name === "@lucide/vue" || name === "./fn-button-base.vue") return {};
  return require(name);
};
new Function("require", "module", "exports", compiled.outputText)(loadDependency, module, module.exports);

describe("FnDropdownButton", () => {
  it("不依赖 CRUD context 或表格尺寸注入", () => {
    expect(script.content).not.toContain("fnTableSizeKey");
    expect(script.content).not.toContain("context.value");
  });

  it("点击菜单按钮时切换菜单", async () => {
    vi.stubGlobal("window", { innerHeight: 500, innerWidth: 800, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    const setup = module.exports.default.setup({ items: [] }, { emit: vi.fn(), expose: vi.fn() });
    setup.toggleMenu();
    await require("vue").nextTick();
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(setup.menuOpen.value).toBe(true);
    vi.unstubAllGlobals();
  });

  it("独立于 FnTable 尺寸计算菜单位置", () => {
    vi.stubGlobal("window", { innerHeight: 500, innerWidth: 800 });
    const setup = module.exports.default.setup({ items: [] }, { emit: vi.fn(), expose: vi.fn() });
    setup.buttonComponentRef.value = { getElement: () => ({ getBoundingClientRect: () => ({ top: 10, bottom: 40, left: 10, right: 100 }) }) };

    setup.updateMenuPosition();

    expect(setup.menuStyle.value).toMatchObject({ top: "45px", left: "8px" });
    vi.unstubAllGlobals();
  });

  it("点击菜单项时调用无上下文回调并发出选择事件", () => {
    const click = vi.fn();
    const emit = vi.fn();
    const setup = module.exports.default.setup({}, { emit, expose: vi.fn() });

    setup.handleMenuClick({ key: "edit", label: "编辑", click });

    expect(click).toHaveBeenCalledWith();
    expect(emit).toHaveBeenCalledWith("select", "edit");
    expect(setup.menuOpen.value).toBe(false);
  });

  it("菜单项只接受 click 回调", () => {
    const legacyOnClick = vi.fn();
    const setup = module.exports.default.setup({}, { emit: vi.fn(), expose: vi.fn() });

    setup.handleMenuClick({ key: "edit", label: "编辑", onClick: legacyOnClick });

    expect(legacyOnClick).not.toHaveBeenCalled();
  });
});
