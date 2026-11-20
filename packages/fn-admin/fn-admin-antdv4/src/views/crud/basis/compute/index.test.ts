import { beforeEach, expect, it, vi } from "vitest";
import { computed, createSSRApp, reactive } from "vue";
import { renderToString } from "vue/server-renderer";
import { resolveComputedValue, type FnCrudOptions, type FnTableColumn } from "@fast-crud/fast-crud-next";
import ComputeView from "./index.vue";

let options: Pick<FnCrudOptions, "columns" | "actionbar">;
vi.mock("@fast-crud/fast-crud-next", async importOriginal => {
  const actual = await importOriginal<typeof import("@fast-crud/fast-crud-next")>();
  return {
    ...actual,
    FnCrud: {
      props: ["columns", "actionbar"],
      setup(props: typeof options) {
        options = props;
        return () => null;
      },
    },
  };
});

beforeEach(async () => {
  await renderToString(createSSRApp(ComputeView));
});

it("表格开关使用 vModel 配置，单价输入按本行状态禁用", () => {
  const first = reactive({ customPrice: false, unitPrice: 680 });
  const second = reactive({ customPrice: true, unitPrice: 120 });
  const cell = (field: string, row: typeof first) => resolveComputedValue(options.columns[field].cell, { type: "row", row }) as FnTableColumn;
  const firstPrice = computed(() => cell("unitPrice", first));
  const secondPrice = computed(() => cell("unitPrice", second));

  expect(options.columns.customPrice.cell).toMatchObject({ component: { name: expect.anything() } });
  expect(options.columns.customPrice.cell.component).not.toHaveProperty("computeFn");
  expect(firstPrice.value).toMatchObject({ component: { disabled: true } });
  first.customPrice = true;
  expect(firstPrice.value).toMatchObject({ component: { disabled: false } });
  first.customPrice = false;
  expect(firstPrice.value).toMatchObject({ component: { disabled: true } });
  expect(secondPrice.value).toMatchObject({ component: { disabled: false } });
});

it("操作栏按钮通过外部状态禁用并重新启用数量输入", () => {
  const quantity = options.columns.quantity.cell as FnTableColumn;
  const toggle = options.actionbar?.buttons.toggleQuantity?.click;

  expect(quantity).toMatchObject({ component: { disabled: false } });
  toggle?.({ type: "row" });
  expect(quantity).toMatchObject({ component: { disabled: true } });
  toggle?.({ type: "row" });
  expect(quantity).toMatchObject({ component: { disabled: false } });
});

it("表单开关实时控制单价字段显隐并保留原值", () => {
  const form = reactive({ customPrice: false, unitPrice: 680 });
  const unitPrice = computed(() => resolveComputedValue(options.columns.unitPrice.form, { type: "form", form }));

  expect(unitPrice.value).toMatchObject({ show: false });
  form.customPrice = true;
  expect(unitPrice.value).toMatchObject({ show: true });
  form.customPrice = false;
  expect(unitPrice.value).toMatchObject({ show: false });
  expect(form.unitPrice).toBe(680);
});
