import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import i18n_menu from '@/multilingual/i18n_menu';


import '@/assets/styles.scss';
import '@/assets/tailwind.css';
const app = createApp(App);
const pinia = createPinia();

const mergeTranslations = (components: any[]) => {
  const languages = ['en', 'es', 'fr'];
  const merged: Record<string, Record<string, string>> = {};

  languages.forEach(lang => {
    merged[lang] = {};
    components.forEach(component => {
      merged[lang] = { ...merged[lang], ...component[lang] };
    });
  });

  return merged;
};

// Combina las traducciones
const messages = mergeTranslations([i18n_menu /* agrega más componentes aquí */]);

const i18n = createI18n({
  legacy: false, // Usa la nueva API (Composition API)
  locale: 'fr',  // Idioma por defecto
  messages
});



app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark'
    }
  }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(i18n);
app.mount('#app');
