<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppMenuItem from './AppMenuItem.vue'

const { t } = useI18n()

const model = ref([
  {
    label: t('menu.principal'),
    items: [
      { label: t('menu.home'), icon: 'pi pi-fw pi-home', to: '/home' },
      { label: t('menu.myDevices'), icon: 'pi pi-fw pi-mobile', to: '/my-devices' },
      { label: t('menu.myProperties'), icon: 'pi pi-fw pi-building', to: '/my-properties' },
      { label: t('menu.events'), icon: 'pi pi-fw pi-exclamation-circle', to: '/events' }
    ]
  },
  {
    label: t('menu.helpAndSupport'),
    items: [
      { label: t('menu.assistance'), icon: 'pi pi-fw pi-question-circle', to: '/help' },
      { label: t('menu.contact'), icon: 'pi pi-fw pi-envelope', to: '/contact' }
    ]
  },
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item :item="item" :index="i"></app-menu-item>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
