<script setup lang="ts">
import type { FalconShieldError } from '@/config/FalconShieldError';
import type { IUserProfileRequestDto } from '@/interfaces/userProfile';
import { UserProfileService } from '@/service/UserProfileService';
import { useUserProfileStore } from '@/store/userProfileStore';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const createUserProfileDialogVisible = ref(false);
const submitted = ref(false);
const newUserProfile = ref<IUserProfileRequestDto>({} as IUserProfileRequestDto);
const creatingUserProfile = ref(false);
const occupations = [
  { label: 'Owner', value: 'Owner' },
  { label: 'Tenant', value: 'Tenant' },
  { label: 'Lessee', value: 'Lessee' },
  { label: 'Other', value: 'Other' }
];
const userProfileStore = useUserProfileStore();

onMounted(() => {
  openDialog();
});

async function handleCreateUserProfile() {
  submitted.value = true;

  if (newUserProfile.value.dni && newUserProfile.value.occupation) {
    try {
      creatingUserProfile.value = true;
      await UserProfileService.createUserProfile(newUserProfile.value);
      userProfileStore.setProfileCreated(); //update pinia store

      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'User profile created',
        life: 3000
      });

      hideDialog();
      router.push({ path: '/home' });
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: (error as FalconShieldError).message,
        detail: (error as FalconShieldError).details,
        life: 3000
      });
    } finally {
      creatingUserProfile.value = false;
    }
  }
}

function openDialog() {
  newUserProfile.value = {} as IUserProfileRequestDto;
  submitted.value = false;
  createUserProfileDialogVisible.value = true;
}

function hideDialog() {
  createUserProfileDialogVisible.value = false;
  submitted.value = false;
  newUserProfile.value = {} as IUserProfileRequestDto;
}
</script>

<template>
  <Dialog
    v-model:visible="createUserProfileDialogVisible"
    :style="{ width: '450px' }"
    header="We need some additional information"
    :modal="true"
    :closable="false"
  >
    <div class="flex flex-col gap-6">
      <div>
        <label for="dni" class="block font-bold mb-3">DNI</label>
        <InputText
          id="dni"
          v-model.trim="newUserProfile.dni"
          required="true"
          autofocus
          :invalid="submitted && !newUserProfile.dni"
          fluid
        />
        <small v-if="submitted && !newUserProfile.dni" class="text-red-500">DNI is required</small>
      </div>
      <div>
        <label for="occupation" class="block font-bold mb-3">Occupation</label>
        <Select
          id="occupation"
          v-model="newUserProfile.occupation"
          :options="occupations"
          optionLabel="label"
          optionValue="value"
          placeholder="Select an Occupation"
          fluid
        ></Select>
        <small v-if="submitted && !newUserProfile.occupation" class="text-red-500">Occupation is required</small>
      </div>
    </div>
    <template #footer>
      <Button
        label="Save"
        :icon="creatingUserProfile ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
        :disabled="creatingUserProfile"
        @click="handleCreateUserProfile()"
      />
    </template>
  </Dialog>
</template>
