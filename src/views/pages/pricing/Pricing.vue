<script setup lang="ts">
import { PaymentService } from '@/service/PaymentService';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const loading = ref(false);

async function handleSubscribe(priceId: string) {
  try {
    loading.value = true;
    const res = await PaymentService.newSubscription(priceId);
    res.data && window.location.replace(res.data);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as Error).message,
      life: 3000
    });
  } finally {
    loading.value = false;
  }
}

async function handleGetSubscriptionDetails() {
  try {
    loading.value = true;
    const res = await PaymentService.getSubscriptionDetails();
    res.data && window.location.replace(res.data);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as Error).message,
      life: 3000
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div className="card">
    <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
      <div class="text-center mb-6">
        <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">
          Pricing Plans
        </div>
        <span class="text-muted-color text-2xl"> Choose a plan that works for you </span>
      </div>

      <div class="flex justify-center mb-3">
        <Button
          label="View my subscription"
          class="bg-primary text-surface-0"
          icon="pi pi-external-link"
          @click="handleGetSubscriptionDetails"
          :loading="loading"
        ></Button>
      </div>

      <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
        <div class="col-span-12 lg:col-span-4 p-0 md:p-4">
          <div
            class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all"
            style="border-radius: 10px"
          >
            <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Free</div>
            <img src="/logo.png" class="w-5/12 mx-auto" alt="free" />
            <div class="my-8 flex flex-col items-center gap-4">
              <div class="flex items-center">
                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">$0</span>
                <span class="text-surface-600 dark:text-surface-200">per month</span>
              </div>
              <Button label="You are here" disabled></Button>
            </div>
            <Divider class="w-full bg-surface-200"></Divider>
            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">Manage your properties</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">Manage your areas</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">Review the device events</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
          <div
            class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all"
            style="border-radius: 10px"
          >
            <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Gold</div>
            <img src="/logo-gold.png" class="w-5/12 mx-auto" alt="startup" />

            <div class="my-8 flex flex-col items-center gap-4">
              <div class="flex items-center">
                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0"
                  >$10</span
                >
                <span class="text-surface-600 dark:text-surface-200">per month</span>
              </div>
              <Button
                label="Get Started"
                @click="handleSubscribe('price_1QBfxRGThVlbgNYkYOWdwYcD')"
                :loading="loading"
              ></Button>
            </div>
            <Divider class="w-full bg-surface-200"></Divider>
            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">All Free features</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">Unlimited Devices</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">24/7 Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
          <div
            class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all"
            style="border-radius: 10px"
          >
            <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Black</div>
            <img src="/logo-black.png" class="w-5/12 mx-auto" alt="startup" />

            <div class="my-8 flex flex-col items-center gap-4">
              <div class="flex items-center">
                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0"
                  >$20</span
                >
                <span class="text-surface-600 dark:text-surface-200">per month</span>
              </div>
              <Button
                label="Get Started"
                @click="handleSubscribe('price_1QBfz8GThVlbgNYkX5Q9Usgd')"
                :loading="loading"
              ></Button>
            </div>
            <Divider class="w-full bg-surface-200"></Divider>
            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">All Gold Features</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">AI Powered Analytics</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">Custom Reports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
