import { createApp } from 'vue'
import './admin-style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { router } from './router'
import './element-theme.css'
import '@fast-crud/fn-admin-shared/mock'

createApp(App).use(ElementPlus).use(router).mount('#app')
