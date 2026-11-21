import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Fast Crud Next',
  description: '基于 Vue 3 和 TypeScript 的 FnCrud 组件库',
  rewrites: {
    'zh/:path*': ':path*',
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/getting-started' },
          { text: '用法', link: '/recipes/paging' },
          { text: 'API', link: '/api/fn-crud' },
          { text: '示例', link: '/demos/admin' },
        ],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: '快速开始', link: '/guide/getting-started' },
              { text: '核心配置', link: '/guide/configuration' },
              { text: '字段类型', link: '/guide/column-types' },
              { text: '全局安装与语言', link: '/guide/installation' },
            ],
          },
          {
            text: '功能用法',
            items: [
              { text: '分页、搜索与排序', link: '/recipes/paging' },
              { text: '新增、编辑和删除', link: '/recipes/mutations' },
              { text: '表单联动、校验与插槽', link: '/recipes/forms' },
              { text: '字典和跨页选择', link: '/recipes/selection' },
            ],
          },
          {
            text: 'API 参考',
            items: [
              { text: 'FnCrud', link: '/api/fn-crud' },
              { text: '请求', link: '/api/requests' },
              { text: '表单与弹窗', link: '/api/forms' },
              { text: '表格、选择与偏好', link: '/api/table' },
              { text: '基础组件', link: '/api/components' },
            ],
          },
          {
            text: '集成与维护',
            items: [
              { text: '主题集成', link: '/themes/overview' },
              { text: 'Admin 示例', link: '/demos/admin' },
              { text: 'Agent 查阅索引', link: '/agent-index' },
              { text: '文档维护', link: '/development/documentation' },
            ],
          },
        ],
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '未找到结果',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
        outline: { label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        returnToTopLabel: '返回顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '外观',
        langMenuLabel: '切换语言',
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      description: 'FnCrud components for Vue 3 and TypeScript',
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/fast-crud/fast-crud-next' },
    ],
  },
})
