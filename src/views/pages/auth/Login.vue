<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout';
import LanguageSelector from '@/layout/LanguageSelector.vue';
import { AuthService } from '@/service/AuthService';
import { useUserProfileStore } from '@/store/userProfileStore';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const userProfileStore = useUserProfileStore();
const { toggleDarkMode, isDarkTheme } = useLayout();

const email = ref('');
const password = ref('');
const checked = ref(false);
const loginError = ref<string>()
const loginInProgress = ref(false);
const googleLoginInProgress = ref(false);

async function loginWithGoogle() {
  try {
    googleLoginInProgress.value = true;
    await AuthService.loginWithGoogle(route.query.then?.toString());
  } catch (err) {
    loginError.value = (err as any).message || 'Error logging in with Google';
  } finally {
    googleLoginInProgress.value = false;
  }
}

async function login() {
  try {
    loginInProgress.value = true;
    await AuthService.loginWithCredentials(email.value, password.value);

    //verify if the user has a user profile
    userProfileStore.checkUserProfile();

    //handle redirect after login
    const redirectTo = route.query.then?.toString() || '/home';
    router.push(redirectTo);
  } catch (err) {
    loginError.value = (err as any).message || 'Error logging in';
  } finally {
    loginInProgress.value = false;
  }
}

function register() {
  AuthService.register();
}
</script>

<template>
   <div class="fixed flex gap-4 top-8 right-8">
      <LanguageSelector />
      <Button type="button" @click="toggleDarkMode" rounded :icon="isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />
    </div>

  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
          <div class="flex justify-center mb-8">
            <img src="/logo.png" alt="logo" width="100" />
          </div>

          <div class="text-center mb-8">
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">{{ $t('login.title') }}</div>
            <span class="text-muted-color font-medium">{{ $t('login.subtitle') }}</span>
            <div class="flex justify-center items-center mt-8">
              <Button
                :icon="googleLoginInProgress ? 'pi pi-spin pi-spinner' : 'pi pi-google'"
                :disabled="loginInProgress || googleLoginInProgress"
                size="large"
                raised
                rounded
                @click="loginWithGoogle()"
              />
            </div>
          </div>

          <Divider align="center">
            <span class="text-muted-color font-medium">{{ $t('login.or') }}</span>
          </Divider>

          <div>
            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">{{ $t('login.email') }}</label>
            <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">{{ $t('login.password') }}</label>
            <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
              <div class="flex items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">{{ $t('login.rememberMe') }}</label>
              </div>
              <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">{{ $t('login.forgotPassword') }}</span>
            </div>

            <div v-if="loginError" class="text-red-500 text-sm mb-4">{{ loginError }}</div>
            <Button
              :label="loginInProgress ? $t('login.buttons.signingIn') : $t('login.buttons.signIn')"
              :disabled="googleLoginInProgress || loginInProgress"
              class="w-full"
              @click="login()"
            />
            <Button :label="$t('login.buttons.signUp')" outlined class="w-full mt-3" @click="register()"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
