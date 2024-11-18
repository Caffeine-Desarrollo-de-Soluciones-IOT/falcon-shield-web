<script setup lang="ts">
import { computed, ref } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toastService = useToast();

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  type: t('contact.typeOptions.supportType')
});

const typeOptions = computed(() => [
  { name: t('contact.typeOptions.supportType'), code: t('contact.typeOptions.supportType') },
  { name: t('contact.typeOptions.deviceSetup'), code: t('contact.typeOptions.deviceSetup') },
  { name: t('contact.typeOptions.subscriptions'), code: t('contact.typeOptions.subscriptions') },
  { name: t('contact.typeOptions.others'), code: t('contact.typeOptions.others') }
]);

const handleSubmit = () => {
  toastService.add({
    severity: 'success',
    summary: t('contact.toast.successMessage'),
    detail: t('contact.toast.successDetail'),
    life: 3000
  });

  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
    type: t('contact.typeOptions.supportType')
  };
};

const teamMembers = computed(() => [
  {
    name: t('contact.teamMembers[0].name'),
    role: t('contact.teamMembers[0].role'),
    email: t('contact.teamMembers[0].email'),
    schedule: t('contact.teamMembers[0].schedule'),
    description: t('contact.teamMembers[0].description')
  },
  {
    name: t('contact.teamMembers[1].name'),
    role: t('contact.teamMembers[1].role'),
    email: t('contact.teamMembers[1].email'),
    schedule: t('contact.teamMembers[1].schedule'),
    description: t('contact.teamMembers[1].description')
  },
  {
    name: t('contact.teamMembers[2].name'),
    role: t('contact.teamMembers[2].role'),
    email: t('contact.teamMembers[2].email'),
    schedule: t('contact.teamMembers[2].schedule'),
    description: t('contact.teamMembers[2].description')
  },
  {
    name: t('contact.teamMembers[3].name'),
    role: t('contact.teamMembers[3].role'),
    email: t('contact.teamMembers[3].email'),
    schedule: t('contact.teamMembers[3].schedule'),
    description: t('contact.teamMembers[3].description')
  },
  {
    name: t('contact.teamMembers[4].name'),
    role: t('contact.teamMembers[4].role'),
    email: t('contact.teamMembers[4].email'),
    schedule: t('contact.teamMembers[4].schedule'),
    description: t('contact.teamMembers[4].description')
  }
]);
</script>

<template>
  <div class="card">
    <Toast ref="toast" />

    <div class="font-semibold text-xl mb-4">{{ $t('contact.team') }}</div>
    <p class="mb-4">{{ $t('contact.description') }}</p>

    <!-- Team Members Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div class="border p-4 rounded shadow" v-for="member in teamMembers" :key="member.email">
        <h3 class="font-semibold">{{ member.name }}</h3>
        <p class="text-sm text-gray-600 mb-2">{{ member.role }}</p>
        <p><strong>{{ $t('contact.email') }}:</strong> {{ member.email }}</p>
        <p><strong>{{ $t('contact.schedule') }}:</strong> {{ member.schedule }}</p>
        <p class="text-sm text-gray-500 mt-2">{{ member.description }}</p>
      </div>
    </div>

    <!-- Contact Form -->
    <Divider />
    <Fluid>
      <div class=" flex flex-col gap-4 w-full">
        <div class="font-semibold text-xl">{{ $t('contact.formTitle') }}</div>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex flex-wrap gap-2 w-full">
            <label for="fullname">{{ $t('contact.fullname') }}</label>
            <InputText id="fullname" type="text" v-model="formData.name" required />
          </div>
          <div class="flex flex-wrap gap-2 w-full">
            <label for="email">{{ $t('contact.email') }}</label>
            <InputText id="email" type="email" v-model="formData.email" required />
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex flex-wrap gap-2 w-full">
            <label for="type">{{ $t('contact.type') }}</label>
            <Select id="type" v-model="formData.type" :options="typeOptions" optionLabel="name" placeholder="Select One"
              class="w-full"></Select>
          </div>
          <div class="flex flex-wrap gap-2 w-full">
            <label for="subject">{{ $t('contact.subject') }}</label>
            <InputText id="subject" type="text" v-model="formData.subject" required />
          </div>
        </div>

        <div class="flex flex-wrap">
          <label for="message">{{ $t('contact.message') }}</label>
          <Textarea id="message" rows="4" v-model="formData.message" required />
        </div>
      </div>
      <Button :label="$t('contact.sendMessage')" icon="pi pi-send" class="mt-6" @click="handleSubmit" />
    </Fluid>
  </div>
</template>
