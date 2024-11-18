<script setup lang="ts">
import { PaymentService } from '@/service/PaymentService';
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRoute } from 'vue-router';

const route = useRoute();
const toast = useToast();
const loading = ref(false);
const successDialog = ref(false);
const errorDialog = ref(false);

onMounted(() => {
  const query = route.query;
  if (query.success === 'true') {
    successDialog.value = true;
    localStorage.setItem('subscription', 'true');
  } else if (query.canceled === 'true') {
    errorDialog.value = true;
  }
});

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
          {{ $t('pricingPlans.title') }}
        </div>
        <span class="text-muted-color text-2xl"> {{ $t('pricingPlans.subtitle') }} </span>
      </div>

      <div class="flex justify-center mb-3">
        <Button
          :label="$t('pricingPlans.viewMySubscription')"
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
                <span class="text-surface-600 dark:text-surface-200">{{ $t('pricingPlans.free.priceSuffix') }}</span>
              </div>
              <Button :label="$t('pricingPlans.free.button')" disabled></Button>
            </div>
            <Divider class="w-full bg-surface-200"></Divider>
            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">{{ $t('pricingPlans.free.features.manageProperties') }}</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">{{ $t('pricingPlans.free.features.manageAreas') }}</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">{{ $t('pricingPlans.free.features.reviewDeviceEvents') }}</span>
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
                <span class="text-surface-600 dark:text-surface-200">{{ $t('pricingPlans.free.priceSuffix') }}</span>
              </div>
              <Button
                :label="$t('pricingPlans.gold.button')"
                @click="handleSubscribe('price_1QBfxRGThVlbgNYkYOWdwYcD')"
                :loading="loading"
              ></Button>
            </div>
            <Divider class="w-full bg-surface-200"></Divider>
            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">{{ $t('pricingPlans.gold.features.allFreeFeatures') }}</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">{{ $t('pricingPlans.gold.features.unlimitedDevices') }}</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">{{ $t('pricingPlans.gold.features.support') }}</span>
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
                <span class="text-surface-600 dark:text-surface-200">{{ $t('pricingPlans.free.priceSuffix') }}</span>
              </div>
              <Button
                :label="$t('pricingPlans.black.button')"
                @click="handleSubscribe('price_1QBfz8GThVlbgNYkX5Q9Usgd')"
                :loading="loading"
              ></Button>
            </div>
            <Divider class="w-full bg-surface-200"></Divider>
            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">{{ $t('pricingPlans.black.features.allGoldFeatures') }}</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">{{ $t('pricingPlans.black.features.aiAnalytics') }}</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">{{ $t('pricingPlans.black.features.customReports') }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="successDialog" header="Success!" modal>
    <p>Suscripción realizada con éxito</p>
    <template #footer>
      <Button label="OK" @click="successDialog = false" class="p-button-success" />
    </template>
  </Dialog>

  <Dialog v-model:visible="errorDialog" header="Error :(" modal>
    <p>Hubo un error al procesar la suscripción</p>
    <template #footer>
      <Button label="OK" @click="errorDialog = false" class="p-button-danger" />
    </template>
  </Dialog>
</template>
