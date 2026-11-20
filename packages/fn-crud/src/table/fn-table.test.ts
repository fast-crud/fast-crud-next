import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse, compileScript } from "@vue/compiler-sfc";
import ts from "typescript";
import { expect, it, vi } from "vitest";
import { getFnTableRowKey } from "./row-key";
import { isFnComputeValue } from "../use/compute";

const filename = fileURLToPath(new URL("./fn-table.vue", import.meta.url));
const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
const script = compileScript(descriptor, { id: "fn-table-test", fs: { fileExists: existsSync, readFile: path => readFileSync(path, "utf8") } });
const compiled = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const require = createRequire(import.meta.url);
const module = { exports: {} as any };
const loadDependency = (name: string) => {
  if (name === "@lucide/vue" || name === "./fn-table-row.vue" || name === "../components/fn-render") return {};
  if (name === "./row-key") return { getFnTableRowKey };
  if (name === "../use/compute") return { isFnComputeValue };
  if (name === "../provider/context") return { fnTableSizeKey: "size" };
  return require(name);
};
new Function("require", "module", "exports", compiled.outputText)(loadDependency, module, module.exports);

it("按 columns 对象生成有序渲染列", () => {
  const props = { columns: { name: { title: "名称", cell: { order: 1 } }, id: { title: "ID", cell: { order: 2 } } } };
  const setup = module.exports.default.setup(props, { expose: () => {}, emit: () => {} });
  expect(setup.columns.value.map(column => column.key)).toEqual(["name", "id"]);
});

it("点击同一列头依次切换正序、逆序和取消排序", () => {
  const emitted: Array<[string, unknown]> = [];
  const props = { columns: {}, data: [], sort: { prop: "name", asc: true } };
  const setup = module.exports.default.setup(
    props,
    { expose: () => {}, emit: (name: string, value: unknown) => emitted.push([name, value]) }
  );

  setup.sortColumn("name");
  props.sort = emitted.at(-1)?.[1] as typeof props.sort;
  setup.sortColumn("name");
  props.sort = emitted.at(-1)?.[1] as typeof props.sort;
  setup.sortColumn("name");
  props.sort = emitted.at(-1)?.[1] as typeof props.sort;
  setup.sortColumn("name");

  expect(emitted).toEqual([
    ["sort", { prop: "name", asc: false }],
    ["sort", { prop: "", asc: true }],
    ["sort", { prop: "name", asc: true }],
    ["sort", { prop: "name", asc: false }],
  ]);
});

it("未指定 order 的列保持在明确排序列之后", () => {
  const props = { columns: { actions: { title: "操作", cell: { fixed: "right" as const } }, name: { title: "名称", cell: { order: 1 } } } };
  const setup = module.exports.default.setup(props, { expose: () => {}, emit: () => {} });
  expect(setup.columns.value.map(column => column.key)).toEqual(["name", "actions"]);
});

it("column.show 的显式值优先于 cell.show", () => {
  const setup = module.exports.default.setup(
    {
      columns: {
        visible: { key: "visible", title: "显示", show: true, cell: { show: false } },
        hidden: { key: "hidden", title: "隐藏", show: false, cell: { show: true } },
      },
      data: [],
    },
    { expose: () => {}, emit: () => {} }
  );

  expect(setup.columns.value.map((column: { key: string }) => column.key)).toEqual(["visible"]);
});

it("每组固定列只在滚动边界列添加阴影", () => {
  const setup = module.exports.default.setup(
    {
      columns: {
        leftFirst: { title: "左一", cell: { fixed: "left", order: 1 } },
        leftLast: { title: "左二", cell: { fixed: "left", order: 2 } },
        normal: { title: "普通", cell: { order: 3 } },
        rightFirst: { title: "右一", cell: { fixed: "right", order: 4 } },
        rightLast: { title: "右二", cell: { fixed: "right", order: 5 } },
      },
      data: [],
    },
    { expose: () => {}, emit: () => {} }
  );

  expect(setup.columnClasses(setup.columns.value[0])).toContain("fn-table-fixed-left");
  expect(setup.columnClasses(setup.columns.value[0])).not.toContain("fn-table-fixed-left-shadow");
  expect(setup.columnClasses(setup.columns.value[1])).toContain("fn-table-fixed-left-shadow");
  expect(setup.columnClasses(setup.columns.value[3])).toContain("fn-table-fixed-right-shadow");
  expect(setup.columnClasses(setup.columns.value[4])).not.toContain("fn-table-fixed-right-shadow");
});

it("固定列使用组内累计宽度计算 sticky 偏移", () => {
  const setup = module.exports.default.setup(
    {
      columns: {
        __fn_selection_column: { title: "", cell: { fixed: "left", width: 44, order: 0 } },
        leftFirst: { title: "左一", cell: { fixed: "left", width: 100, order: 1 } },
        leftNext: { title: "左二", cell: { fixed: "left", width: 120, order: 2 } },
        normal: { title: "普通", cell: { width: 200, order: 3 } },
        rightFirst: { title: "右一", cell: { fixed: "right", width: 90, order: 4 } },
        rightLast: { title: "右二", cell: { fixed: "right", width: 110, order: 5 } },
      },
      data: [],
    },
    { expose: () => {}, emit: () => {} }
  );

  expect(setup.columnStyle(setup.columns.value[0], "__fn_selection_column")).toMatchObject({ left: "0px" });
  expect(setup.columnStyle(setup.columns.value[1], "leftFirst")).toMatchObject({ left: "44px" });
  expect(setup.columnStyle(setup.columns.value[2], "leftNext")).toMatchObject({ left: "144px" });
  expect(setup.columnStyle(setup.columns.value[4], "rightFirst")).toMatchObject({ right: "110px" });
  expect(setup.columnStyle(setup.columns.value[5], "rightLast")).toMatchObject({ right: "0px" });
});

it("调整列宽时在拖动结束后只发出一次宽度变更", () => {
  const listeners = new Map<string, (event: PointerEvent) => void>();
  vi.stubGlobal("window", {
    addEventListener: (name: string, listener: (event: PointerEvent) => void) => listeners.set(name, listener),
    removeEventListener: (name: string) => listeners.delete(name),
    setTimeout: (callback: () => void) => callback(),
  });
  const emitted: Array<[string, unknown]> = [];
  const setup = module.exports.default.setup({ columns: {}, data: [] }, { expose: () => {}, emit: (name: string, value: unknown) => emitted.push([name, value]) });

  setup.startResize({ clientX: 100 } as PointerEvent, { key: "name", width: 120 });
  expect(setup.resizeIndicatorLeft.value).toBe(100);
  listeners.get("pointermove")?.({ clientX: 145 } as PointerEvent);
  expect(setup.resizeIndicatorLeft.value).toBe(145);
  listeners.get("pointerup")?.({} as PointerEvent);

  expect(emitted).toEqual([["column-resize", { key: "name", width: 165 }]]);
  expect(setup.resizeIndicatorLeft.value).toBeNull();
  vi.unstubAllGlobals();
});

it("未设置宽度的普通列使用稳定宽度", () => {
  const setup = module.exports.default.setup({ columns: {}, data: [] }, { expose: () => {}, emit: () => {} });

  expect(setup.columnStyle({ key: "name" }, "name").width).toBe("120px");
});

it("取消列宽拖动时不保存宽度", () => {
  const listeners = new Map<string, (event: PointerEvent) => void>();
  vi.stubGlobal("window", {
    addEventListener: (name: string, listener: (event: PointerEvent) => void) => listeners.set(name, listener),
    removeEventListener: (name: string) => listeners.delete(name),
    setTimeout: (callback: () => void) => callback(),
  });
  const emit = vi.fn();
  const setup = module.exports.default.setup({ columns: {}, data: [] }, { expose: () => {}, emit });

  setup.startResize({ clientX: 100 } as PointerEvent, { key: "name", width: 120 });
  listeners.get("pointermove")?.({ clientX: 145 } as PointerEvent);
  listeners.get("pointercancel")?.({} as PointerEvent);

  expect(emit).not.toHaveBeenCalled();
  expect(setup.resizeIndicatorLeft.value).toBeNull();
  vi.unstubAllGlobals();
});

it("不可调整宽度列使用自动宽度且不渲染拖动手柄", () => {
  const setup = module.exports.default.setup({ columns: { spacer: { title: "", cell: { width: "auto", resizable: false } } }, data: [] }, { expose: () => {}, emit: () => {} });
  const column = setup.columns.value[0];

  expect(setup.columnStyle(column, column.key).width).toBe("auto");
  expect(setup.columnClasses(column)).toContain("fn-table-column-unresizable");
  expect(readFileSync(filename, "utf8")).toContain('v-if="column.resizable !== false"');
  expect(readFileSync(filename, "utf8")).toContain('column.resizable === false ? undefined : sortColumn(column.key)');
});
