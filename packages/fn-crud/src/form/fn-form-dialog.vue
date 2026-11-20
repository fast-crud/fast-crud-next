<template>
  <div class="fn-form-dialog">
    <FnModal
      v-if="activeForm"
      ref="modalRef"
      v-model:open="modalOpen"
      v-bind="resolvedForm?.dialog"
      :slots="dialogSlots"
      :footer="resolvedForm?.dialog?.footer ?? true"
      :buttons="dialogButtons"
      :confirm-loading="formLoading"
      @confirm="submitForm"
      @reset="resetForm"
      @after-close="finishForm"
    >
      <FnForm ref="formRef" v-bind="resolvedForm" :on-submit="undefined" :on-reset="undefined" />
    </FnModal>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import { useFnUiServices } from "../use/use-fn-ui-services";
import { resolveComputedValue } from "../use/compute";
import FnModal from "../modal/fn-modal.vue";
import FnForm from "./fn-form.vue";
import type { FnFormProps, FnFormDialogOptions, FnFormInstance, FnFormContext, FnModalInstance, FnFormDialogInstance, FnDialogContext } from "../types/index";
const activeForm = ref<FnFormDialogOptions>();
const { notification } = useFnUiServices();
const formRef = ref<FnFormInstance>();
const modalRef = ref<FnModalInstance>();
const formLoading = ref(false);
const modalOpen = ref(false);
let resolveForm: ((form: Record<string, any> | undefined) => void) | undefined;
let formResult: Record<string, any> | undefined;
const formContext = computed<FnFormContext>(() => {
  return {
    type: "form",
    form: formRef.value?.getForm() || activeForm.value?.initialForm || {},
    formRef: formRef.value,
    mode: activeForm.value?.mode,
    columns: activeForm.value?.columns,
    validate: () => formRef.value?.validate() || Promise.resolve(false),
    reset: () => {
      formRef.value?.reset();
    },
    dialog: getDialogContext(),
    submit: submitForm,
    close: close,
  };
});
const resolvedForm = computed(() => {
  if (!activeForm.value) {
    return undefined;
  }
  const formOptions = activeForm.value;
  const dialog = {
    title: formOptions.title || "",
    width: formOptions.width,
    draggable: formOptions.draggable,
    ...formOptions.dialog,
  };
  return resolveComputedValue({
    ...formOptions,
    dialog,
  }, formContext.value) as FnFormProps;
});
const dialogSlots = computed(() =>
  Object.fromEntries(
    Object.entries(resolvedForm.value?.dialog?.slots ?? {}).map(([name, render]) => [name, () => render(getFormContext())])
  )
);
const dialogButtons = computed(() => ({
  reset: { show: true, ...resolvedForm.value?.dialog?.buttons?.reset, items: bindDialogButtonItems("reset"), click: resetForm },
  cancel: { show: true, ...resolvedForm.value?.dialog?.buttons?.cancel, items: bindDialogButtonItems("cancel"), click: cancelForm },
  confirm: { show: true, ...resolvedForm.value?.dialog?.buttons?.confirm, items: bindDialogButtonItems("confirm"), loading: formLoading.value, click: submitForm },
}));
function bindDialogButtonItems(key: "reset" | "cancel" | "confirm") {
  return resolvedForm.value?.dialog?.buttons?.[key]?.items?.map(item => ({
    ...item,
    click: () => item.click?.(getFormContext()),
  }));
}
function getFormContext(): FnFormContext {
  return formContext.value;
}
function getDialogContext(): FnDialogContext {
  return {
    close,
    confirm: () => {
      void submitForm();
    },
    open: modalOpen,
    loading: formLoading,
  };
}
function open(options: FnFormDialogOptions): Promise<Record<string, any> | undefined> {
  return openForm(options);
}
function openForm(options: FnFormDialogOptions): Promise<Record<string, any> | undefined> {
  if (resolveForm) {
    resolveForm(undefined);
    resolveForm = undefined;
  }
  activeForm.value = options;
  formResult = undefined;
  const result = new Promise<Record<string, any> | undefined>(resolve => {
    resolveForm = resolve;
  });
  void nextTick(() => {
    modalOpen.value = true;
  });
  return result;
}
async function resetForm(): Promise<void> {
  formRef.value?.reset();
  const ctx = getFormContext();
  const button = resolvedForm.value?.dialog?.buttons?.reset;
  const callback = button?.click;
  await callback?.(ctx);
  await activeForm.value?.onReset?.(ctx);
}
async function cancelForm(): Promise<void> {
  const button = resolvedForm.value?.dialog?.buttons?.cancel;
  const callback = button?.click;
  await callback?.(getFormContext());
  close();
}
function close(): void {
  modalOpen.value = false;
  if (!modalRef.value) {
    finishForm();
  }
}
async function submitForm(): Promise<void> {
  if (formLoading.value) {
    return;
  }
  formLoading.value = true;
  try {
    await formRef.value?.save();
    const ctx = getFormContext();
    await resolvedForm.value?.onSubmit?.(ctx);
    const button = resolvedForm.value?.dialog?.buttons?.confirm;
    const callback = button?.click;
    await callback?.(ctx);
    formResult = ctx.form;
    close();
  } catch (error) {
    const validationError = typeof error === "object" && error !== null && "errorFields" in error;
    if (!validationError) {
      notification.error({ message: "提交失败", description: String(error) });
    }
  } finally {
    formLoading.value = false;
  }
}
onBeforeUnmount(() => {
  resolveForm?.(undefined);
});
function finishForm(): void {
  resolveForm?.(formResult);
  resolveForm = undefined;
  activeForm.value = undefined;
}
function getFormData(): Record<string, any> | undefined {
  return formRef.value?.getForm();
}
defineExpose({ open, close, getFormData } satisfies FnFormDialogInstance);
</script>
<style lang="less">
.fn-form-dialog {
  display: contents;
}
</style>
