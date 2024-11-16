<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';  // Importar useI18n para gestionar el idioma
import { AuthService } from '@/service/AuthService';
import { useLayout } from '@/layout/composables/layout';
import type { MenuItem } from 'primevue/menuitem';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const { locale } = useI18n();  // Accedemos a la funcionalidad de cambio de idioma

// Estado para el idioma actual
const currentLanguage = ref({ name: 'English', code: 'UK' });
const languages = ref([
  { name: 'English', code: 'UK' },
  { name: 'Español', code: 'ES' },
  { name: 'Français', code: 'FR' }
]);

const menu = ref();
const overlayMenuItems = ref<MenuItem[]>([
  {
    label: 'My account',
    icon: 'pi pi-user',
    url: AuthService.accountConsoleUrl,
    target: '_blank'
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-power-off',
    command: () => AuthService.logout()
  }
]);

const changeLanguage = (event: any) => {
  const language = event.value;  // Obtiene el valor seleccionado del evento
  currentLanguage.value = language;
  locale.value = language.code;  // Cambia el idioma en i18n
};



function toggleMenu(event: MouseEvent) {
  menu.value.toggle(event);
}
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
        <i class="pi pi-bars"></i>
      </button>
      <router-link to="/" class="layout-topbar-logo">
        <img src="/logo.png" alt="logo" width="35" />
        <span>Falcon Shield</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <Button as="router-link" label="Go Premium" icon="pi pi-star"
              class="p-button-rounded border-0 ml-4 font-light leading-tight custom-button" to="/pricing" />

      <!-- Dropdown para seleccionar el idioma -->
      <Select v-model="currentLanguage" :options="languages" optionLabel="name" checkmark @change="changeLanguage">
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center">
            <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                 :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />
            <div>{{ slotProps.value.code }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex items-center">
            <img :alt="slotProps.option.label"
                 src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                 :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
        <template #dropdownicon>
          <i class="pi pi-globe" />
        </template>
      </Select>

      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
      </div>

      <button class="layout-topbar-menu-button layout-topbar-action"
              v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-inbox"></i>
            <span>Messages</span>
          </button>
          <button type="button" class="layout-topbar-action" @click="toggleMenu">
            <i class="pi pi-user"></i>
            <span>Profile</span>
          </button>
          <Menu ref="menu" :model="overlayMenuItems" :popup="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.custom-button {
  background: linear-gradient(45deg, #facc15, #fbbf24) !important;
  color: #000000 !important;
  border: none !important;
  transition: all 0.3s ease;
}
.custom-button:hover {
  background: linear-gradient(45deg, #fbbf24, #f59e0b) !important;
  color: #000000 !important;
}
</style>
