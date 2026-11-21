<template>
  <div class="fn-form-dialog">
    <FnModal
      v-if="activeFormDialogProps"
      ref="modalRef"
      v-model:open="modalOpen"
      v-bind="computedModalProps"
      @closed="finishForm"
    >
      <FnForm ref="formRef" v-bind="computedFormProps" />
    </FnModal>
  </div>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref, useSlots } from "vue";
import FnModal from "../modal/fn-modal.vue";
import type { FnFormContext, FnFormDialogInstance, FnFormDialogOptions, FnFormInstance, FnFormProps, FnModalInstance, FnRenderSlot } from "../types/index";
import { resolveComputedValue } from "../use/compute";
import { useFnUiServices } from "../use/use-fn-ui-services";
import { useMerge } from "../use/use-merge";
import FnForm from "./fn-form.vue";

const { notification } = useFnUiServices();
const { merge } = useMerge();
const formRef = ref<FnFormInstance>();
const modalRef = ref<FnModalInstance>();
const formLoading = ref(false);
const modalOpen = ref(false);

const emit = defineEmits<{
  reset: [context: FnFormContext];
  cancel: [context: FnFormContext];
  confirm: [context: FnFormContext];
}>();

const defaultFormDialogProps: FnFormProps = {
  dialog: {
    title: "编辑",
    width: 900,
    draggable: true,
    buttons: {
      reset: { show: true, text: "重置", click: reset },
      cancel: { show: true, text: "取消", click: cancel },
      confirm: { show: true, type: "primary", text: "确认", click: submit },
    },
  },
};

const activeFormDialogProps = ref<FnFormDialogOptions>();

const vueSlots = getCurrentInstance() ? useSlots() : {};

const formContext = computed<FnFormContext>(() => {
  return {
    type: "form",
    form: formRef.value?.getForm() || activeFormDialogProps.value?.initialForm || {},
    formRef: formRef.value,
    mode: activeFormDialogProps.value?.mode,
    columns: activeFormDialogProps.value?.columns,
    validate: () => formRef.value?.validate() || Promise.resolve(false),
    reset: async () => {
      await formRef.value?.reset();
    },
    submit: submit,
    close: close,
    fullscreen: modalRef.value?.fullscreen,
  };
});

const computedFormDialogProps = computed(() => {
  const dialogDefaults = {
    dialog: {
      width: activeFormDialogProps.value?.width,
      draggable: activeFormDialogProps.value?.draggable,
    },
  };
  const merged = merge({}, defaultFormDialogProps, dialogDefaults, activeFormDialogProps.value || {});
  return resolveComputedValue(merged, formContext.value) as FnFormProps;
});

const computedFormProps = computed(() => {
  const { dialog: _dialog, ...formProps } = computedFormDialogProps.value;
  return formProps;
});
const computedModalProps = computed(() => {
  const dialog: NonNullable<FnFormProps["dialog"]> = computedFormDialogProps.value.dialog ?? defaultFormDialogProps.dialog!;
  const buttons = Object.fromEntries(
    Object.entries(dialog.buttons || {}).map(([key, button]) => [
      key,
      {
        ...button,
        click: button.click ? () => button.click?.(getFormContext()) : undefined,
        items: button.items?.map(item => ({ ...item, click: () => item.click?.(getFormContext()) })),
      },
    ])
  );
  const slots: Record<string, FnRenderSlot> = {};
  for (const [name, render] of Object.entries(dialog.slots || {})) {
    if (render) slots[name] = () => render(getFormContext());
  }
  return {
    ...dialog,
    confirmLoading: formLoading.value,
    buttons,
    slots: { ...slots, ...vueSlots },
  };
});

function getFormContext(): FnFormContext {
  return formContext.value;
}

async function open(options: FnFormDialogOptions): Promise<FnFormContext> {
  activeFormDialogProps.value = options;
  modalOpen.value = true;
  await nextTick();
  return getFormContext();
}

async function reset(): Promise<void> {
  await formRef.value?.reset();
  emit("reset", getFormContext());
}
async function cancel(): Promise<void> {
  close();
  emit("cancel", getFormContext());
}
function close(): void {
  modalOpen.value = false;
  if (!modalRef.value) {
    finishForm();
  }
}
async function submit(): Promise<void> {
  if (formLoading.value) {
    return;
  }
  formLoading.value = true;
  try {
    await formRef.value?.save();
    emit("confirm", getFormContext());
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
function finishForm(): void {
  activeFormDialogProps.value = undefined;
}
function getFormData(): Record<string, any> | undefined {
  return formRef.value?.getForm();
}
defineExpose({ open, close, reset, cancel, submit, getFormData } satisfies FnFormDialogInstance);
</script>
<style lang="less">
.fn-form-dialog {
  display: contents;
}
</style>
