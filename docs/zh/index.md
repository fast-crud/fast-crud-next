---
layout: home
markdownStyles: true
hero:
  name: Fast Crud Next
  text: 用 Vue 3 搭建 CRUD 页面
  tagline: 自带表格、搜索和表单。用一份响应式配置接入后端，也能融入现有 UI 主题。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: API 参考
      link: /api/fn-crud
features:
  - title: 基础组件自带
    details: 表格、搜索、表单、弹窗和通知开箱可用，可直接接入 Vue 3 应用。
    link: /guide/getting-started
  - title: 一份响应式配置
    details: 声明字段和请求即可搭建列表，分页与行选择状态可在页面里直接读取。
    link: /guide/configuration
  - title: 字段类型与字典
    details: 为同一字段配置表格、搜索和表单，复用文本、数字、字典下拉等类型。
    link: /guide/column-types
  - title: 动态联动与自定义
    details: 按当前行或表单值控制字段显隐和禁用，用 TSX 或插槽扩展单元格和弹窗。
    link: /recipes/forms
  - title: 三套 UI 主题适配
    details: 可按需跟随 Ant Design Vue、Element Plus 或 Naive UI 的主题。
    link: /themes/overview
  - title: 跨页选择与列表偏好
    details: 翻页可保留选中项，调整后的列宽、列顺序、每页条数和密度可保存。
    link: /api/table
---

## 开发时常用

- 开始第一个页面。[快速开始](./guide/getting-started.md) · [接入 Django](./guide/django.md)
- 替换已有列表。[从 Fast Crud 迁移](./guide/from-fast-crud.md)
- 配置字段和交互。[列与动态配置](./api/columns.md) · [分页搜索](./recipes/paging.md) · [表单联动](./recipes/forms.md) · [按钮与操作区](./api/actions.md)
- 对照可运行源码。[Admin 示例](./demos/admin.md) · [主题集成](./themes/overview.md) · [Agent 查阅索引](./agent-index.md)
