import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse, compileScript } from "@vue/compiler-sfc";
import ts from "typescript";
import { expect, it, vi } from "vitest";
import { computed, reactive, ref } from "vue";
import { getFnTableRowKey } from "./table/row-key";
import { compute, isFnComputeValue, resolveComputedValue } from "./use/compute";
import * as crudUse from "./use.tsx";
import * as tableUse from "./use/use-table";
import { fnCrudContext, uiContext } from "./provider/context";
import { FN_CRUD_BLANK_COLUMN_KEY, useFnCrud } from "./use/use-fn-crud";
import { useMerge } from "./use/use-merge";
import type { FnCrudExpose } from "./types/index";
import * as preferences from "./preferences";
import { mergeFnCrudPreferences } from "./preferences";

const confirmDelete = vi.fn();

const filename = fileURLToPath(new URL("./fn-crud.vue", import.meta.url));
const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
const script = compileScript(descriptor, { id: "fn-crud-test", fs: { fileExists: existsSync, readFile: path => readFileSync(path, "utf8") } });
const compiled = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const require = createRequire(import.meta.url);
const module = { exports: {} as any };
const loadDependency = (name: string) => {
  if (
    [
      "./table/fn-table.vue",
      "./table/fn-pagination.vue",
      "./search/index.vue",
      "./tabs/index.vue",
      "./components/fn-heading.vue",
      "./components/fn-button.vue",
      "./components/fn-actionbar.vue",
      "./components/fn-toolbar.vue",
      "./components/fn-column-settings.vue",
      "./form/fn-form-dialog.vue",
      "./components/fn-render",
    ].includes(name)
  )
    return {};
  if (name === "./components/fn-checkbox.vue") return { default: { name: "FnCheckbox" } };
  if (name === "./components/fn-radio.vue") return { default: { name: "FnRadio" } };
  if (name === "./use/compute") return { compute, isFnComputeValue, resolveComputedValue };
  if (name === "./provider/context")
    return {
      fnCrudSearchKey: "search",
      fnCrudContext,
      uiContext,
    };
  if (name === "./use.tsx") return crudUse;
  if (name === "./use/use-table") return tableUse;
  if (name === "./use/use-fn-crud") return { FN_CRUD_BLANK_COLUMN_KEY };
  if (name === "./use/use-merge") return { useMerge };
  if (name === "./preferences") return { ...preferences, mergeFnCrudPreferences };
  if (name === "./table/row-key") return { getFnTableRowKey };
  if (name === "./modal/dialog") return { model: { confirm: confirmDelete } };
  if (name === "ant-design-vue") return { notification: { success: vi.fn(), error: vi.fn() } };
  return require(name);
};
new Function("require", "module", "exports", "mergeFnCrudPreferences", compiled.outputText)(loadDependency, module, module.exports, mergeFnCrudPreferences);

it("FnCrud 通过计算 props 绑定内置子组件并将按钮渲染交给对应组件", () => {
  const template = descriptor.template?.content ?? "";
  const actionbar = parse(readFileSync(new URL("./components/fn-actionbar.vue", import.meta.url), "utf8")).descriptor.template?.content ?? "";
  const toolbar = parse(readFileSync(new URL("./components/fn-toolbar.vue", import.meta.url), "utf8")).descriptor.template?.content ?? "";

  expect(template).toContain('<FnHeading v-if="(col.type === \'header\' || col.type === \'heading\') && headingProps.show !== false" v-bind="headingProps" />');
  expect(template).toContain('<FnTabs v-else-if="col.type === \'tabs\' && tabsProps.show !== false" v-bind="tabsProps" />');
  expect(template).toContain('<FnSearch v-else-if="col.type === \'search\' && searchProps.show !== false" v-bind="searchProps" />');
  expect(template).toContain('<FnActionbar v-else-if="col.type === \'actionbar\' && actionbarProps.show !== false" v-bind="actionbarProps" />');
  expect(template).toContain('<FnToolbar v-else-if="col.type === \'toolbar\' && toolbarProps.show !== false" v-bind="toolbarProps"');
  expect(template).toContain('<div class="fn-crud-body">');
  expect(template).toContain('<FnRender v-if="tableRenderProps.show" v-bind="tableRenderProps" />');
  expect(template).toContain('<FnTable v-else-if="tableProps.show !== false" v-bind="tableProps" />');
  expect(template).not.toMatch(/<FnButton\s+v-for=/);
  expect(template).not.toContain("<FnColumnSettings");
  expect(template).not.toContain("<slot name=\"header\"");
  expect(template).not.toContain("<slot name=\"search\"");
  expect(template).not.toContain("#bodyBottom");
  expect(actionbar).toMatch(/<FnButton\s+v-for="\(button, key\) in buttons"/);
  expect(toolbar).toMatch(/<FnButton\s+v-for="\(button, key\) in buttons"/);
  expect(toolbar).toContain('<FnColumnSettings v-bind="columnSettingsProps" />');
  expect(toolbar).not.toContain("#bodyBottom");
});

it("FnCrud 将 header 和 bodyBottom render 放入对应子组件的 slots props", () => {
  const header = vi.fn();
  const bodyBottom = vi.fn();
  const table = vi.fn();
  const setup = module.exports.default.setup({ columns: {}, request: { pageRequest: vi.fn() }, slots: { default: table, header, bodyBottom } }, { emit: () => {}, expose: () => {} });

  expect(setup.headingProps.value.slots.default).toBe(header);
  expect(setup.toolbarProps.value.columnSettingsProps.slots.bodyBottom).toBe(bodyBottom);
  expect(setup.tableRenderProps.value.show).toBe(true);
  setup.tableRenderProps.value.render(setup.tableProps.value);
  expect(table).toHaveBeenCalledWith(expect.objectContaining({ data: [], columns: {}, sort: { prop: "", asc: true } }));
});

it("FnCrud 将 provider 公共配置与显式 props 深度合并", () => {
  fnCrudContext.configure({ commonOptions: () => ({ columns: { commonOnly: { key: "commonOnly", title: "公共列" } }, pagination: { pageSize: 20, showQuickJumper: true } }) });
  const state = reactive({ columns: { localOnly: { key: "localOnly", title: "本地列" } }, request: { pageRequest: vi.fn() }, pagination: { pageSize: 50 } }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });

  expect(setup.paginationProps.value).toMatchObject({ pageSize: 50, showQuickJumper: true });
  expect(setup.table.tableProps.value.columns).toMatchObject({
    __fn_blank_column: { key: "__fn_blank_column", title: "", cell: { width: "auto", resizable: false, setting: { show: false } } },
    commonOnly: { key: "commonOnly", title: "公共列" },
    localOnly: { key: "localOnly", title: "本地列" },
  });
  expect(setup.table.page.pageSize).toBe(50);
  fnCrudContext.configure({ commonOptions: () => ({}) });
});

it("FnCrud 深度合并公共与新增表单配置后交给 FnFormDialog，并提供默认提交请求", async () => {
  const title = compute(({ form }) => `公共:${form?.name}`);
  const common = { title, width: 500, dialog: { footer: false, buttons: { cancel: { show: false } } } };
  const specific = { width: 640, dialog: { title: "新增", buttons: { confirm: { text: "创建" } } } };
  const addRequest = vi.fn(async () => undefined);
  const pageRequest = vi.fn(async () => ({ records: [], total: 0 }));
  let exposed!: FnCrudExpose;
  const setup = module.exports.default.setup({
    columns: {},
    form: common,
    addForm: specific,
    request: { pageRequest, addRequest },
  }, { emit: () => {}, expose: (value: FnCrudExpose) => (exposed = value) });
  const open = vi.fn(async (..._args: any[]) => undefined);
  setup.FnFormDialogRef.value = { open };
  pageRequest.mockClear();

  await exposed.form.openAddForm();

  const [options] = open.mock.calls[0];
  expect(options).toMatchObject({ mode: "add", columns: {} });
  expect(options.formOptions).toMatchObject({
    width: 640,
    dialog: { title: "新增", footer: false, buttons: { cancel: { show: false }, confirm: { text: "创建" } } },
  });
  expect(options.formOptions.title).toBe(title);

  const form = { name: "certd" };
  await options.formOptions.onSubmit({ form });
  expect(addRequest).toHaveBeenCalledWith(form);
  expect(pageRequest).toHaveBeenCalledOnce();
});

it("FnCrud 允许表单配置覆盖默认提交请求", async () => {
  const onSubmit = vi.fn(async () => undefined);
  const addRequest = vi.fn(async () => undefined);
  let exposed!: FnCrudExpose;
  const setup = module.exports.default.setup({
    columns: {},
    addForm: { onSubmit },
    request: { pageRequest: vi.fn(async () => ({ records: [], total: 0 })), addRequest },
  }, { emit: () => {}, expose: (value: FnCrudExpose) => (exposed = value) });
  const open = vi.fn(async (..._args: any[]) => undefined);
  setup.FnFormDialogRef.value = { open };

  await exposed.form.openAddForm();

  expect(open.mock.calls[0][0].formOptions.onSubmit).toBe(onSubmit);
  await open.mock.calls[0][0].formOptions.onSubmit({ form: { name: "certd" } });
  expect(onSubmit).toHaveBeenCalledOnce();
  expect(addRequest).not.toHaveBeenCalled();
});

it("table.turnPage 使用当前搜索和排序条件并请求指定分页", async () => {
  const pageRequest = vi.fn(async () => ({ records: [], total: 0 }));
  const onUpdateCurrent = vi.fn();
  let exposed!: FnCrudExpose;
  const setup = module.exports.default.setup({ columns: {}, request: { pageRequest }, pagination: { current: 1, pageSize: 10, "onUpdate:current": onUpdateCurrent } }, { emit: () => {}, expose: (value: FnCrudExpose) => (exposed = value) });
  setup.searchForm.keyword = "cert";
  setup.table.sort.value = { prop: "id", asc: false };

  await exposed.table.turnPage({ current: 3, pageSize: 20 });

  expect(pageRequest).toHaveBeenCalledWith({
    page: { offset: 40, limit: 20 },
    query: { keyword: "cert" },
    sort: { prop: "id", asc: false },
  });
  expect(onUpdateCurrent).toHaveBeenCalledWith(3);
  expect(Object.keys(exposed)).toEqual(["search", "form", "table"]);
});

it("取消排序后 pageRequest 不再接收排序参数", async () => {
  const pageRequest = vi.fn(async () => ({ records: [], total: 0 }));
  const setup = module.exports.default.setup({ columns: {}, request: { pageRequest } }, { emit: () => {}, expose: () => {} });

  setup.table.changeSort({ prop: "", asc: true });
  await vi.waitFor(() => expect(pageRequest).toHaveBeenLastCalledWith({ page: { offset: 0, limit: 10 }, query: {}, sort: undefined }));
});

it("搜索重置当前页时发出 current 更新", () => {
  const onUpdateCurrent = vi.fn();
  const setup = module.exports.default.setup({ columns: {}, request: { pageRequest: vi.fn(async () => ({ records: [], total: 0 })) }, pagination: { current: 3, "onUpdate:current": onUpdateCurrent } }, { emit: () => {}, expose: () => {} });

  setup.table.applySearch();

  expect(onUpdateCurrent).toHaveBeenCalledWith(1);
});

it("FnCrud 维护跨页选择并从 table expose 提供选择操作", () => {
  const rows = [{ id: 12 }, { id: 13 }];
  const onChange = vi.fn();
  let exposed!: FnCrudExpose;
  const state = reactive({ columns: {}, request: { pageRequest: vi.fn() }, rowSelect: { crossPage: true, onChange } }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: (value: FnCrudExpose) => (exposed = value) });
  setup.table.data.value = rows;

  setup.table.changeSelection({ type: "page", selected: true });

  expect(exposed.table.getSelectedRowKeys()).toEqual(["12", "13"]);
  expect(onChange).toHaveBeenCalledWith(["12", "13"]);

  setup.table.data.value = [{ id: 20 }];
  setup.table.syncSelectionForRows(setup.table.data.value);

  expect(exposed.table.getSelectedRowKeys()).toEqual(["12", "13"]);

  setup.table.changeSelection({ type: "row", row: setup.table.data.value[0], index: 0, selected: true });
  expect(exposed.table.getSelectedRowKeys()).toEqual(["12", "13", "20"]);

  setup.table.clearSelectedRowKeys();

  expect(exposed.table.getSelectedRowKeys()).toEqual([]);
});

it("行选择作为 table.columns 的普通 render 列生成", () => {
  const setup = module.exports.default.setup({
    columns: {},
    request: { pageRequest: vi.fn() },
    rowSelect: { type: "multiple", selectedRowKeys: [] },
  }, { emit: () => {}, expose: () => {} });
  const column = setup.table.tableProps.value.columns.__fn_selection_column;
  const rendered = column.cell.render({ type: "row", row: { id: 1 }, form: { id: 1 }, index: 0 });

  expect(column.cell).toMatchObject({ width: 44, resizable: false });
  expect(column.cell.fixed).toBeUndefined();
  expect(rendered.props).toMatchObject({ modelValue: false, "aria-label": "选择第 1 条记录" });
});

it("FnCrud 通过 onChange 将用户选择写回 crudState.rowSelect.selectedRowKeys", () => {
  const onChange = vi.fn();
  const state = reactive({
    columns: {},
    request: { pageRequest: vi.fn() },
    rowSelect: { crossPage: true, selectedRowKeys: ["12"], onChange },
  }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });
  setup.table.data.value = [{ id: 12 }, { id: 13 }];

  setup.table.changeSelection({ type: "row", row: setup.table.data.value[1], index: 1, selected: true });

  expect(state.rowSelect.selectedRowKeys).toEqual(["12", "13"]);
  expect(onChange).toHaveBeenCalledWith(["12", "13"]);
});

it("FnCrud 通过 onChange 清理当前页不存在的选择", () => {
  const onChange = vi.fn();
  const state = reactive({
    columns: {},
    request: { pageRequest: vi.fn() },
    rowSelect: { selectedRowKeys: ["12", "13"], onChange },
  }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });
  setup.table.data.value = [{ id: 12 }];

  setup.table.syncSelectionForRows(setup.table.data.value);

  expect(state.rowSelect.selectedRowKeys).toEqual(["12"]);
  expect(onChange).toHaveBeenCalledWith(["12"]);
});

it("actionbar 批量删除确认后按全部选中 keys 删除、清空选择并刷新", async () => {
  confirmDelete.mockReset().mockResolvedValue(undefined);
  const delRequest = vi.fn(async () => undefined);
  const pageRequest = vi.fn(async () => ({ records: [], total: 0 }));
  const state = reactive({
    columns: {},
    request: { pageRequest, delRequest },
    rowSelect: { crossPage: true, selectedRowKeys: [12, 13] },
  }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });
  setup.table.data.value = [{ id: 12 }];

  expect(setup.actionbarProps.value.buttons.batch.show).toBe(true);
  expect(setup.actionbarProps.value.buttons.batch.items[0].click).toBeUndefined();
  setup.handleActionbarSelect("batch", "delete");

  expect(confirmDelete).toHaveBeenCalledWith(expect.objectContaining({
    title: "确认批量删除",
    body: expect.any(Function),
  }));
  const options = confirmDelete.mock.calls[0][0];
  await options.buttons.confirm.click();

  expect(delRequest.mock.calls).toEqual([["12"], ["13"]]);
  expect(setup.getSelectedRowKeys()).toEqual([]);
  expect(pageRequest).toHaveBeenCalledTimes(1);
});

it("FnCrud 保留带 computed 文案的用户 actionbar 按钮", () => {
  const click = vi.fn();
  const label = ref("禁用数量输入");
  const state = reactive({
    columns: {},
    request: { pageRequest: vi.fn() },
    actionbar: { buttons: { toggleQuantity: { text: computed(() => label.value), order: 10, click } } },
  }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });

  expect(setup.actionbarProps.value.buttons.toggleQuantity).toMatchObject({ text: "禁用数量输入", order: 10, click });
  label.value = "启用数量输入";
  expect(setup.actionbarProps.value.buttons.toggleQuantity.text).toBe("启用数量输入");
});

it("批量选择复用行索引，不重复查找行位置", () => {
  const setup = module.exports.default.setup({ columns: {}, request: { pageRequest: vi.fn() }, rowSelect: {} }, { emit: () => {}, expose: () => {} });
  setup.table.data.value = [{ id: 12 }, { id: 13 }];
  const indexOf = vi.spyOn(setup.table.data.value, "indexOf");

  setup.table.changeSelection({ type: "page", selected: true });

  expect(indexOf).not.toHaveBeenCalled();
});

it("FnCrud 把 rowHandle 组合进 FnTable columns", () => {
  const state = reactive({
    columns: { name: { key: "name", title: "名称" } },
    rowHandle: { width: 180, order: 5, buttons: {} },
    request: { pageRequest: vi.fn() },
  }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });

  expect(setup.table.tableProps.value.columns).toMatchObject({
    name: { key: "name", title: "名称" },
    __fn_blank_column: { key: "__fn_blank_column", title: "", cell: { width: "auto", order: 5, resizable: false } },
    rowHandle: { key: "rowHandle", title: "操作", cell: { width: 180, fixed: "right", order: 5 } },
  });
  expect(Object.keys(setup.table.tableProps.value.columns).indexOf("__fn_blank_column")).toBeLessThan(Object.keys(setup.table.tableProps.value.columns).indexOf("rowHandle"));
  expect(setup.table.tableProps.value).not.toHaveProperty("rowHandle");
  expect(setup.table.tableProps.value).not.toHaveProperty("rowSelect");
  expect(setup.table.tableProps.value).not.toHaveProperty("selectedRowKeys");
  expect(setup.table.columnSettingsColumns.value.map((column: { key: string }) => column.key)).not.toContain("rowHandle");
  expect(setup.table.columnSettingsColumns.value.map((column: { key: string }) => column.key)).not.toContain("__fn_blank_column");
});

it("FnCrud 默认使用 comfort 密度并将工具栏放在搜索栏右侧", () => {
  const setup = module.exports.default.setup({ columns: {}, request: { pageRequest: vi.fn() } }, { emit: () => {}, expose: () => {} });

  expect(setup.table.size.value).toBe(14);
  expect(setup.table.density.value).toBe("comfort");
  expect(setup.layoutProps.value.map((row: any) => row.cols.map((col: any) => col.type))).toEqual([["header"], ["actionbar", "tabs", "search", "toolbar"]]);
  expect(setup.layoutProps.value[1].cols[1].style).toEqual({ flex: 1 });
});

it("FnCrud 将 px 字号与 density 分开传给 FnTable", () => {
  const crudState = reactive({ table: { size: 12, density: "comfort" as "comfort" | "compact" }, columns: {}, request: { pageRequest: vi.fn() } }) as any;
  useFnCrud({ state: crudState as any });
  const setup = module.exports.default.setup(crudState, { emit: () => {}, expose: () => {} });

  expect(setup.table.size.value).toBe(12);
  expect(setup.table.density.value).toBe("comfort");
  crudState.table.density = "compact";
  expect(setup.table.density.value).toBe("compact");
  crudState.table.density = "comfort";
  crudState.onToggleDensity?.();
  expect(setup.table.size.value).toBe(12);
  expect(setup.table.density.value).toBe("compact");
  expect(crudState.table.density).toBe("compact");
});

it("页面加载先读取远程偏好并写回配置源，再用已保存的 pageSize 请求列表", async () => {
  const preferences = {
    columns: { name: { order: 0, show: false, fixed: null, width: 180 } },
    pageSize: 50,
    density: "compact" as const,
  };
  const get = vi.fn(async () => preferences);
  const set = vi.fn(async () => undefined);
  const pageRequest = vi.fn(async () => ({ records: [], total: 0 }));
  let exposed!: FnCrudExpose;
  const crudState = reactive({
    columns: { name: { key: "name", title: "名称", cell: { width: 120 } } },
    request: { pageRequest },
    id: "remote-pref-test",
    preferenceStorage: { get, set },
    table: {},
  }) as any;
  useFnCrud({ state: crudState as any });
  const setup = module.exports.default.setup(crudState, { emit: () => {}, expose: (value: FnCrudExpose) => (exposed = value) });

  await setup.table.initializePreferences();

  expect(get).toHaveBeenCalledWith("fn-crud:remote-pref-test");
  expect(setup.table.page.pageSize).toBe(50);
  expect(setup.table.density.value).toBe("compact");
  expect(crudState.table.density).toBeUndefined();
  expect(crudState.columns.name.cell.width).toBe(120);
  expect(setup.table.tableProps.value.columns.name).toMatchObject({ show: false, cell: { width: 180 } });
  expect(setup.table.columnPreferences.value.name).toMatchObject({ show: false, width: 180 });
  expect(pageRequest).toHaveBeenCalledWith({ page: { offset: 0, limit: 50 }, query: {}, sort: undefined });
  expect(exposed).toBeDefined();
});

it("载入用户列偏好优先覆盖开发者配置，并忽略已删除列", async () => {
  const preferenceStorage = {
    get: vi.fn(async () => ({
      columns: {
        deleted: { order: 0, show: true },
        explicit: { order: 1, show: false },
        locked: { order: 2, show: false, fixed: "left" as const },
        movable: { order: 3, show: false },
      },
      pageSize: 10,
      density: "comfort" as const,
    })),
    set: vi.fn(),
  };
  const state = reactive({
    columns: {
      explicit: { key: "explicit", title: "显式列", show: true, cell: { order: 0 } },
      locked: { key: "locked", title: "禁用列", cell: { order: 1, setting: { disabled: true } } },
      movable: { key: "movable", title: "可设置列", cell: { order: 2 } },
    },
    request: { pageRequest: vi.fn(async () => ({ records: [], total: 0 })) },
    preferenceStorage,
    table: {},
  }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });

  await setup.table.initializePreferences();

  expect(state.columns.explicit.show).toBe(true);
  expect(state.columns.locked.cell).toMatchObject({ order: 1, setting: { disabled: true } });
  expect(state.columns.movable.show).toBeUndefined();
  expect(setup.table.columnPreferences.value).not.toHaveProperty("deleted");
  expect(setup.table.columnPreferences.value.explicit).toMatchObject({ show: false, order: 1 });
  expect(setup.table.columnPreferences.value.locked).toMatchObject({ show: false, fixed: "left", order: 2 });
  expect(setup.table.columnPreferences.value.movable).toMatchObject({ show: false });
  expect(setup.table.tableProps.value.columns.explicit.show).toBe(false);
  expect(setup.table.tableProps.value.columns.movable.show).toBe(false);
});

it("FnCrud 内部保存列设置覆盖并在还原时回到开发者配置", () => {
  const state = reactive({
    columns: {
      name: { key: "name", title: "名称", show: true, cell: { width: 120, order: 0 } },
      status: { key: "status", title: "状态", cell: { width: 90, order: 1 } },
    },
    request: { pageRequest: vi.fn(async () => ({ records: [], total: 0 })) },
    table: {},
  }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });

  setup.table.updateColumnSettings([
    { key: "status", title: "状态", show: false, fixed: "right" },
    { key: "name", title: "名称", show: false },
  ]);
  setup.table.saveColumnWidth({ key: "name", width: 180 });

  expect(state.columns.name).toMatchObject({ show: true, cell: { width: 120, order: 0 } });
  expect(state.columns.status.cell).toMatchObject({ width: 90, order: 1 });
  expect(setup.table.tableProps.value.columns.name.cell.width).toBe(180);
  expect(setup.table.tableProps.value.columns.status).toMatchObject({ show: false, cell: { fixed: "right" } });
  expect(setup.table.columnPreferences.value.name.width).toBe(180);

  setup.table.resetColumnSettings();

  expect(setup.table.columnPreferences.value).toEqual({});
  expect(setup.table.tableProps.value.columns.name.cell.width).toBe(120);
  expect(setup.table.tableProps.value.columns.status).toMatchObject({ cell: { width: 90, order: 1 } });
});

it("载入等同开发者默认值的旧偏好时不保留宽度覆盖", async () => {
  const state = reactive({
    columns: { id: { key: "id", title: "编号", cell: { width: 100, order: 0 } } },
    request: { pageRequest: vi.fn(async () => ({ records: [], total: 0 })) },
    preferenceStorage: {
      get: vi.fn(async () => ({ columns: { id: { order: 0, show: true, fixed: null, width: 100 } }, pageSize: 10, density: "comfort" as const })),
      set: vi.fn(),
    },
    table: {},
  }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });

  await setup.table.initializePreferences();

  expect(setup.table.columnPreferences.value).toEqual({});
  expect(setup.table.tableProps.value.columns.id.cell.width).toBe(100);
});

it("pageSize 和 density 通过偏好覆盖生效，并在用户更新时回调且存储", async () => {
  const set = vi.fn();
  const onUpdatePageSize = vi.fn();
  const onUpdateDensity = vi.fn();
  const state = reactive({
    columns: {},
    request: { pageRequest: vi.fn(async () => ({ records: [], total: 0 })) },
    id: "update-pref-test",
    preferenceStorage: { get: vi.fn(async () => undefined), set },
    pagination: { pageSize: 10, "onUpdate:pageSize": onUpdatePageSize },
    table: { density: "comfort" as const, "onUpdate:density": onUpdateDensity },
  }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });
  setup.table.preferencesLoaded.value = true;
  setup.table.preferencesKey.value = "fn-crud:update-pref-test";

  expect(setup.paginationProps.value.pageSize).toBe(10);
  expect(setup.table.density.value).toBe("comfort");
  setup.table.changeDensity("compact");
  expect(onUpdateDensity).toHaveBeenCalledWith("compact");
  expect(setup.table.density.value).toBe("compact");

  await setup.table.turnPage({ current: 1, pageSize: 25 });
  expect(onUpdatePageSize).toHaveBeenCalledWith(25);
  expect(setup.paginationProps.value.pageSize).toBe(25);
  await Promise.resolve();
  await Promise.resolve();
  expect(set).toHaveBeenCalledWith("fn-crud:update-pref-test", expect.objectContaining({ pageSize: 25, density: "compact" }));
});

it("用户将 pageSize 和 density 改回开发者默认值时仍保存用户偏好", () => {
  const state = reactive({
    columns: {},
    request: { pageRequest: vi.fn(async () => ({ records: [], total: 0 })) },
    pagination: { pageSize: 10 },
    table: { density: "comfort" as const },
  }) as any;
  useFnCrud({ state });
  const setup = module.exports.default.setup(state, { emit: () => {}, expose: () => {} });
  setup.table.preferencesLoaded.value = true;
  setup.table.preferencesKey.value = "fn-crud:reset-pref-test";
  setup.table.changeDensity("compact");
  setup.table.changeDensity("comfort");

  expect(setup.table.densityPreference.value).toBe("comfort");
  setup.table.changePage(1, 25);
  setup.table.changePage(1, 10);
  expect(setup.table.pageSizePreference.value).toBe(10);
});
