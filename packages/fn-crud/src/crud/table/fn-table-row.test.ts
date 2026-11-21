import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse, compileScript } from "@vue/compiler-sfc";
import ts from "typescript";
import { expect, it, vi } from "vitest";
import { reactive } from "vue";
import { useCompute } from "../use/use-compute";

const { compute } = useCompute();

const filename = fileURLToPath(new URL("./fn-table-row.vue", import.meta.url));
const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
const script = compileScript(descriptor, { id: "fn-table-row-test", fs: { fileExists: existsSync, readFile: path => readFileSync(path, "utf8") } });
const compiled = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const require = createRequire(import.meta.url);
const module = { exports: {} as any };
const loadDependency = (name: string) => {
  if (["./fn-table-cell.vue", "../../components/render/fn-render.ts", "../../components/selection/fn-checkbox.vue", "../../components/selection/fn-radio.vue"].includes(name)) return {};
  if (name === "../use/use-compute") return { useCompute };
  return require(name);
};
new Function("require", "module", "exports", compiled.outputText)(loadDependency, module, module.exports);

it("FnTableRow 构造 FnRowContext、读取单元格值并在行内管理组件 ref", () => {
  const row = { id: 12, name: "cert" };
  const columnClasses = vi.fn(() => []);
  const columnStyle = vi.fn(() => ({}));
  const setup = module.exports.default.setup({
    row,
    index: 2,
    columns: [{ key: "actions", title: "操作", sourceCell: compute(({ form, index }) => ({ title: `${form?.name}-${index}` })) }],
    columnClasses,
    columnStyle,
  }, { expose: () => {}, emit: () => {} });

  expect(setup.rowContext.value).toMatchObject({ type: "row", row, form: row, index: 2 });
  const instance = { focus: vi.fn() };
  setup.setComponentRef("name", instance);
  expect(setup.rowContext.value.getComponentRef("name")).toBe(instance);
  setup.setComponentRef("name", undefined);
  expect(setup.rowContext.value.getComponentRef("name")).toBeUndefined();
  expect(setup.resolvedColumns.value[0].title).toBe("cert-2");
  expect(setup.getCellValue(row, { key: "name" })).toBe("cert");
  expect(setup.getCellValue(row, { key: "missing.value" })).toBeUndefined();
  expect(columnClasses).not.toHaveBeenCalled();
  expect(columnStyle).not.toHaveBeenCalled();
});

it("FnTableRow 在静态 cell 对象中解析叶子 compute", () => {
  const row = reactive({ enabled: true });
  const setup = module.exports.default.setup({
    row,
    index: 0,
    columns: [{ key: "enabled", title: "启用", sourceCell: { component: { disabled: compute(({ row: current }) => !current?.enabled) } } }],
    columnClasses: () => [],
    columnStyle: () => ({}),
  }, { expose: () => {}, emit: () => {} });

  expect(setup.resolvedColumns.value[0].component.disabled).toBe(false);
  row.enabled = false;
  expect(setup.resolvedColumns.value[0].component.disabled).toBe(true);
});
