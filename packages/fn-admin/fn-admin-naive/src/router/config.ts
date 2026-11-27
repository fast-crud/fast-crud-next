import type { Component } from "vue";
import type { RouteRecordRaw } from "vue-router";
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
import Overview from "../views/Overview.vue";
import ComponentComparisonView from "../views/ComponentComparisonView.vue";
import BasicCrud from "@fast-crud/fn-admin-shared/views/crud/basis/basic/index.vue";
import ComputeCrud from "@fast-crud/fn-admin-shared/views/crud/basis/compute/index.vue";
import RequestMockCrud from "@fast-crud/fn-admin-shared/views/crud/basis/request-mock/index.vue";
import DictionaryCrud from "@fast-crud/fn-admin-shared/views/crud/dict/credentials/index.vue";
import SelectionCrud from "@fast-crud/fn-admin-shared/views/crud/feature/selection/index.vue";
import LargeTableCrud from "@fast-crud/fn-admin-shared/views/crud/feature/large-table/index.vue";
import ConditionalFormCrud from "@fast-crud/fn-admin-shared/views/crud/form/conditional/index.vue";
import FormSlotsCrud from "@fast-crud/fn-admin-shared/views/crud/form/slots/index.vue";

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
  { key: "/dashboard", path: "/dashboard", title: ["工作台", "Dashboard"], icon: LayoutDashboard, component: Overview },
  {
    key: "crud",
    title: ["CRUD 示例", "CRUD examples"],
    icon: Database,
    children: [
      {
        key: "crud-basis",
        title: ["基础", "Basics"],
        icon: BookOpen,
        children: [
          { key: "/crud/basis/sorting", path: "/crud/basis/sorting", title: ["表头排序", "Column sorting"], icon: ListFilter, component: () => import("@fast-crud/fn-admin-shared/views/crud/basis/sorting/index.vue") },
          { key: "/crud/basis/quick-search", path: "/crud/basis/quick-search", title: ["快捷搜索", "Quick search"], icon: Search, component: () => import("@fast-crud/fn-admin-shared/views/crud/basis/quick-search/index.vue") },
          { key: "/crud/basis/basic", path: "/crud/basis/basic", title: ["基础列表", "Basic list"], icon: Table2, component: BasicCrud },
          { key: "/crud/basis/request-mock", path: "/crud/basis/request-mock", title: ["请求 Mock", "Request mock"], icon: ClipboardList, component: RequestMockCrud },
          { key: "/crud/basis/compute", path: "/crud/basis/compute", title: ["动态计算", "Dynamic calculations"], icon: Calculator, component: ComputeCrud },
        ],
      },
      {
        key: "crud-dict",
        title: ["字典", "Dictionary"],
        icon: BookOpen,
        children: [
          { key: "/crud/dict/credentials", path: "/crud/dict/credentials", title: ["字典与筛选", "Dictionary and filters"], icon: BookOpen, component: DictionaryCrud },
        ],
      },
      {
        key: "crud-feature",
        title: ["功能", "Features"],
        icon: SlidersHorizontal,
        children: [
          { key: "/crud/feature/fixed-columns", path: "/crud/feature/fixed-columns", title: ["左右固定列", "Fixed columns"], icon: Columns3, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/fixed-columns/index.vue") },
          { key: "/crud/feature/column-preferences", path: "/crud/feature/column-preferences", title: ["列配置偏好", "Column preferences"], icon: SlidersHorizontal, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/column-preferences/index.vue") },
          { key: "/crud/feature/single-selection", path: "/crud/feature/single-selection", title: ["单选记录", "Single selection"], icon: CircleDot, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/single-selection/index.vue") },
          { key: "/crud/feature/row-actions", path: "/crud/feature/row-actions", title: ["行操作菜单", "Row action menu"], icon: ListChecks, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/row-actions/index.vue") },
          { key: "/crud/feature/compact-pagination", path: "/crud/feature/compact-pagination", title: ["简洁分页", "Compact pagination"], icon: Rows3, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/compact-pagination/index.vue") },
          { key: "/crud/feature/header-filters", path: "/crud/feature/header-filters", title: ["组合表头筛选", "Combined header filters"], icon: Filter, component: () => import("@fast-crud/fn-admin-shared/views/crud/feature/header-filters/index.vue") },
          { key: "/crud/feature/selection", path: "/crud/feature/selection", title: ["跨页批量操作", "Cross-page batch actions"], icon: CircleCheck, component: SelectionCrud },
          { key: "/crud/feature/large-table", path: "/crud/feature/large-table", title: ["1000 行 × 100 列", "1000 rows × 100 columns"], icon: TableProperties, component: LargeTableCrud },
        ],
      },
      {
        key: "crud-form",
        title: ["表单", "Forms"],
        icon: FormInput,
        children: [
          { key: "/crud/form/modes", path: "/crud/form/modes", title: ["新增与编辑配置", "Create and edit modes"], icon: FormInput, component: () => import("@fast-crud/fn-admin-shared/views/crud/form/modes/index.vue") },
          { key: "/crud/form/validation", path: "/crud/form/validation", title: ["表单校验与布局", "Form validation"], icon: ClipboardCheck, component: () => import("@fast-crud/fn-admin-shared/views/crud/form/validation/index.vue") },
          { key: "/crud/form/conditional", path: "/crud/form/conditional", title: ["条件表单", "Conditional forms"], icon: GitBranch, component: ConditionalFormCrud },
          { key: "/crud/form/slots", path: "/crud/form/slots", title: ["表单插槽", "Form slots"], icon: Settings2, component: FormSlotsCrud },
        ],
      },
      {
        key: "crud-component",
        title: ["组件", "Components"],
        icon: Settings2,
        children: [
          { key: "/crud/component/text", path: "/crud/component/text", title: ["文本", "Text"], icon: Type, component: () => import("@fast-crud/fn-admin-shared/views/components/text/index.vue") },
          { key: "/crud/component/button", path: "/crud/component/button", title: ["按钮", "Button"], icon: MousePointerClick, component: () => import("@fast-crud/fn-admin-shared/views/components/button/index.vue") },
          { key: "/crud/component/select", path: "/crud/component/select", title: ["下拉选择", "Select"], icon: ListFilter, component: () => import("@fast-crud/fn-admin-shared/views/components/select/index.vue") },
          { key: "/crud/component/radio", path: "/crud/component/radio", title: ["单选组", "Radio"], icon: CircleDot, component: () => import("@fast-crud/fn-admin-shared/views/components/radio/index.vue") },
          { key: "/crud/component/checkbox", path: "/crud/component/checkbox", title: ["复选组", "Checkbox"], icon: CircleCheck, component: () => import("@fast-crud/fn-admin-shared/views/components/checkbox/index.vue") },
          { key: "/crud/component/switch", path: "/crud/component/switch", title: ["开关", "Switch"], icon: ToggleRight, component: () => import("@fast-crud/fn-admin-shared/views/components/switch/index.vue") },
          { key: "/crud/component/table-select", path: "/crud/component/table-select", title: ["表格选择", "Table select"], icon: Table2, component: () => import("@fast-crud/fn-admin-shared/views/components/table-select/index.vue") },
        ],
      },
    ],
  },
  { key: "/components/table-buttons", path: "/components/table-buttons", title: ["组件对比", "Component comparison"], icon: Settings, component: ComponentComparisonView },
  { key: "/components/feedback", path: "/components/feedback", title: ["消息与通知", "Messages and notifications"], icon: Bell, component: () => import("@fast-crud/fn-admin-shared/views/components/feedback/index.vue") },
  { key: "settings", title: ["系统设置", "Settings"], icon: Settings, disabled: true },
  { key: "/", path: "/", title: ["工作台", "Dashboard"], redirect: "/dashboard" },
  { key: "/overview", path: "/overview", title: ["工作台", "Dashboard"], redirect: "/dashboard" },
  { key: "/crud/basic", path: "/crud/basic", title: ["基础列表", "Basic list"], redirect: "/crud/basis/basic" },
  { key: "/crud/mock", path: "/crud/mock", title: ["请求 Mock", "Request mock"], redirect: "/crud/basis/request-mock" },
  { key: "/crud/compute", path: "/crud/compute", title: ["动态计算", "Dynamic calculations"], redirect: "/crud/basis/compute" },
  { key: "/crud/dictionary", path: "/crud/dictionary", title: ["字典与筛选", "Dictionary and filters"], redirect: "/crud/dict/credentials" },
  { key: "/crud/selection", path: "/crud/selection", title: ["跨页批量操作", "Cross-page batch actions"], redirect: "/crud/feature/selection" },
  { key: "/crud/conditional-form", path: "/crud/conditional-form", title: ["条件表单", "Conditional forms"], redirect: "/crud/form/conditional" },
  { key: "/crud/form-slots", path: "/crud/form-slots", title: ["表单插槽", "Form slots"], redirect: "/crud/form/slots" },
];

function toRouteRecords(config: AdminPageConfig[]): RouteRecordRaw[] {
  return config.flatMap(({ path, title, component, redirect, children }) => [
    ...(path && (component || redirect) ? [{ path, component, redirect, meta: { title } } as RouteRecordRaw] : []),
    ...(children ? toRouteRecords(children) : []),
  ]);
}

export const adminMenuConfig = adminPageConfig.filter(page => !page.path || page.component || page.children);
export const adminRouteRecords = toRouteRecords(adminPageConfig);
