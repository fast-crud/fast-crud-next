import type { RouteRecordRaw } from "vue-router";
import Overview from "./views/Overview.vue";
import BasicCrud from "./views/BasicCrud.vue";
import ComputeCrud from "./views/ComputeCrud.vue";
import NaiveDictionaryCrud from "./views/NaiveDictionaryCrud.vue";
import SelectionCrud from "@fast-crud/fn-admin-shared/views/SelectionCrud.vue";
import ConditionalFormCrud from "@fast-crud/fn-admin-shared/views/ConditionalFormCrud.vue";
import ComponentComparisonView from "./views/ComponentComparisonView.vue";
import MockCrud from "@fast-crud/fn-admin-shared/views/MockCrud.vue";
export const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/overview" },
  { path: "/overview", component: Overview },
  { path: "/crud/basic", component: BasicCrud },
  { path: "/crud/mock", component: MockCrud },
  { path: "/crud/compute", component: ComputeCrud },
  { path: "/crud/dictionary", component: NaiveDictionaryCrud },
  { path: "/crud/selection", component: SelectionCrud },
  { path: "/crud/conditional-form", component: ConditionalFormCrud },
  { path: "/components/table-buttons", component: ComponentComparisonView },
];
