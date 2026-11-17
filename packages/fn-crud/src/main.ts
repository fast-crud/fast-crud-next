import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { installFnCrud } from './crud'

installFnCrud({ commonOptions: () => ({ table: { size: 14, density: 'comfort' } }) })

createApp(App).mount('#app')
