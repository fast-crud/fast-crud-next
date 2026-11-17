import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { installFnCrud, uiContext } from "../../../fn-crud/src/crud";
import "ant-design-vue/dist/reset.css";
import "../../../fn-crud/src/crud/theme/tokens.css";
import "./style.css";
import App from "./App.vue";
import DashboardView from "./views/DashboardView.vue";
import BasicCrudView from "./views/crud/basis/basic/index.vue";
import ComputeCrudView from "./views/crud/basis/compute/index.vue";
import RequestMockCrud from "./views/crud/basis/request-mock/index.vue";
import DictionaryCrud from "./views/crud/dict/credentials/index.vue";
import SelectionCrud from "./views/crud/feature/selection/index.vue";
import ConditionalFormCrud from "./views/crud/form/conditional/index.vue";
import ComponentComparisonView from "./views/ComponentComparisonView.vue";
import { registerMockModules } from "@fast-crud/fn-admin-shared/mock";
import { message, notification } from "ant-design-vue";

const crudMockModules = import.meta.glob<{ default?: Array<{ path: string; handle: (request: any) => any }> }>("./views/crud/**/mock.ts", { eager: true });
registerMockModules(crudMockModules);
installFnCrud({ commonOptions: () => ({ table: { size: 14, density: "comfort" } }) });
uiContext.setServices({ notification, message });
const router = createRouter({ history: createWebHistory(), routes: [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: DashboardView },
  { path: "/crud/basis/basic", component: BasicCrudView },
  { path: "/crud/basis/request-mock", component: RequestMockCrud },
  { path: "/crud/basis/compute", component: ComputeCrudView },
  { path: "/crud/dict/credentials", component: DictionaryCrud },
  { path: "/crud/feature/selection", component: SelectionCrud },
  { path: "/crud/form/conditional", component: ConditionalFormCrud },
  { path: "/crud/basic", redirect: "/crud/basis/basic" },
  { path: "/crud/mock", redirect: "/crud/basis/request-mock" },
  { path: "/crud/compute", redirect: "/crud/basis/compute" },
  { path: "/crud/dictionary", redirect: "/crud/dict/credentials" },
  { path: "/crud/selection", redirect: "/crud/feature/selection" },
  { path: "/crud/conditional-form", redirect: "/crud/form/conditional" },
  { path: "/components/table-buttons", component: ComponentComparisonView },
] });
createApp(App).use(router).mount("#app");
