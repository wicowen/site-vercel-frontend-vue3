import { createI18n } from "vue-i18n"
import en from "./lang/en-US.json"
import zh from "./lang/zh-TW.json"

// const i18n = createI18n({
//   legacy:false,
//   locale: localStorage.getItem('language') || navigator.language.slice(0, 2),
//   messages: {
//     zh,
//     en,
//   },
// });

type MessageSchema = typeof zh

const i18n = createI18n<[MessageSchema], 'zh-TW' | 'en-US'>({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'zh-TW',
  globalInjection: true,
  messages: {
    'zh-TW': zh,
    'en-US': en
  }
})

export default i18n;
