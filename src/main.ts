import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

<<<<<<< HEAD


import '@/assets/styles.scss'
import '@/assets/tailwind.css'
=======
import '@/assets/styles.scss';
import '@/assets/tailwind.css';
>>>>>>> 36b8f26f93a34ee829877111f94070909f5d3c3c

const app = createApp(App);
const pinia = createPinia();

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

app.mount('#app');
