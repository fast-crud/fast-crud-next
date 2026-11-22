import type { RouteRecordRaw } from "vue-router";
import type { Component } from "vue";
import { Bell, Database, LayoutDashboard, Settings } from "@lucide/vue";
import DashboardView from "../views/DashboardView.vue";
import BasicCrudView from "@fast-crud/fn-admin-shared/views/crud/basis/basic/index.vue";
import ComputeCrudView from "@fast-crud/fn-admin-shared/views/crud/basis/compute/index.vue";
import RequestMockCrud from "@fast-crud/fn-admin-shared/views/crud/basis/request-mock/index.vue";
import DictionaryCrud from "@fast-crud/fn-admin-shared/views/crud/dict/credentials/index.vue";
import SelectionCrud from "@fast-crud/fn-admin-shared/views/crud/feature/selection/index.vue";
import LargeTableCrud from "@fast-crud/fn-admin-shared/views/crud/feature/large-table/index.vue";
import ConditionalFormCrud from "@fast-crud/fn-admin-shared/views/crud/form/conditional/index.vue";
import FormSlotsCrud from "@fast-crud/fn-admin-shared/views/crud/form/slots/index.vue";
import ComponentComparisonView from "../views/ComponentComparisonView.vue";
import type { AdminMenuMessageKey } from "../locale";

export type AdminPageConfig = {
  key: string;
  path?: string;
  titleKey: AdminMenuMessageKey;
  icon?: Component;
  component?: RouteRecordRaw["component"];
  redirect?: string;
  disabled?: boolean;
  children?: AdminPageConfig[];
};

export const adminPageConfig: AdminPageConfig[] = [
  { key: "/dashboard", path: "/dashboard", titleKey: "dashboard", icon: LayoutDashboard, component: DashboardView },
  {
    key: "crud",
    titleKey: "crud",
    icon: Database,
    children: [
      {
        key: "crud-basis",
        titleKey: "crudbasis",
        children: [
          { key: "/crud/basis/sorting", path: "/crud/basis/sorting", titleKey: "sorting", component: () => import("@fast-crud/fn-admin-shared/views/crud/basis/sorting/index.vue") },
          { key: "/crud/basis/quick-search", path: "/crud/basis/quick-search", titleKey: "quickSearch", component: () => import("@fast-crud/fn-admin-shared/views/crud/basis/quick-search/index.vue") },
          { key: "/crud/basis/basic", path: "/crud/basis/basic", titleKey: "basic", component: BasicCrudView },
          { key: "/crud/basis/request-mock", path: "/crud/basis/request-mock", titleKey: "requestMock", component: RequestMockCrud },
          { key: "/crud/basis/compute", path: "/crud/basis/compute", titleKey: "compute", component: ComputeCrudView },
        ],
      },
      {
        key: "crud-dict",
        titleKey: "cruddict",
        children: [
          { key: "/crud/dict/credentials", path: "/crud/dict/credentials", titleKey: "dictionary", component: DictionaryCrud },
        ],
      },
      {
        key: "crud-feature",
        titleKey: "crudfeature",
        children: [
          { key: "/crud/feature/fixed-columns", path: "/crud/feature/fixed-columns", titleKey: "fixedColumns", component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/fixed-columns/index.vue") },
          { key: "/crud/feature/column-preferences", path: "/crud/feature/column-preferences", titleKey: "columnPreferences", component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/column-preferences/index.vue") },
          { key: "/crud/feature/single-selection", path: "/crud/feature/single-selection", titleKey: "singleSelection", component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/single-selection/index.vue") },
          { key: "/crud/feature/row-actions", path: "/crud/feature/row-actions", titleKey: "rowActions", component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/row-actions/index.vue") },
          { key: "/crud/feature/compact-pagination", path: "/crud/feature/compact-pagination", titleKey: "compactPagination", component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/compact-pagination/index.vue") },
          { key: "/crud/feature/header-filters", path: "/crud/feature/header-filters", titleKey: "headerFilters", component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/header-filters/index.vue") },
          { key: "/crud/feature/selection", path: "/crud/feature/selection", titleKey: "selection", component: SelectionCrud },
          { key: "/crud/feature/large-table", path: "/crud/feature/large-table", titleKey: "largeTable", component: LargeTableCrud },
        ],
      },
      {
        key: "crud-form",
        titleKey: "crudform",
        children: [
          { key: "/crud/form/modes", path: "/crud/form/modes", titleKey: "formModes", component: () => import("@fast-crud/fn-admin-shared/views/crud/form/modes/index.vue") },
          { key: "/crud/form/validation", path: "/crud/form/validation", titleKey: "formValidation", component: () => import("@fast-crud/fn-admin-shared/views/crud/form/validation/index.vue") },
          { key: "/crud/form/conditional", path: "/crud/form/conditional", titleKey: "conditionalForm", component: ConditionalFormCrud },
          { key: "/crud/form/slots", path: "/crud/form/slots", titleKey: "formSlots", component: FormSlotsCrud },
        ],
      },
    ],
  },
  { key: "/components/table-buttons", path: "/components/table-buttons", titleKey: "componentComparison", icon: Settings, component: ComponentComparisonView },
  { key: "/components/feedback", path: "/components/feedback", titleKey: "feedback", icon: Bell, component: () => import("@fast-crud/fn-admin-shared/views/components/feedback/index.vue") },
  { key: "settings", titleKey: "settings", icon: Settings, disabled: true },
  { key: "/", path: "/", titleKey: "dashboard", redirect: "/dashboard" },
  { key: "/crud/basic", path: "/crud/basic", titleKey: "basic", redirect: "/crud/basis/basic" },
  { key: "/crud/mock", path: "/crud/mock", titleKey: "requestMock", redirect: "/crud/basis/request-mock" },
  { key: "/crud/compute", path: "/crud/compute", titleKey: "compute", redirect: "/crud/basis/compute" },
  { key: "/crud/dictionary", path: "/crud/dictionary", titleKey: "dictionary", redirect: "/crud/dict/credentials" },
  { key: "/crud/selection", path: "/crud/selection", titleKey: "selection", redirect: "/crud/feature/selection" },
  { key: "/crud/conditional-form", path: "/crud/conditional-form", titleKey: "conditionalForm", redirect: "/crud/form/conditional" },
];

function toRouteRecords(config: AdminPageConfig[]): RouteRecordRaw[] {
  return config.flatMap(({ path, titleKey, component, redirect, children }) => [
    ...(path && (component || redirect) ? [{ path, component, redirect, meta: { titleKey } } as RouteRecordRaw] : []),
    ...(children ? toRouteRecords(children) : []),
  ]);
}

export const adminMenuConfig = adminPageConfig.filter(page => !page.path || page.component || page.children);
export const adminRouteRecords = toRouteRecords(adminPageConfig);
