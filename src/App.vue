<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useLayout } from './layout/composables/layout';

const { toggleDarkMode, isDarkTheme } = useLayout();

//load dark mode from local storage
onMounted(() => {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'true') {
    toggleDarkMode();
  }
});

//save dark mode to local storage
watch(isDarkTheme, () => {
  localStorage.setItem('darkMode', String(isDarkTheme.value));
});
</script>

<template>
  <router-view />
</template>

<style scoped></style>
