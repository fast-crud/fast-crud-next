<template>
  <div class="fn-crud" :data-density="density">
    <header class="fn-crud-header">
      <div v-for="(row, rowIndex) in layoutProps" :key="rowIndex" class="fn-crud-layout-row" :style="row.style">
        <div v-for="(col, colIndex) in row.cols" :key="colIndex" class="fn-crud-layout-col" :class="col.type ? `fn-crud-layout-col--${col.type}` : undefined" :style="col.style">
          <FnHeading v-if="(col.type === 'header' || col.type === 'heading') && headingProps.show !== false" v-bind="headingProps" />
          <FnTabs v-else-if="col.type === 'tabs' && tabsProps.show !== false" v-bind="tabsProps" />
          <FnSearch v-else-if="col.type === 'search' && searchProps.show !== false" v-bind="searchProps" />
          <FnActionbar v-else-if="col.type === 'actionbar' && actionbarProps.show !== false" v-bind="actionbarProps" />
          <FnToolbar v-else-if="col.type === 'toolbar' && toolbarProps.show !== false" v-bind="toolbarProps" />
        </div>
      </div>
    </header>
    <div class="fn-crud-body">
      <FnRender v-if="tableRenderProps.show" v-bind="tableRenderProps" />
      <FnTable v-else-if="tableProps.show !== false" v-bind="tableProps" />
    </div>
    <FnFormDialog ref="FnFormDialogRef" />
    <footer v-if="paginationProps.show !== false" class="fn-crud-footer"><FnPagination v-bind="paginationProps" /></footer>
  </div>
</template>

<script setup lang="tsx">
import { getCurrentInstance, onMounted, provide, reactive, ref } from "vue";
import FnTable from "./table/fn-table.vue";
import FnPagination from "./table/fn-pagination.vue";
import FnSearch from "./search/fn-search.vue";
import FnTabs from "./tabs/index.vue";
import FnHeading from "./heading/fn-heading.vue";
import FnActionbar from "./actionbar/fn-actionbar.vue";
import FnToolbar from "./toolbar/fn-toolbar.vue";
import FnFormDialog from "./form/fn-form-dialog.vue";
import FnRender from "../components/render/fn-render.ts";
import { model } from "../components/overlay/dialog.ts";
import { fnCrudSearchKey, uiContext } from "../components/provider/context.ts";
import { useMerge } from "../components/use/use-merge";
import { useActionbarProps, useFormProps, useHeadingProps, useLayoutProps, usePaginationProps, useRowHandleProps, useSearchProps, useTableRenderProps, useTabsProps, useToolbarProps } from "./use/use-crud-props.tsx";
import { useTable } from "./use/use-table";
import { useFnCrudPreferences, type FnCrudPreferencesController } from "./use/use-preferences";
import type { FnCrudExpose, FnCrudOptions, FnFormDialogOptions, FnFormContext, FnRowContext, FnTableRow } from "../types/index.ts";

const rawProps = defineProps<FnCrudOptions & { rowHandle?: any; columns: Record<string, any> }>();
const props = rawProps as FnCrudOptions;
const vueSlots = getCurrentInstance()?.slots || {};
const { notification } = uiContext.getServices();
const { merge } = useMerge();
const FnFormDialogRef = ref<InstanceType<typeof FnFormDialog>>();
const searchForm = reactive<Record<string, any>>({});
const searchProps = useSearchProps(props, vueSlots.search ? (ctx?: Record<string, any>) => vueSlots.search?.(ctx) : undefined);
const rowHandleProps = useRowHandleProps(props, editRow, openDeleteDialog);
let preferences!: FnCrudPreferencesController;
const table = useTable(props, rowHandleProps, searchForm, () => preferences);
preferences = useFnCrudPreferences(props, () => table.baseTableColumns.value, () => table.defaultColumnSettings.value, notification);
onMounted(async () => {
  await preferences.initializePreferences();
  await table.refresh();
});
const {
  page,
  tabsCounts,
  tableProps,
  canBatchDelete,
  getRecordId,
  getSelectedRowKeys,
  clearSelectedRowKeys,
  refresh,
  applySearch,
  turnPage,
  changePage,
} = table;
const { preferencesLoaded, density } = preferences;
provide(fnCrudSearchKey, { form: searchForm, search: applySearch });
async function editRow(ctx: FnRowContext): Promise<void> {
  if (!ctx.row) {
    return;
  }
  await openEditForm(ctx.row);
}
function openDeleteDialog(ctx: FnRowContext): ReturnType<typeof confirmDelete> | undefined {
  const row = ctx.row;
  if (!row || !props.request.delRequest) {
    return;
  }
  return confirmDelete(row);
}
function confirmDelete(rowOrId: FnTableRow | string | number): ReturnType<typeof model.confirm> {
  const id = typeof rowOrId === "object" ? getRecordId(rowOrId) : rowOrId;
  return model.confirm({
    title: "确认删除",
    body: () => "确定删除这条记录吗？此操作不可撤销。",
    buttons: {
      confirm: {
        text: "删除",
        danger: true,
        click: () => deleteById(id),
      },
    },
  });
}
function openBatchDeleteDialog(): ReturnType<typeof model.confirm> | undefined {
  const selectedKeys = getSelectedRowKeys();
  const delRequest = props.request.delRequest;
  if (!selectedKeys.length || !delRequest) {
    return;
  }
  return model.confirm({
    title: "确认批量删除",
    body: () => `确定删除选中的 ${selectedKeys.length} 条记录吗？此操作不可撤销。`,
    buttons: {
      confirm: {
        text: "删除",
        danger: true,
        click: async () => {
          for (const id of selectedKeys) {
            await delRequest(id);
          }
          notification.success({ message: `已删除 ${selectedKeys.length} 条记录` });
          clearSelectedRowKeys();
          await refresh();
        },
      },
    },
  });
}
function handleActionbarSelect(buttonKey: string, itemKey: string): void {
  if (buttonKey === "batch" && itemKey === "delete") {
    openBatchDeleteDialog();
  }
}
async function deleteById(id: string | number): Promise<void> {
  const delRequest = props.request.delRequest;
  if (!delRequest) {
    throw new Error("当前列表未配置删除请求");
  }
  await delRequest(id);
  notification.success({ message: "删除成功" });
  await refresh();
}
const actionbarProps = useActionbarProps(props, openAddForm, canBatchDelete, handleActionbarSelect);
const toolbarProps = useToolbarProps(props, {
  density,
  preferencesLoaded,
  columnSettingsProps: table.columnSettingsProps,
  onUpdateDensity: preferences.changeDensity,
  onResetColumnSettings: preferences.resetColumnSettings,
  bodyBottomSlot: vueSlots.bodyBottom ? () => vueSlots.bodyBottom?.() : undefined,
});
const headingSlot = vueSlots.header
  ? (ctx?: Record<string, any>) => vueSlots.header?.({ "selected-row-keys": ctx?.selectedRowKeys, selectedRowKeys: ctx?.selectedRowKeys })
  : undefined;
const headingProps = useHeadingProps(props, getSelectedRowKeys, headingSlot);
const tabsProps = useTabsProps(props, searchForm, tabsCounts, applySearch);
const paginationProps = usePaginationProps(props, page, changePage);
const tableRenderSlot = vueSlots.default ? (ctx?: Record<string, any>) => vueSlots.default?.(ctx) : undefined;
const tableRenderProps = useTableRenderProps(props, tableProps, tableRenderSlot);
const layoutProps = useLayoutProps(props);
const formProps = useFormProps(props);
function openFormDialog(options: FnFormDialogOptions): Promise<FnFormContext> {
  return FnFormDialogRef.value!.open(options);
}
function openAddForm(initialForm: Record<string, any> = {}): Promise<FnFormContext> {
  return openForm("add", initialForm);
}
async function openEditForm(row: FnTableRow, initialForm: Record<string, any> = {}): Promise<FnFormContext> {
  let form = { ...row };
  if (props.request.infoRequest) {
    form = await props.request.infoRequest(getRecordId(row));
  }
  return openForm("edit", { ...form, ...initialForm });
}
function openForm(mode: "add" | "edit", initialForm: Record<string, any> = {}): Promise<FnFormContext> {
  const modeOptions = mode === "add" ? props.addForm : props.editForm;
  const formConfig = merge({}, {
    onSubmit: async (ctx: FnFormContext) => {
      if (mode === "add" && props.request.addRequest) {
        await props.request.addRequest(ctx.form || {});
      } else if (mode === "edit" && props.request.editRequest) {
        await props.request.editRequest(ctx.form || {});
      } else {
        throw new Error(`当前${mode === "add" ? "新增" : "编辑"}表单未配置提交请求`);
      }
      await refresh();
    },
  }, props.form, modeOptions);
  const options = merge({}, formProps.value, { mode, initialForm }, formConfig);
  return FnFormDialogRef.value!.open(options);
}
const exposed: FnCrudExpose = {
  search: { getSearchForm: () => ({ ...searchForm }) },
  form: {
    openAddForm,
    openEditForm,
    openFormDialog,
    getFormData: () => FnFormDialogRef.value?.getFormData(),
    close: () => FnFormDialogRef.value?.close(),
  },
  table: {
    getSelectedRowKeys,
    clearSelection: clearSelectedRowKeys,
    refresh,
    delete: async rowOrId => {
      await confirmDelete(rowOrId as Record<string, any> | string | number);
    },
    turnPage,
  },
};
defineExpose(exposed);
</script>

<style lang="less">
.fn-crud {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  padding: 0;
  height: 100%;
  min-height: 300px;
  .fn-crud-header {
    padding: 10px 20px;
    gap: 10px;
    background: var(--fn-color-bg-container, #fff);
    display: flex;
    flex-direction: column;
    .fn-tabs {
      margin-bottom: -3px;
    }
  }
  .fn-crud-footer {
    padding: 10px 20px;
    background-color: var(--fn-color-bg-container);
    color: var(--fn-color-text-secondary);
  }
  .fn-crud-layout-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  .fn-crud-layout-col {
    min-width: 0;
  }
  .fn-crud-layout-col--tabs {
    flex: 1;
  }
  .fn-crud-body {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
  }
  @media (max-width: 650px) {
    .fn-crud-row {
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 8px;
    }

    .fn-crud-col--tabs,
    .fn-crud-col--actionbar,
    .fn-crud-col--search {
      width: 100%;
      flex: 1 1 100%;
    }

    .fn-crud-col--tabs {
      order: -1;
    }

    .fn-crud-col--search .fn-search {
      width: 100%;
    }

    .fn-actionbar,
    .fn-toolbar {
      flex-wrap: wrap;
    }
  }
}
</style>
