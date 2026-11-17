import { createRouter, createWebHashHistory } from 'vue-router'
import AdminLayout from './layouts/AdminLayout.vue'
import DashboardView from './views/DashboardView.vue'
import BasicCrudView from './views/crud/basis/basic/index.vue'
import ComputeCrudView from './views/crud/basis/compute/index.vue'
import SettingsView from './views/SettingsView.vue'
import ComponentComparisonView from './views/ComponentComparisonView.vue'
import DictionaryCrud from '@fast-crud/fn-admin-shared/views/DictionaryCrud.vue'
import SelectionCrud from '@fast-crud/fn-admin-shared/views/SelectionCrud.vue'
import ConditionalFormCrud from '@fast-crud/fn-admin-shared/views/ConditionalFormCrud.vue'
import MockCrud from '@fast-crud/fn-admin-shared/views/MockCrud.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      redirect: '/dashboard',
      children: [
        { path: 'dashboard', name: 'dashboard', component: DashboardView, meta: { title: '工作台' } },
        { path: 'crud/basic', name: 'basic-crud', component: BasicCrudView, meta: { title: '基础列表' } },
        { path: 'crud/mock', name: 'mock-crud', component: MockCrud, meta: { title: '请求 Mock' } },
        { path: 'crud/compute', name: 'compute-crud', component: ComputeCrudView, meta: { title: '动态计算' } },
        { path: 'crud/dictionary', name: 'dictionary-crud', component: DictionaryCrud, meta: { title: '字典与筛选' } },
        { path: 'crud/selection', name: 'selection-crud', component: SelectionCrud, meta: { title: '跨页批量操作' } },
        { path: 'crud/conditional-form', name: 'conditional-form-crud', component: ConditionalFormCrud, meta: { title: '条件表单' } },
        { path: 'components/table-buttons', name: 'component-comparison', component: ComponentComparisonView, meta: { title: '组件对比' } },
        { path: 'settings', name: 'settings', component: SettingsView, meta: { title: '系统设置' } },
      ],
    },
  ],
})
