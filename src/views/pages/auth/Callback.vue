<script setup lang="ts">
//this component is used to handle the callback from the idp after the user has authenticated, it does the following:
//1. process any response (callback) from the idp
//2. handle possible errors
//3. redirect the user to the correct page

import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AuthService } from '../../../service/AuthService';

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  try {
    await AuthService.handleCallback();

    //route to redirect to after login (get the value from the query parameter 'then' or default to '/home')
    const redirectTo = route.query.then?.toString() ?? '/home';
    console.log('callback -> Redirecting to:', route.query.then);
    router.push(redirectTo);
  } catch (error) {
    console.error('Error processing auth callback:', error);
    router.push({ path: '/error' });
  }
});
</script>

<template>
  <div>
    <p>Signing in...</p>
  </div>
</template>
