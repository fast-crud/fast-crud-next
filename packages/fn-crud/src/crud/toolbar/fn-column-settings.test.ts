import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse, compileScript } from "@vue/compiler-sfc";
import ts from "typescript";
import { expect, it, vi } from "vitest";
import { nextTick, reactive } from "vue";

const filename = fileURLToPath(new URL("./fn-column-settings.vue", import.meta.url));
const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
const script = compileScript(descriptor, { id: "fn-column-settings-test", fs: { fileExists: existsSync, readFile: path => readFileSync(path, "utf8") } });
const compiled = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const require = createRequire(import.meta.url);
const module = { exports: {} as any };
const loadDependency = (name: string) => {
  if (name === "@lucide/vue" || name === "../../components/overlay/fn-drawer.vue" || name === "../../components/button/fn-button-base.vue" || name === "../../components/button/fn-button-group.vue" || name === "../../components/selection/fn-checkbox.vue" || name === "../../components/render/fn-render.ts") return {};
  return require(name);
};
new Function("require", "module", "exports", compiled.outputText)(loadDependency, module, module.exports);

it("还原和确定按钮共用等宽且同高的页脚布局", () => {
  const template = descriptor.template?.content ?? "";
  const styles = descriptor.styles.map(style => style.content).join("\n");

  expect(template).toContain('<button class="fn-column-settings-reset"');
  expect(template).toContain('<div class="fn-column-settings-confirm"><FnButtonBase');
  expect(styles).toContain(".fn-column-settings-footer {\n  display: flex;");
  expect(styles).toContain(".fn-column-settings-reset {\n  display: inline-flex;\n  min-width: 0;\n  height: 40px;\n  flex: 1;");
  expect(styles).toContain(".fn-column-settings-confirm {\n  flex: 1;");
  expect(styles).toContain("height: 40px;\n    min-height: 40px;");
});

it("通过 slots.bodyBottom render prop 渲染自定义内容", () => {
  const template = descriptor.template?.content ?? "";

  expect(template).toContain("props.slots?.bodyBottom");
  expect(template).toContain('<FnRender :render="props.slots.bodyBottom" />');
  expect(template).not.toContain("$slots.bodyBottom");
});

function reorder(columns: Array<{ key: string; fixed?: "left" | "right" }>, sourceKey: string, targetKey: string) {
  const setup = module.exports.default.setup({ modelValue: true, columns: columns.map(column => ({ ...column, title: column.key, show: true })) }, { emit: vi.fn(), expose: () => {} });
  setup.draggingKey.value = sourceKey;
  setup.dropColumn(targetKey);
  return setup.rows.value.map((column: { key: string }) => column.key);
}

function setFixed(columns: Array<{ key: string; fixed?: "left" | "right" }>, sourceKey: string, fixed: "left" | "right" | undefined) {
  const setup = module.exports.default.setup({ modelValue: true, columns: columns.map(column => ({ ...column, title: column.key, show: true })) }, { emit: vi.fn(), expose: () => {} });
  const column = setup.rows.value.find((item: { key: string }) => item.key === sourceKey);
  setup.setFixed(column, fixed);
  return setup.rows.value.map((item: { key: string; fixed?: string }) => ({ key: item.key, fixed: item.fixed }));
}

it("右固定列只能在右固定列之间拖动排序", () => {
  expect(reorder([{ key: "normal" }, { key: "rightA", fixed: "right" }, { key: "rightB", fixed: "right" }], "rightB", "rightA")).toEqual(["normal", "rightB", "rightA"]);
  expect(reorder([{ key: "normal" }, { key: "rightA", fixed: "right" }, { key: "rightB", fixed: "right" }], "rightB", "normal")).toEqual(["normal", "rightA", "rightB"]);
});

it("列设置只在点击确定时提交草稿", () => {
  const emitted: Array<[string, unknown]> = [];
  const columns = [{ key: "name", title: "名称", show: true }];
  const setup = module.exports.default.setup({ modelValue: true, columns }, { emit: (name: string, value: unknown) => emitted.push([name, value]), expose: () => {} });

  setup.toggleAll(false);
  setup.setFixed(setup.rows.value[0], "left");

  expect(emitted).toEqual([]);
  setup.confirm();

  expect(emitted).toEqual([
    ["update:columns", [{ key: "name", title: "名称", show: false, fixed: "left" }]],
    ["update:modelValue", false],
  ]);
  expect(columns[0].show).toBe(true);
});

it("打开时可切换设置状态，关闭后丢弃草稿", async () => {
  const props = reactive({
    modelValue: true,
    columns: [
      { key: "name", title: "名称", show: true },
      { key: "environment", title: "环境", show: true, setting: { show: false } },
      { key: "status", title: "状态", show: true, setting: { disabled: true } },
    ],
  });
  const emit = vi.fn();
  const setup = module.exports.default.setup(props, { emit, expose: () => {} });
  setup.toggleAll(false);
  props.columns[1].setting!.show = true;
  props.columns[2].setting!.disabled = false;
  await nextTick();

  expect(setup.visibleRows.value.map((column: { key: string }) => column.key)).toEqual(["name", "environment", "status"]);
  expect(setup.isDisabled(setup.rows.value[2])).toBe(false);
  expect(setup.rows.value[0].show).toBe(false);
  expect(emit).not.toHaveBeenCalled();

  props.modelValue = false;
  await nextTick();
  props.modelValue = true;
  await nextTick();
  expect(setup.rows.value[0].show).toBe(true);
});

it("还原通过 reset 事件清除用户偏好", () => {
  const emitted: Array<[string, unknown]> = [];
  const columns = [{ key: "name", title: "名称", show: true }];
  const setup = module.exports.default.setup({ modelValue: true, columns }, { emit: (name: string, value: unknown) => emitted.push([name, value]), expose: () => {} });

  setup.toggleAll(false);
  setup.reset();

  expect(setup.rows.value[0].show).toBe(true);
  expect(emitted).toEqual([["reset", undefined]]);
});

it("按 FnColumnSettingControl 隐藏或禁用列设置控件", () => {
  const setup = module.exports.default.setup(
    {
      modelValue: true,
      columns: [
        { key: "hidden", title: "隐藏控件", show: true, setting: { show: false } },
        { key: "locked", title: "禁用控件", show: true, setting: { disabled: true } },
        { key: "dynamic", title: "动态列", show: true, dynamic: true },
      ],
    },
    { emit: vi.fn(), expose: () => {} }
  );

  expect(setup.isDisabled(setup.rows.value[0])).toBe(true);
  expect(setup.isDisabled(setup.rows.value[1])).toBe(true);
  expect(setup.isDisabled(setup.rows.value[2])).toBe(true);
  expect(setup.visibleRows.value.map((column: { key: string }) => column.key)).toEqual(["locked", "dynamic"]);
});

it("全选仅更新可编辑列，不修改隐藏或禁用列", () => {
  const emit = vi.fn();
  const setup = module.exports.default.setup(
    {
      modelValue: true,
      columns: [
        { key: "name", title: "名称", show: true },
        { key: "hidden", title: "隐藏", show: true, setting: { show: false } },
        { key: "locked", title: "禁用", show: true, setting: { disabled: true } },
      ],
    },
    { emit, expose: () => {} }
  );

  setup.toggleAll(false);

  expect(setup.rows.value.map((column: { show: boolean }) => column.show)).toEqual([false, true, true]);
  expect(setup.visibleCount.value).toBe(1);
  expect(setup.allVisible.value).toBe(false);
  expect(setup.someVisible.value).toBe(false);
  expect(emit).not.toHaveBeenCalled();
});

it("点击右固定将列插入首个右固定列之前", () => {
  expect(setFixed([{ key: "rightA", fixed: "right" }, { key: "rightB", fixed: "right" }, { key: "normal" }], "normal", "right")).toEqual([
    { key: "normal", fixed: "right" },
    { key: "rightA", fixed: "right" },
    { key: "rightB", fixed: "right" },
  ]);
});

it("取消右固定时将列放到剩余右固定列之前", () => {
  expect(setFixed([{ key: "rightA", fixed: "right" }, { key: "normal" }, { key: "rightB", fixed: "right" }], "rightA", undefined)).toEqual([
    { key: "normal", fixed: undefined },
    { key: "rightA", fixed: undefined },
    { key: "rightB", fixed: "right" },
  ]);
});
