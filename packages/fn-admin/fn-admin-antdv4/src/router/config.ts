import type { RouteRecordRaw } from "vue-router";
import type { Component } from "vue";
import { Database, LayoutDashboard, Settings } from "@lucide/vue";
import DashboardView from "../views/DashboardView.vue";
import BasicCrudView from "../views/crud/basis/basic/index.vue";
import ComputeCrudView from "../views/crud/basis/compute/index.vue";
import RequestMockCrud from "../views/crud/basis/request-mock/index.vue";
import DictionaryCrud from "../views/crud/dict/credentials/index.vue";
import SelectionCrud from "../views/crud/feature/selection/index.vue";
import ConditionalFormCrud from "../views/crud/form/conditional/index.vue";
import ComponentComparisonView from "../views/ComponentComparisonView.vue";

export type AdminPageConfig = {
  key: string;
  path?: string;
  title: [string, string];
  icon?: Component;
  component?: RouteRecordRaw["component"];
  redirect?: string;
  disabled?: boolean;
  children?: AdminPageConfig[];
};

export const adminPageConfig: AdminPageConfig[] = [
  { key: "/dashboard", path: "/dashboard", title: ["工作台", "Dashboard"], icon: LayoutDashboard, component: DashboardView },
  {
    key: "crud",
    title: ["CRUD 示例", "CRUD examples"],
    icon: Database,
    children: [
      { key: "/crud/basis/basic", path: "/crud/basis/basic", title: ["基础列表", "Basic list"], component: BasicCrudView },
      { key: "/crud/basis/request-mock", path: "/crud/basis/request-mock", title: ["请求 Mock", "Request mock"], component: RequestMockCrud },
      { key: "/crud/basis/compute", path: "/crud/basis/compute", title: ["动态计算", "Dynamic calculations"], component: ComputeCrudView },
      { key: "/crud/dict/credentials", path: "/crud/dict/credentials", title: ["字典与筛选", "Dictionary and filters"], component: DictionaryCrud },
      { key: "/crud/feature/selection", path: "/crud/feature/selection", title: ["跨页批量操作", "Cross-page batch actions"], component: SelectionCrud },
      { key: "/crud/form/conditional", path: "/crud/form/conditional", title: ["条件表单", "Conditional forms"], component: ConditionalFormCrud },
    ],
  },
  { key: "/components/table-buttons", path: "/components/table-buttons", title: ["组件对比", "Component comparison"], icon: Settings, component: ComponentComparisonView },
  { key: "settings", title: ["系统设置", "Settings"], icon: Settings, disabled: true },
  { key: "/", path: "/", title: ["工作台", "Dashboard"], redirect: "/dashboard" },
  { key: "/crud/basic", path: "/crud/basic", title: ["基础列表", "Basic list"], redirect: "/crud/basis/basic" },
  { key: "/crud/mock", path: "/crud/mock", title: ["请求 Mock", "Request mock"], redirect: "/crud/basis/request-mock" },
  { key: "/crud/compute", path: "/crud/compute", title: ["动态计算", "Dynamic calculations"], redirect: "/crud/basis/compute" },
  { key: "/crud/dictionary", path: "/crud/dictionary", title: ["字典与筛选", "Dictionary and filters"], redirect: "/crud/dict/credentials" },
  { key: "/crud/selection", path: "/crud/selection", title: ["跨页批量操作", "Cross-page batch actions"], redirect: "/crud/feature/selection" },
  { key: "/crud/conditional-form", path: "/crud/conditional-form", title: ["条件表单", "Conditional forms"], redirect: "/crud/form/conditional" },
];

function toRouteRecords(config: AdminPageConfig[]): RouteRecordRaw[] {
  return config.flatMap(({ path, title, component, redirect, children }) => [
    ...(path && (component || redirect) ? [{ path, component, redirect, meta: { title } } as RouteRecordRaw] : []),
    ...(children ? toRouteRecords(children) : []),
  ]);
}

export const adminMenuConfig = adminPageConfig.filter(page => !page.path || page.component || page.children);
export const adminRouteRecords = toRouteRecords(adminPageConfig);
