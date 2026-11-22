import { createApp } from 'vue'
import { installFnCrud } from '@fast-crud/fast-crud-next'
import { adminCrudLocale } from '@fast-crud/fn-admin-shared/preferences'
import './admin-style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import { router } from './router'
import '@fast-crud/fn-admin-shared/mock'
installFnCrud({ locale: adminCrudLocale })

createApp(App).use(ElementPlus).use(router).mount('#app')
