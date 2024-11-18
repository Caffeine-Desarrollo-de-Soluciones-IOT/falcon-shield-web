<script setup lang="ts">
import type { ILocale } from '@/interfaces/common';
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const selectedLocale = ref<ILocale | null>(null);
const locales = ref([
  { name: 'EN', flagCode: 'UK', value: 'en' },
  { name: 'ES', flagCode: 'ES', value: 'es' },
  { name: 'FR', flagCode: 'FR', value: 'fr' },
]);

//recovers the selected locale from local storage
onMounted(() => {
  const savedLocale = localStorage.getItem('locale');
  const defaultLocale = locales.value[0];

  selectedLocale.value = locales.value.find((l) => l.value === savedLocale) || defaultLocale;
  locale.value = selectedLocale.value.value;
});

//sync the lang switch with local storage
watch(selectedLocale, (newLocale) => {
  if (newLocale) {
    locale.value = newLocale.value;
    localStorage.setItem('locale', newLocale.value);
  }
});
</script>

<template>
  <Select v-model="selectedLocale" :options="locales" optionLabel="name" checkmark>
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center">
        <img :alt="slotProps.value.name" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
          :class="`mr-2 flag flag-${slotProps.value.flagCode.toLowerCase()}`" style="width: 18px" />
        <div>{{ slotProps.value.name }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="flex items-center">
        <img :alt="slotProps.option.name" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
          :class="`mr-2 flag flag-${slotProps.option.flagCode.toLowerCase()}`" style="width: 18px" />
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
    <template #dropdownicon>
      <i class="pi pi-globe" />
    </template>
  </Select>
</template>
