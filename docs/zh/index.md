---
layout: home
markdownStyles: true
hero:
  name: Fast Crud Next
  text: 快速开发 CRUD 页面
  tagline: 开发更快，运行更轻。
  image:
    src: /fast-crud-next.svg
    alt: Fast Crud Next 的表格与闪电标识
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: API 参考
      link: /api/fn-crud
features:
  - title: 快速开发
    icon: >-
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap" aria-hidden="true"><path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"></path></svg>
    details: 配置字段和请求，用一份响应式状态搭起表格、搜索、分页和增删改表单。
    link: /guide/getting-started
  - title: 原生表格
    icon: >-
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table-2" aria-hidden="true"><path d="M3 9h18"></path><path d="M9 3v18"></path><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg>
    details: 基于原生 HTML 表格渲染，减少第三方表格和适配层带来的开销。
    link: /api/table
  - title: 动态字段类型
    icon: >-
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-tree" aria-hidden="true"><path d="M8 5h13"></path><path d="M13 12h8"></path><path d="M13 19h8"></path><path d="M3 10a2 2 0 0 0 2 2h3"></path><path d="M3 5v12a2 2 0 0 0 2 2h3"></path></svg>
    details: 在运行时切换文本、数字或字典类型，表格和搜索随之更新。
    link: /guide/column-types#运行时切换
  - title: 列表偏好自动保存
    icon: >-
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks" aria-hidden="true"><path d="M13 5h8"></path><path d="M13 12h8"></path><path d="M13 19h8"></path><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path></svg>
    details: 记住列宽、列顺序、每页条数和密度，刷新后恢复用户的列表布局。
    link: /api/table#用户偏好
  - title: 动态联动与自定义
    icon: >-
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-workflow" aria-hidden="true"><rect width="8" height="8" x="3" y="3" rx="2"></rect><path d="M7 11v4a2 2 0 0 0 2 2h4"></path><rect width="8" height="8" x="13" y="13" rx="2"></rect></svg>
    details: 按当前行或表单值控制字段显隐和禁用，用 TSX 或插槽扩展单元格和弹窗。
    link: /recipes/forms
  - title: 三套 UI 主题适配
    icon: >-
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette" aria-hidden="true"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"></path><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle></svg>
    details: 可按需跟随 Ant Design Vue、Element Plus 或 Naive UI 的主题。
    link: /themes/overview
---

## 开发时常用

- 开始第一个页面。[快速开始](./guide/getting-started.md) · [项目集成](./guide/project-integration.md)
- 替换已有列表。[从 Fast Crud 迁移](./guide/from-fast-crud.md)
- 配置字段和交互。[列与动态配置](./api/columns.md) · [分页搜索](./recipes/paging.md) · [表单联动](./recipes/forms.md) · [按钮与操作区](./api/actions.md)
- 对照可运行源码。[Admin 示例](./demos/admin.md) · [主题集成](./themes/overview.md) · [Agent 查阅索引](./agent-index.md)
