<script setup lang="ts">
import { ref } from 'vue'
import AppMenuItem from './AppMenuItem.vue'

const model = ref([
  {
    label: 'Principal',
    items: [
      { label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' },
      { label: 'My devices', icon: 'pi pi-fw pi-mobile', to: '/my-devices' },
      { label: 'My properties', icon: 'pi pi-fw pi-building', to: '/my-properties' },
      { label: 'Events', icon: 'pi pi-fw pi-exclamation-circle', to: '/events' }
    ]
  },
  {
    label: 'Help & Support',
    items: [
      { label: 'Assistance', icon: 'pi pi-fw pi-question-circle', to: '/help' },
      { label: 'Contact', icon: 'pi pi-fw pi-envelope', to: '/contact' }
    ]
  },
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item :item="item" :index="i"></app-menu-item>
      <!-- <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li> -->
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
