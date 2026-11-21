import { computed, reactive, ref } from "vue";
import { expect, it, vi } from "vitest";
import { addTypes } from ".";
import type { FnCrudOptions } from "../types";
import { compute, resolveComputedValue } from "../use/use-compute";
import { useResolvedColumns } from "../use/use-crud-props";
import { installFnCrud, useFnCrud } from "../use/use-fn-crud";

it("两个注册入口按注册顺序整体覆盖类型，类型数组允许字段局部覆盖", () => {
  addTypes({ testLayout: { form: { span: 12, value: "old" }, cell: { width: 80 } } });
  installFnCrud({ columnTypes: { testLayout: () => ({ form: { span: 24 } }) } });
  installFnCrud({});
  const disabled = compute(({ form }) => form?.locked);
  const props = reactive<Pick<FnCrudOptions, "columns">>({
    columns: {
      note: {
        key: "note",
        title: "备注",
        type: ["textarea", "testLayout"],
        form: { span: 18, component: { disabled } },
      },
    },
  });
  const columns = useResolvedColumns(props);
  const form = resolveComputedValue(columns.value.note.form, { type: "form", form: { locked: true } });
  expect(form).toMatchObject({ span: 18, component: { multiline: true, disabled: true } });
  expect(form).not.toHaveProperty("value");
  expect(columns.value.note.cell).toBeUndefined();

  addTypes({ testLayout: { cell: { width: 100 } } });
  expect(columns.value.note.cell).toEqual({ width: 100 });
});

it("全局与本地同名字段合并后保留 computed 类型", () => {
  installFnCrud({ commonOptions: () => ({ columns: { name: { key: "name", title: "名称", type: "text", cell: { width: 95 } } } }) });
  try {
    const numeric = ref(true);
    const state = reactive<FnCrudOptions>({
      columns: { name: { key: "name", title: "名称", type: computed(() => numeric.value ? "number" : "password") } },
      request: { pageRequest: vi.fn() },
    });
    useFnCrud({ state });
    const columns = useResolvedColumns(state);
    expect(columns.value.name.form).toMatchObject({ component: { type: "number" } });
    numeric.value = false;
    expect(columns.value.name.form).toMatchObject({ component: { type: "password" } });
    expect(columns.value.name.cell).toEqual({ width: 95 });
  } finally {
    installFnCrud({});
  }
});

it("后一个类型覆盖同一属性，未知类型不影响其余配置", () => {
  addTypes({ testHalf: { form: { span: 12 } } });
  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  try {
    const props: Pick<FnCrudOptions, "columns"> = {
      columns: { note: { key: "note", title: "备注", type: ["colspan", "unknown-type", "testHalf"] } },
    };
    expect(useResolvedColumns(props).value.note.form).toEqual({ span: 12 });
    expect(warn).toHaveBeenCalledWith("[FnCrud] 未知字段类型", { key: "note", type: "unknown-type" });
  } finally {
    warn.mockRestore();
  }
});
