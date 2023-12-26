import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import i18n from './plugins/i18n'
import ElementPlus from 'element-plus'

import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

// import './assets/main.css'
import './assets/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ElementPlus)
app.use(FloatingVue)
app.mount('#app')

// import { setupCalendar } from 'v-calendar';
