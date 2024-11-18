import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

export  const i18n = createI18n({
  legacy: false, //use composition api
  locale: 'en', //default locale
  fallbackLocale: 'en', //if locale not found, fallback to EN
  availableLocales: ['en', 'es', 'fr'],
  messages: messages,
  globalInjection: true,
});
