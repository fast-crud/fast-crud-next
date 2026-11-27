<script setup lang="tsx">
import { markRaw, reactive } from "vue";
import { DictStore, FnCrud, FnTableSelect, type FnCrudState } from "@fast-crud/fast-crud-next";
import { ownerPageRequest, owners, request, type ComponentDemoRow } from "../shared/api";
import { useFnCrud } from "@fast-crud/fast-crud-next";

const ownerDict = new DictStore({
  value: "id",
  label: "name",
  getNodesByValues: async values => owners.filter(owner => values.map(String).includes(String(owner.id))),
});
const ownerCrudOptions = {
  columns: {
    name: { key: "name", title: "负责人", cell: { width: 220 } },
    id: { key: "id", title: "编号", cell: { width: 100 } },
  },
  request: { pageRequest: ownerPageRequest },
};
const state = reactive<FnCrudState<ComponentDemoRow>>({
  id: "shared-component-table-select",
  heading: { title: "表格选择", description: "在表单中使用 FnTableSelect，打开弹窗后单击数据行选择负责人，再点击确认。" },
  rowHandle: { width: 150 },
  columns: {
    name: { key: "name", title: "名称", type: "text", form: { rules: [{ required: true, message: "请输入名称" }] } },
    ownerId: {
      key: "ownerId",
      title: "负责人",
      form: {
        component: {
          name: markRaw(FnTableSelect),
          dict: ownerDict,
          crudOptions: ownerCrudOptions,
          dialog: { width: "72vw", title: "选择负责人" },
        },
        rules: [{ required: true, message: "请选择负责人" }],
      },
    },
    reviewerId: {
      key: "reviewerId",
      title: "复核人",
      form: {
        component: {
          name: markRaw(FnTableSelect),
          dict: ownerDict,
          crudOptions: ownerCrudOptions,
          dialog: { width: "560px", title: "选择复核人" },
        },
      },
    },
  },
  request,
  search: { columns: { name: { component: { placeholder: "请输入名称" } }, ownerId: { component: { placeholder: "请输入负责人编号" } }, reviewerId: { component: { placeholder: "请输入复核人编号" } } } },
});
useFnCrud({ state });
</script>
<template><div class="crud-page showcase-page"><FnCrud v-bind="state" /></div></template>
