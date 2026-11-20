import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse, compileScript } from "@vue/compiler-sfc";
import ts from "typescript";
import { expect, it, vi } from "vitest";
import { compute, resolveComputedValue } from "../use/compute";

const filename = fileURLToPath(new URL("./fn-form-dialog.vue", import.meta.url));
const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
const script = compileScript(descriptor, { id: "fn-form-dialog-test", fs: { fileExists: existsSync, readFile: path => readFileSync(path, "utf8") } });
const compiled = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const require = createRequire(import.meta.url);
const module = { exports: {} as any };
const loadDependency = (name: string) => {
  if (name === "../modal/fn-modal.vue" || name === "./fn-form.vue") return {};
  if (name === "../use/compute") return { resolveComputedValue };
  if (name === "../use/use-fn-ui-services") return { useFnUiServices: () => ({ notification: { error: vi.fn() }, message: { error: vi.fn() } }) };
  return require(name);
};
new Function("require", "module", "exports", compiled.outputText)(loadDependency, module, module.exports);

it("将包装了 formDialog context 的 dialog.slots 传给 FnModal", () => {
  expect(descriptor.template?.content).toContain('v-bind="resolvedForm?.dialog"');
  expect(descriptor.template?.content).toContain(':slots="dialogSlots"');
  expect(descriptor.template?.content).not.toContain("#[name]");
  expect(script.content).toContain("() => render(getFormContext())");
});

it("插槽包装调用时读取最新 formDialog context", () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  const render = vi.fn();
  const form = { name: "record" };
  setup.open({ columns: {}, dialog: { slots: { headerRight: render } } });
  setup.formRef.value = {
    getForm: () => form,
    validate: async () => true,
    reset: () => form,
  };

  setup.dialogSlots.value.headerRight();

  expect(render).toHaveBeenCalledWith(expect.objectContaining({
    form,
    dialog: expect.objectContaining({ close: expect.any(Function), confirm: expect.any(Function) }),
    submit: expect.any(Function),
    close: expect.any(Function),
  }));
});

it("动态表单配置使用 formDialog context，并保留取消回调", async () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  const form = { kind: "user" };
  const cancel = vi.fn();
  setup.open({
    mode: "edit",
    initialForm: form,
    columns: {
      kind: compute(({ form: values, dialog, type }) => ({
        component: {
          name: `${type}-${values?.kind}-${dialog?.open.value ? "open" : "closed"}`,
        },
      })),
    },
    dialog: { buttons: { cancel: { click: cancel } } },
  });
  setup.formRef.value = {
    getContext: () => ({ type: "form", form, mode: "edit", columns: {} }),
    getForm: () => form,
    validate: async () => true,
    reset: () => form,
  };

  expect(setup.resolvedForm.value.columns.kind.component.name).toBe("form-user-closed");
  await setup.cancelForm();
  expect(cancel).toHaveBeenCalledOnce();
});

it("弹窗 ref 创建前调用 close 会结束当前表单流程", async () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  const result = setup.open({ columns: {} });

  setup.close();

  await expect(result).resolves.toBeUndefined();
});

it("在 FnFormDialog context 中计算合并后的动态表单选项", async () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  const result = setup.open({
    columns: {},
    mode: "edit",
    initialForm: { name: "certd" },
    title: compute(({ form, mode }) => `${mode}:${form?.name}`),
  });

  expect(setup.resolvedForm.value.title).toBe("edit:certd");
  expect(setup.resolvedForm.value.dialog.title).toBe("edit:certd");
  setup.close();
  await expect(result).resolves.toBeUndefined();
});

it("提交时执行动态解析后的 onSubmit 回调", async () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  const submit = vi.fn();
  const form = { name: "new-service" };
  setup.open({ columns: {}, onSubmit: submit });
  setup.formRef.value = {
    save: async () => form,
    getContext: () => ({ type: "form", form, columns: {} }),
    getForm: () => form,
    validate: async () => true,
    reset: () => form,
  };

  await setup.submitForm();

  expect(submit).toHaveBeenCalledOnce();
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ form }));
});

it("动态表单配置只依赖公开的表单数据接口", () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  const form = { name: "certd" };

  setup.open({
    columns: {
      name: compute(({ form: values }) => ({ title: values?.name })),
    },
    title: compute(({ form: values }) => values?.name),
  });
  setup.formRef.value = {
    getForm: () => form,
    validate: async () => true,
    reset: () => form,
  };

  expect(setup.resolvedForm.value.title).toBe("certd");
  expect(setup.resolvedForm.value.columns.name.title).toBe("certd");
});

it("表单弹窗默认显示页脚按钮，并允许单独隐藏配置按钮", () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  setup.open({ columns: {}, dialog: { buttons: { cancel: { show: false } } } });

  expect(descriptor.template?.content).toContain(':footer="resolvedForm?.dialog?.footer ?? true"');
  expect(setup.dialogButtons.value.reset.show).toBe(true);
  expect(setup.dialogButtons.value.cancel.show).toBe(false);
  expect(setup.dialogButtons.value.confirm.show).toBe(true);
});
