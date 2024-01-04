import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import i18n from './plugins/i18n'

import ElementPlus from 'element-plus'
// import en from 'element-plus/dist/locale/en.mjs'
// import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// if you're using CDN, please remove this line.
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

// import './assets/main.css'
import './assets/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.use(ElementPlus)
// app.use(ElementPlus, {
//   locale: en,
// })

app.use(FloatingVue)
app.mount('#app')

// import { setupCalendar } from 'v-calendar';

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
