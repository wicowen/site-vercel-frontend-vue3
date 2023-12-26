import { createI18n } from "vue-i18n";
import zh from "./zh-TW.json";
import en from "./en-US.json";

const i18n = createI18n({
  legacy:false,
  locale: localStorage.getItem('language') || navigator.language.slice(0, 2),
  messages: {
    zh,
    en,
  },
});

export default i18n;
