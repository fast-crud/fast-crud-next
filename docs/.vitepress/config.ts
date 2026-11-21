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
          { text: '示例', link: '/demos/admin' },
        ],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: '快速开始', link: '/guide/getting-started' },
              { text: '核心配置', link: '/guide/configuration' },
            ],
          },
          {
            text: '示例',
            items: [{ text: 'Admin 示例', link: '/demos/admin' }],
          },
        ],
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
