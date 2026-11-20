import type { Component, ComputedRef, CSSProperties, Ref, VNodeChild } from "vue";

export type FnDynamic<T> = T | FnComputeValue<T>;
export type FnRefable<T> = T | Ref<T> | ComputedRef<T>;
export type FnDynamicType<T> = {
  [P in keyof T]: FnRefable<T[P]>;
};
export type FnTableRow = Record<string, any>;
export type FnTableRowSelectionChange<Row = FnTableRow> = { type: "row"; row: Row; index: number; selected: boolean } | { type: "page"; selected: boolean };

export type DictValue = string | number | boolean;
export type DictComponentType = "select" | "checkbox" | "radio" | "switch";
export interface DictOption {
  label: string;
  value: string;
  color?: string;
  icon?: string;
  count?: number;
  show?: boolean;
}
export type DictOptionsRef = Ref<DictOption[]>;
export type GetDictOptionsRef = () => DictOptionsRef;

export interface FnDictStore {
  __options: DictOptionsRef;
  value?: string;
  label?: string | ((row: FnTableRow) => string);
  getData?: () => Promise<DictOption[]>;
  getNodesByValues?: (values: Array<string | number>) => Promise<FnTableRow[]>;
  fetching: boolean;
  getOptions: () => DictOptionsRef;
  __fetch: () => Promise<void>;
}
export interface FnFormInstance<Form = Record<string, any>> {
  save: () => Promise<any>;
  reset: () => Form;
  getForm: () => Form;
  getContext: () => FnFormContext<Form>;
  validate: () => Promise<boolean>;
}

export interface FnFormDialogInstance<Form = Record<string, any>> {
  open: (options: FnFormDialogOptions<Form>, computeOptions?: FnComputeValue<Partial<Omit<FnFormDialogOptions<Form>, "columns">>>) => Promise<Form | undefined>;
  close: () => void;
  getFormData: () => Form | undefined;
}

export interface FnIconProps {
  icon: Component;
  size?: number;
}

export interface FnSearchColumnResolved extends FnSearchColumn {
  key: string;
}

export interface FnModalService {
  openDialog<Result = unknown>(Props: FnDialogProps<any>): Promise<Result | undefined>;
}
export interface FnModalProps {
  open?: boolean;
  title?: string;
  width?: number | string;
  draggable?: boolean;
  confirmLoading?: boolean;
  buttons?: Partial<Record<"reset" | "cancel" | "confirm", FnButtonProps<void>>>;
  footer?: boolean | null;
  slots?: FnSlots;
}
export interface FnModalInstance {
  state: { open: ComputedRef<boolean>; fullscreen: Ref<boolean> };
  openModal: () => void;
  close: () => void;
  setFullscreen: (value: boolean) => void;
}
export type FnRenderSlot = (ctx?: Record<string, any>) => VNodeChild;
export type FnSlots = Partial<Record<string, FnRenderSlot>>;
export interface FnDialogRecord {
  id: number;
  open: boolean;
  loading: boolean;
  Props: FnDialogProps<any>;
  resolve: (value: any) => void;
  result?: any;
}

export interface FnFormContext<Form = Record<string, any>> {
  type: "form";
  form?: Form;
  formRef?: FnFormContextRef;
  mode?: string;
  columns?: Record<string, FnDynamic<FnFormColumn>>;
  validate?: () => Promise<boolean>;
  reset?: () => void;
  dialog?: FnDialogContext<Form>;
  submit?: () => Promise<void>;
  close?: () => void;
}

export interface FnFormContextRef {
  validate: () => Promise<boolean>;
  clearValidate?: () => void;
}

export interface FnRowContext<Row = FnTableRow> {
  type: "row";
  row: Row;
  form: Row;
  index: number;
  getComponentRef?: (key?: string) => unknown;
}

export interface FnSearchContext<Form = Record<string, any>> {
  type: "search";
  form: Form;
  columns: Record<string, FnDynamic<FnSearchColumn>>;
  reset: () => void;
  search: () => void;
}

export interface FnComputeContext<Row = any, Form = Record<string, any>, SearchForm = Record<string, any>> {
  type: "row" | "search" | "form";
  row?: Row;
  index?: number;
  getComponentRef?: (key?: string) => unknown;
  form?: Row | Form | SearchForm;
  formRef?: FnFormContextRef;
  mode?: string;
  validate?: () => Promise<boolean>;
  reset?: () => void;
  columns?: Record<string, any>;
  dialog?: FnDialogContext<Form>;
  submit?: () => Promise<void>;
  close?: () => void;
}

export interface FnCrudSearchState {
  form: Record<string, any>;
  search: () => void;
}

export interface FnComputeValue<T = any> {
  readonly __fnCompute: true;
  readonly computeFn: (context: FnComputeContext) => T;
}

export type FnDialogContext<Form = Record<string, any>> = {
  close: () => void;
  confirm: () => void;
  loading: Ref<boolean>;
  open: Ref<boolean>;
  formCtx?: FnFormContext<Form>;
};

export interface FnDialogProps<Form = Record<string, any>> {
  title: string;
  body?: () => VNodeChild;
  width?: number | string;
  draggable?: boolean;
  buttons?: Partial<Record<"reset" | "cancel" | "confirm", FnButtonProps<FnFormContext<Form>>>>;
  footer?: boolean | null;
  onOpen?: (ctx: FnDialogContext<Form>) => void;
  onClose?: (ctx: FnDialogContext<Form>) => void;
  onOpened?: (ctx: FnDialogContext<Form>) => void;
  slots?: FnSlots;
}

export interface FnFormProps<Form = Record<string, any>> {
  dialog?: Omit<FnDialogProps<Form>, "body">;
  title?: string;
  width?: number | string;
  draggable?: boolean;
  columns: Record<string, FnFormColumn>;
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

export type FnComponentProps = {
  name?: Component | string;
  vModel?: string;
  props?: Record<string, any>;
  [key: string]: any;
};

export interface FnFormColumn {
  key?: string;
  title?: FnDynamic<string>;
  order?: number;
  span?: number;
  show?: FnDynamic<boolean>;
  component?: FnComponentProps;
  rules?: any[];
  itemProps?: Record<string, any>;
  slots?: FnSlots;
  value?: any; //默认值
  [key: string]: any;
}

export interface FnButtonItem<Context = void> {
  key: string;
  label: string;
  show?: boolean;
  disabled?: boolean;
  danger?: boolean;
  icon?: Component;
  click?: (context: Context) => void;
}

export interface FnButtonBaseProps {
  text?: FnRefable<string>;
  type?: string;
  icon?: Component;
  shape?: "default" | "circle" | "round";
  tooltip?: string | { title: string };
  primaryColor?: string;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
}

export interface FnButtonProps<Context = void> extends FnButtonBaseProps {
  show?: boolean;
  order?: number;
  buttonType?: "button" | "dropdown";
  click?: (context: Context) => void;
  items?: FnButtonItem<Context>[];
}

export interface FnDropdownButtonProps<Context = void> extends FnButtonBaseProps {
  items: FnButtonItem<Context>[];
}

export interface FnCrudColumn<Row = any> {
  show?: boolean;
  key: string;
  title: string;
  search?: FnDynamic<FnSearchColumn>;
  cell?: FnDynamic<FnTableColumn<Row>>;
  form?: FnDynamic<FnFormColumn>;
}

export interface FnTableColumn<Row = any> {
  buttons?: Record<string, FnButtonProps<FnRowContext<Row>>>;
  show?: boolean;
  title?: string;
  width?: number | string;
  resizable?: boolean;
  class?: string;
  align?: "left" | "center" | "right";
  ellipsis?: boolean;
  fixed?: "left" | "right";
  dict?: FnDictStore;
  order?: number;
  setting?: FnColumnSettingControl;
  component?: Record<string, any>;
  render?: FnDynamic<(ctx: FnRowContext<Row>) => VNodeChild>;
  slots?: FnSlots;
}

export interface FnColumnSettingControl {
  show?: boolean;
  disabled?: boolean;
}

export interface FnCrudColumnPreference {
  order?: number;
  show?: boolean;
  fixed?: "left" | "right" | null;
  width?: number;
}

export interface FnColumnSettingsColumn {
  key: string;
  title: string;
  show: boolean;
  fixed?: "left" | "right";
  setting?: FnColumnSettingControl;
  dynamic?: boolean;
}

export interface FnCrudPreferences {
  columns: Record<string, FnCrudColumnPreference>;
  pageSize?: number;
  density?: "compact" | "comfort";
}

export interface FnCrudPreferenceStorage {
  get: (key: string) => FnCrudPreferences | undefined | Promise<FnCrudPreferences | undefined>;
  set: (key: string, preferences: FnCrudPreferences) => void | Promise<void>;
  remove?: (key: string) => void | Promise<void>;
}

export interface FnTablePageQuery {
  page: {
    offset: number;
    limit: number;
  };
  query: Record<string, any>;
  sort?: {
    prop: string;
    asc: boolean;
  };
}

export interface FnTablePageResult<Row = any> {
  records: Row[];
  total: number;
  tabsCounts?: Record<string, number>;
}

export interface FnActionbarProps {
  show?: boolean;
  buttons: Record<string, FnButtonProps<void>>;
}

export interface FnPaginationProps {
  show?: boolean;
  current?: number;
  pageSize?: number;
  pageSizeOptions?: string[];
  simple?: boolean;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  total?: number;
  showTotal?: (total: number) => string;
  primaryColor?: string;
}
export interface FnPaginationTarget {
  current: number;
  pageSize: number;
}

export interface FnRowSelectOptions {
  title?: string;
  type?: "single" | "multiple";
  fixed?: "left" | "right" | null;
  selectedRowKeys?: Array<string | number>;
  onChange?: (keys: Array<string | number>) => void;
  crossPage?: boolean;
}

export interface FnTableProps {
  columns?: Record<string, FnCrudColumn<FnTableRow>>;
  data: FnTableRow[];
  size?: number;
  density?: "compact" | "comfort";
  sort?: { prop: string; asc: boolean };
  show?: boolean;
  loading?: boolean;
  minWidth?: number | string;
  rowKey?: string | ((row: FnTableRow) => string | number);
  emptyText?: string;
  slots?: FnSlots;
}

export interface FnCrudTableOptions extends Omit<FnTableProps, "columns" | "data" | "sort"> {
  "onUpdate:density"?: (density: "compact" | "comfort") => void;
  "onUpdate:size"?: (size: number) => void;
}

export interface FnCrudPaginationOptions extends FnPaginationProps {
  "onUpdate:current"?: (current: number) => void;
  "onUpdate:pageSize"?: (pageSize: number) => void;
}

export interface FnTabsProps {
  show?: boolean;
  refCol?: string;
  tabs?: Record<string, DictOption>; //以refCol引用生成之后再与tabs合并
  slots?: FnSlots;
}
export interface FnHeadingProps {
  show?: boolean;
  title?: string;
  description?: string;
  slots?: FnSlots;
}
export interface FnToolbarOptions {
  show?: boolean;
  buttons?: Record<string, FnButtonProps<void>>;
  slots?: FnSlots;
}
export interface FnCrudOptions<Row = any> {
  onToggleDensity?: () => void;
  id?: string;
  preferenceStorage?: FnCrudPreferenceStorage;
  rowHandle?: FnTableColumn<Row>;
  rowSelect?: FnRowSelectOptions;
  columns: Record<string, FnCrudColumn<Row>>;
  layout?: FnTableLayoutRow[];
  search?: Omit<FnSearchProps, "columns"> & { columns?: Record<string, FnSearchColumn> };
  actionbar?: FnActionbarProps;
  toolbar?: FnToolbarOptions;
  heading?: FnHeadingProps;
  tabs?: FnTabsProps;
  form?: FnDynamic<Omit<FnFormDialogOptions, "columns">>;
  editForm?: FnDynamic<Omit<FnFormDialogOptions, "columns">>;
  addForm?: FnDynamic<Omit<FnFormDialogOptions, "columns">>;
  request: {
    pageRequest: (query: FnTablePageQuery) => Promise<FnTablePageResult<Row>>;
    addRequest?: (form: Record<string, any>) => Promise<any>;
    editRequest?: (form: Record<string, any>) => Promise<any>;
    delRequest?: (id: string | number) => Promise<any>;
    infoRequest?: (id: string | number) => Promise<Record<string, any>>;
  };
  table?: FnCrudTableOptions;
  pagination?: FnCrudPaginationOptions;
  slots?: FnSlots;
}

export interface FnTableSelectProps<Row = FnTableRow> {
  modelValue?: string | number;
  crudOptions: FnCrudOptions<Row>;
  dict: FnDictStore;
  title?: string;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
}

export interface FnCrudExpose<Row = any> {
  search: {
    getSearchForm: () => Record<string, any>;
  };
  form: {
    openAddForm: (initialForm?: Record<string, any>) => Promise<Record<string, any> | undefined>;
    openEditForm: (row: Row, initialForm?: Record<string, any>) => Promise<Record<string, any> | undefined>;
    openFormDialog: (options: FnFormDialogOptions) => Promise<Record<string, any> | undefined>;
    getFormData: () => Record<string, any> | undefined;
    close: () => void;
  };
  table: {
    /** Returns all selected keys, including keys retained across pages. */
    getSelectedRowKeys: () => Array<string | number>;
    clearSelection: () => void;
    refresh: () => Promise<void>;
    delete: (rowOrId: Row | string | number) => Promise<void>;
    turnPage: (pagination: FnPaginationTarget) => Promise<void>;
  };
}

export type FnTableLayoutItem = "header" | "heading" | "tabs" | "search" | "actionbar" | "toolbar" | "";
export interface FnTableLayoutCol {
  type: FnTableLayoutItem;
  style?: CSSProperties;
}
export interface FnTableLayoutRow {
  style?: CSSProperties;
  cols: FnTableLayoutCol[];
}
export type FnTablePropsRef = Ref<FnTableProps>;

export interface FnSearchColumn {
  show?: boolean;
  order?: number;
  component?: Record<string, any>;
  width?: number | string;
  dict?: FnDictStore;
}

export interface FnSearchProps {
  show?: boolean;
  columns: Record<string, FnDynamic<FnSearchColumn>>;
  buttons?: Record<string, FnButtonProps<FnSearchContext>>;
  formProps?: Record<string, any>;
  slots?: FnSlots;
}
