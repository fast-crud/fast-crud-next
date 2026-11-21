import type { FnDynamic, FnFormColumn, FnSlots } from "../../types/index";
import type { FnDialogProps } from "../overlay/types";

export interface FnFormInstance<Form = Record<string, any>> {
  save: () => Promise<any>;
  reset: () => Promise<Form>;
  getForm: () => Form;
  getContext: () => FnFormContext<Form>;
  validate: () => Promise<boolean>;
}

export interface FnFormDialogInstance<Form = Record<string, any>> {
  open: (options: FnFormDialogOptions<Form>) => Promise<FnFormContext<Form>>;
  close: () => void;
  reset: () => Promise<void>;
  cancel: () => Promise<void>;
  submit: () => Promise<void>;
  getFormData: () => Form | undefined;
}

export interface FnFormContext<Form = Record<string, any>> {
  type: "form";
  form?: Form;
  formRef?: FnFormContextRef;
  mode?: string;
  columns?: Record<string, FnDynamic<FnFormColumn>>;
  validate?: () => Promise<boolean>;
  reset?: () => void | Promise<void>;
  submit?: () => Promise<void>;
  close?: () => void;
  fullscreen?: import("vue").Ref<boolean>;
}

export interface FnFormContextRef {
  validate: () => Promise<boolean>;
  clearValidate?: () => void;
}

export interface FnFormProps<Form = Record<string, any>> {
  dialog?: Omit<FnDialogProps<Form>, "body">;
  width?: number | string;
  draggable?: boolean;
  columns?: Record<string, FnFormColumn>;
  mode?: string;
  initialForm?: Form;
  labelCol?: Record<string, any>;
  wrapperCol?: Record<string, any>;
  formProps?: Record<string, any>;
  onSubmit?: (ctx: FnFormContext<Form>) => any | Promise<any>;
  onReset?: (ctx: FnFormContext<Form>) => any | Promise<any>;
  slots?: FnSlots;
}

export type FnFormDialogOptions<Form = Record<string, any>> = Omit<FnFormProps<Form>, "columns"> & {
  columns: Record<string, FnDynamic<FnFormColumn>>;
};

