import type { RouteRecordRaw } from "vue-router";
import type { Component } from "vue";
import {
  Bell,
  BookOpen,
  Calculator,
  CircleCheck,
  CircleDot,
  ClipboardCheck,
  ClipboardList,
  Columns3,
  Database,
  Filter,
  FormInput,
  GitBranch,
  LayoutDashboard,
  ListChecks,
  ListFilter,
  MousePointerClick,
  Rows3,
  Search,
  Settings,
  Settings2,
  SlidersHorizontal,
  Table2,
  TableProperties,
  ToggleRight,
  Type,
} from "@lucide/vue";
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
        icon: BookOpen,
        children: [
          { key: "/crud/basis/sorting", path: "/crud/basis/sorting", titleKey: "sorting", icon: ListFilter, component: () => import("@fast-crud/fn-admin-shared/views/crud/basis/sorting/index.vue") },
          { key: "/crud/basis/quick-search", path: "/crud/basis/quick-search", titleKey: "quickSearch", icon: Search, component: () => import("@fast-crud/fn-admin-shared/views/crud/basis/quick-search/index.vue") },
          { key: "/crud/basis/basic", path: "/crud/basis/basic", titleKey: "basic", icon: Table2, component: BasicCrudView },
          { key: "/crud/basis/request-mock", path: "/crud/basis/request-mock", titleKey: "requestMock", icon: ClipboardList, component: RequestMockCrud },
          { key: "/crud/basis/compute", path: "/crud/basis/compute", titleKey: "compute", icon: Calculator, component: ComputeCrudView },
        ],
      },
      {
        key: "crud-dict",
        titleKey: "cruddict",
        icon: BookOpen,
        children: [
          { key: "/crud/dict/credentials", path: "/crud/dict/credentials", titleKey: "dictionary", icon: BookOpen, component: DictionaryCrud },
        ],
      },
      {
        key: "crud-feature",
        titleKey: "crudfeature",
        icon: SlidersHorizontal,
        children: [
          { key: "/crud/feature/fixed-columns", path: "/crud/feature/fixed-columns", titleKey: "fixedColumns", icon: Columns3, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/fixed-columns/index.vue") },
          { key: "/crud/feature/column-preferences", path: "/crud/feature/column-preferences", titleKey: "columnPreferences", icon: SlidersHorizontal, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/column-preferences/index.vue") },
          { key: "/crud/feature/single-selection", path: "/crud/feature/single-selection", titleKey: "singleSelection", icon: CircleDot, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/single-selection/index.vue") },
          { key: "/crud/feature/row-actions", path: "/crud/feature/row-actions", titleKey: "rowActions", icon: ListChecks, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/row-actions/index.vue") },
          { key: "/crud/feature/compact-pagination", path: "/crud/feature/compact-pagination", titleKey: "compactPagination", icon: Rows3, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/compact-pagination/index.vue") },
          { key: "/crud/feature/header-filters", path: "/crud/feature/header-filters", titleKey: "headerFilters", icon: Filter, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/header-filters/index.vue") },
          { key: "/crud/feature/selection", path: "/crud/feature/selection", titleKey: "selection", icon: CircleCheck, component: SelectionCrud },
          { key: "/crud/feature/large-table", path: "/crud/feature/large-table", titleKey: "largeTable", icon: TableProperties, component: LargeTableCrud },
        ],
      },
      {
        key: "crud-form",
        titleKey: "crudform",
        icon: FormInput,
        children: [
          { key: "/crud/form/modes", path: "/crud/form/modes", titleKey: "formModes", icon: FormInput, component: () => import("@fast-crud/fn-admin-shared/views/crud/form/modes/index.vue") },
          { key: "/crud/form/validation", path: "/crud/form/validation", titleKey: "formValidation", icon: ClipboardCheck, component: () => import("@fast-crud/fn-admin-shared/views/crud/form/validation/index.vue") },
          { key: "/crud/form/conditional", path: "/crud/form/conditional", titleKey: "conditionalForm", icon: GitBranch, component: ConditionalFormCrud },
          { key: "/crud/form/slots", path: "/crud/form/slots", titleKey: "formSlots", icon: Settings2, component: FormSlotsCrud },
        ],
      },
      {
        key: "crud-component",
        titleKey: "crudcomponent",
        icon: Settings2,
        children: [
          { key: "/crud/component/text", path: "/crud/component/text", titleKey: "componentText", icon: Type, component: () => import("@fast-crud/fn-admin-shared/views/components/text/index.vue") },
          { key: "/crud/component/button", path: "/crud/component/button", titleKey: "componentButton", icon: MousePointerClick, component: () => import("@fast-crud/fn-admin-shared/views/components/button/index.vue") },
          { key: "/crud/component/select", path: "/crud/component/select", titleKey: "componentSelect", icon: ListFilter, component: () => import("@fast-crud/fn-admin-shared/views/components/select/index.vue") },
          { key: "/crud/component/radio", path: "/crud/component/radio", titleKey: "componentRadio", icon: CircleDot, component: () => import("@fast-crud/fn-admin-shared/views/components/radio/index.vue") },
          { key: "/crud/component/checkbox", path: "/crud/component/checkbox", titleKey: "componentCheckbox", icon: CircleCheck, component: () => import("@fast-crud/fn-admin-shared/views/components/checkbox/index.vue") },
          { key: "/crud/component/switch", path: "/crud/component/switch", titleKey: "componentSwitch", icon: ToggleRight, component: () => import("@fast-crud/fn-admin-shared/views/components/switch/index.vue") },
          { key: "/crud/component/table-select", path: "/crud/component/table-select", titleKey: "componentTableSelect", icon: Table2, component: () => import("@fast-crud/fn-admin-shared/views/components/table-select/index.vue") },
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
