import { expect, it, vi } from "vitest";
import { useCompute } from "../../crud/use/use-compute";
import { useMerge } from "./use-merge";
import { DictStore } from "../../crud/dict/dict";
import { reactive, ref } from "vue";
import { useFnCrud } from "../../crud/use/use-fn-crud";

const { compute, resolveComputedValue } = useCompute();
const { merge } = useMerge();

it("merge 支持多级来源并保留最后一个 state 来源的用户值", () => {
  const state = {
    table: { size: 12 },
    columns: { local: { key: "local", title: "本地列" } },
  };

  const result = merge(
    state,
    { table: { size: 14, density: "comfort" }, columns: { default: { key: "default" } } },
    { table: { size: 20 } },
    state,
  );

  expect(result).toBe(state);
  expect(state.table).toEqual({ size: 12, density: "comfort" });
  expect(state.columns).toEqual({ local: { key: "local", title: "本地列" }, default: { key: "default" } });
});

it("DictStore 保留引用，静态配置整体覆盖 compute 且不修改来源", () => {
  const dict = new DictStore({ data: [], immediate: false });
  const dynamic = compute(() => ({ value: 1 }));
  const result = merge({}, { cell: { dict, dynamic } }, { cell: { dict: { extra: true }, dynamic: { extra: true } } });

  expect(result.cell.dict).toBe(dict);
  expect(result.cell.dynamic).toEqual({ extra: true });
  expect(Object.keys(dynamic)).toEqual(["__fnCompute", "computeFn"]);
  expect(merge({}, { cell: { dynamic } }).cell.dynamic).toBe(dynamic);
});

it("组件定义保持原引用，后一个定义整体覆盖前一个组件", () => {
  const first = { setup() {}, props: { first: String } };
  const next = { render() {} };
  const result = merge({}, { component: { name: first, clearable: true } }, { component: { name: next } });
  expect(result.component.name).toBe(next);
  expect(result.component.clearable).toBe(true);
  expect(next).not.toHaveProperty("props");
});

it("深度合并时保留叶子 compute，并让后一个来源覆盖动态值", () => {
  const commonTitle = compute(({ form }) => `公共:${form?.name}`);
  const localTitle = compute(({ form }) => `局部:${form?.name}`);
  const result = merge(
    {},
    { dialog: { title: commonTitle, footer: false, buttons: { cancel: { show: false } } } },
    { dialog: { title: localTitle, buttons: { confirm: { text: "创建" } } } }
  );

  expect(result.dialog.footer).toBe(false);
  expect(result.dialog.buttons).toEqual({ cancel: { show: false }, confirm: { text: "创建" } });
  expect(result.dialog.title).toBe(localTitle);
  expect(resolveComputedValue(result, { type: "form", form: { name: "certd" } }).dialog.title).toBe("局部:certd");
});

it("merge 仍然覆盖数组且保留用户函数", () => {
  const callback = vi.fn();
  const result = merge({}, { list: ["default"], callback }, { list: ["local"] });

  expect(result.list).toEqual(["local"]);
  expect(result.callback).toBe(callback);
});

it("useFnCrud 通过 crudRef 调用新增表单 expose", () => {
  const openAddForm = vi.fn();
  const state = reactive({ columns: {}, request: { pageRequest: vi.fn() } }) as any;
  useFnCrud({ state, crudRef: ref({ form: { openAddForm } } as any) });

  state.actionbar.buttons.add.click();

  expect(openAddForm).toHaveBeenCalledOnce();
});
