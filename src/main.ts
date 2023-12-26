// import './assets/main.css'
import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import i18n from './plugins/i18n'
import ElementPlus from 'element-plus'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')


// import FloatingVue from 'floating-vue'
// import 'floating-vue/dist/style.css'
// import { setupCalendar } from 'v-calendar';
