import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse, compileScript } from "@vue/compiler-sfc";
import ts from "typescript";
import { expect, it, vi } from "vitest";
import { useCompute } from "../use/use-compute";
import { useMerge } from "../../components/use/use-merge";

const { compute } = useCompute();

const filename = fileURLToPath(new URL("./fn-form-dialog.vue", import.meta.url));
const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
const script = compileScript(descriptor, { id: "fn-form-dialog-test", fs: { fileExists: existsSync, readFile: path => readFileSync(path, "utf8") } });
const compiled = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const require = createRequire(import.meta.url);
const module = { exports: {} as any };
const loadDependency = (name: string) => {
  if (name === "../../components/overlay/fn-modal.vue" || name === "../../components/form/fn-form.vue") return {};
  if (name === "../use/use-compute") return { useCompute };
  if (name === "../../components/use/use-merge") return { useMerge };
  if (name === "../../components/use/use-fn-ui-services") return { useFnUiServices: () => ({ notification: { error: vi.fn() }, message: { error: vi.fn() } }) };
  return require(name);
};
new Function("require", "module", "exports", compiled.outputText)(loadDependency, module, module.exports);

it("将 form dialog props 分别传给 FnModal 和 FnForm", () => {
  expect(descriptor.template?.content).toContain('v-bind="computedModalProps"');
  expect(descriptor.template?.content).toContain('v-bind="computedFormProps"');
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

  setup.computedModalProps.value.slots.headerRight();

  expect(render).toHaveBeenCalledWith(expect.objectContaining({
    form,
    fullscreen: undefined,
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
      kind: compute(({ form: values, type }) => ({
        component: {
          name: `${type}-${values?.kind}`,
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

  expect(setup.computedFormDialogProps.value.columns.kind.component.name).toBe("form-user");
  await setup.computedModalProps.value.buttons.cancel.click();
  expect(cancel).toHaveBeenCalledOnce();
});

it("等待 FnForm 挂载后返回 FnFormContext", async () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  const context = await setup.open({ columns: {}, initialForm: { name: "record" } });

  expect(context).toEqual(expect.objectContaining({ type: "form", form: { name: "record" } }));
  expect(context.close).toEqual(expect.any(Function));
});

it("在 FnFormDialog context 中计算合并后的动态表单选项", () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  setup.open({
    columns: {},
    mode: "edit",
    initialForm: { name: "certd" },
    dialog: { title: compute(({ form, mode }) => `${mode}:${form?.name}`) },
  });

  expect(setup.computedFormDialogProps.value.dialog.title).toBe("edit:certd");
});

it("将顶层尺寸配置应用到 Modal，并让 dialog 配置优先", () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  setup.open({ columns: {}, width: 720, draggable: false, dialog: { width: 840, draggable: true } });

  expect(setup.computedModalProps.value.width).toBe(840);
  expect(setup.computedModalProps.value.draggable).toBe(true);
});

it("提交时执行动态解析后的 onSubmit 回调", async () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  const submit = vi.fn();
  const form = { name: "new-service" };
  const contextPromise = setup.open({ columns: {}, onSubmit: submit });
  setup.formRef.value = {
    save: async () => {
      await setup.computedFormProps.value.onSubmit({ type: "form", form });
      return form;
    },
    getContext: () => ({ type: "form", form, columns: {} }),
    getForm: () => form,
    validate: async () => true,
    reset: () => form,
  };
  const context = await contextPromise;

  await setup.submit();

  expect(submit).toHaveBeenCalledOnce();
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ form }));
  expect(context.form).toBe(form);
});

it("重置时执行合并并解析后的 onReset 回调", async () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  const onReset = vi.fn();
  const form = { name: "initial" };
  setup.open({
    columns: {},
    initialForm: form,
    onReset: compute(({ form: values }) => () => onReset(values)),
  });
  setup.formRef.value = {
    getForm: () => form,
    reset: vi.fn(),
    validate: async () => true,
  };

  setup.computedFormProps.value.onReset({ type: "form", form });

  expect(onReset).toHaveBeenCalledWith(form);
});

it("动态表单配置只依赖公开的表单数据接口", () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  const form = { name: "certd" };

  setup.open({
    columns: {
      name: compute(({ form: values }) => ({ title: values?.name })),
    },
    dialog: { title: compute(({ form: values }) => values?.name) },
  });
  setup.formRef.value = {
    getForm: () => form,
    validate: async () => true,
    reset: () => form,
  };

  expect(setup.computedFormDialogProps.value.dialog.title).toBe("certd");
  expect(setup.computedFormDialogProps.value.columns.name.title).toBe("certd");
});

it("表单弹窗默认显示页脚按钮，并允许单独隐藏配置按钮", () => {
  const setup = module.exports.default.setup({}, { expose: () => {} });
  setup.open({ columns: {}, dialog: { buttons: { cancel: { show: false } } } });

  expect(setup.computedModalProps.value.buttons.reset.show).toBe(true);
  expect(setup.computedModalProps.value.buttons.cancel.show).toBe(false);
  expect(setup.computedModalProps.value.buttons.confirm.show).toBe(true);
});
