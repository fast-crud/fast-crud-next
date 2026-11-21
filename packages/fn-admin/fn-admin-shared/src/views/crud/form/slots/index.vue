<script setup lang="tsx">
import { markRaw, reactive } from "vue";
import { FnButton, FnCrud, FnInput, type FnCrudState, useFnCrud } from "@fast-crud/fast-crud-next";
import { api, type WorkflowRecord } from "./api";

const slotLabel = (name: string) => <span class="slot-label">{name}</span>;

const crudState = reactive<FnCrudState<WorkflowRecord>>({
  id: "shared-form-slots-workflows",
  heading: { title: "CRUD 插槽示例", description: "查看表格数据上下文，以及表单标题、内容和页脚插槽。" },
  columns: {
    id: { key: "id", title: "编号", cell: { width: 90 } },
    name: {
      key: "name",
      title: "流程名称",
      search: { component: { name: markRaw(FnInput) as any, vModel: "modelValue", placeholder: "搜索流程名称" } },
      form: { rules: [{ required: true, message: "请输入流程名称" }] },
      cell: { order: 1 },
    },
    owner: { key: "owner", title: "负责人", form: { rules: [{ required: true, message: "请输入负责人" }] }, cell: { order: 2, width: 140 } },
    environment: { key: "environment", title: "环境", form: { value: "测试" }, cell: { order: 3, width: 120 } },
    status: { key: "status", title: "状态", form: { value: "草稿" }, cell: { order: 4, width: 110 } },
  },
  table: { rowKey: "id", minWidth: 700 },
  rowHandle: { width: 150 },
  form: {
    dialog: {
      width: 1200,
      title: "发布流程",
      slots: {
        headerLeft: () => slotLabel("headerLeft 标题栏左侧"),
        headerActionLeft: () => slotLabel("headerActionLeft 标题操作左侧"),
        headerActionRight: () => slotLabel("headerActionRight 标题操作右侧"),
        headerRight: context => (
          <div class="form-slot-header-right">
            {slotLabel("headerRight 标题右侧")}
            <span class="form-slot-preview">{context?.form?.name || ""}</span>
          </div>
        ),
        bodyTop: () => <div class="slot-band">bodyTop 表单上方</div>,
        bodyLeft: () => <div class="slot-band">bodyLeft 表单左侧</div>,
        bodyRight: () => <div class="slot-band">bodyRight 表单右侧</div>,
        bodyBottom: () => <div class="slot-band">bodyBottom 表单下方</div>,
        footerLeft: () => slotLabel("footerLeft 页脚左侧"),
        footer: context => (
          <div class="slot-footer">
            {slotLabel("footer 自定义页脚")}
            <FnButton text="取消" type="default" click={context?.dialog?.close} />
            <FnButton
              text="提交"
              type="primary"
              loading={context?.dialog?.loading?.value}
              click={context?.dialog?.confirm}
            />
          </div>
        ),
        footerRight: () => slotLabel("footerRight 页脚右侧"),
      },
    },
  },
  request: { ...api },
}) as unknown as FnCrudState<WorkflowRecord>;

useFnCrud({ state: crudState });
</script>

<template>
  <div class="view-stack">
    <section class="panel">
      <FnCrud v-bind="crudState" />
    </section>
  </div>
</template>

<style lang="less">
.form-slot-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.slot-label {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  color: #cf1322;
  background: #fff2f0;
  white-space: nowrap;
}

.slot-band {
  padding: 10px 12px;
  border: 1px solid #ffe58f;
  border-radius: 6px;
  color: #694b00;
  background: #fffbe6;
}

.slot-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-slot-preview {
  max-width: 240px;
  overflow: hidden;
  color: var(--fn-color-text-secondary, #667085);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workflow-custom-table {
  min-height: 0;
  flex: 1;
  overflow: auto;
  border-top: 1px solid var(--fn-color-border-secondary, #e4e7ec);
  border-bottom: 1px solid var(--fn-color-border-secondary, #e4e7ec);
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--fn-color-border-secondary, #e4e7ec);
  }
  th {
    color: var(--fn-color-text-secondary, #667085);
    font-weight: 600;
  }
}
</style>
