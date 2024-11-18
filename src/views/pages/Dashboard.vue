<script setup lang="ts">
import type { IArea } from '@/interfaces/areas';
import type { IRegisteredDevice } from '@/interfaces/devices';
import type { IDeviceEvent } from '@/interfaces/events';
import type { IProperty } from '@/interfaces/properties';
import { AreaService } from '@/service/AreaService';
import { AuthService } from '@/service/AuthService';
import { DeviceService } from '@/service/DeviceService';
import { EventService } from '@/service/EventService';
import { PropertyService } from '@/service/PropertyService';
import { User } from 'oidc-client-ts';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface FetchDataParams<T> {
  serviceMethod: () => Promise<{ data: T[] }>;
  loadingFlag: { value: boolean };
  registeredList: { value: T[] };
  countVar: { value: number };
  errorMessage: string;
}

const toast = useToast();

const events = ref<IDeviceEvent[]>([]);
const loading = ref(false);
const user = ref<User | null>(null);

// Properties card
const loadingProperties = ref(false);
const registeredProperties = ref<IProperty[]>([]);
const propertiesCount = ref(0);

// Areas card
const loadingAreas = ref(false);
const registeredAreas = ref<IArea[]>([]);
const areasCount = ref(0);

// Devices card
const loadingDevices = ref(false);
const registeredDevices = ref<IRegisteredDevice[]>([]);
const devicesCount = ref(0);

// Chart
const chartData = ref();
const chartOptions = ref();

onMounted(async () => {
  await fetchRegisteredProperties();
  await fetchRegisteredAreas();
  await fetchRegisteredDevices();
  //await fetchRegisteredEvents();
  AuthService.getUser().then((data) => (user.value = data))
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
  console.log("chartData: ", chartData)
  console.log('Properties:', registeredProperties.value);
  console.log('Devices:', registeredDevices.value);

});

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const propertyDeviceCounts = registeredProperties.value.map(property => {
    const deviceCount = registeredDevices.value.filter(device => device.area.property.id === property.id).length;
    return { propertyName: property.name, deviceCount };
  });

  return {
    labels: propertyDeviceCounts.map(item => item.propertyName),
    datasets: [
      {
        label: 'Cantidad de Dispositivos',
        data: propertyDeviceCounts.map(item => item.deviceCount),
        backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
        borderColor: documentStyle.getPropertyValue('--p-primary-500'),
        borderWidth: 1,
        fill: false
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary,
          stepSize: 1
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
};

function getGreeting() {
  const hour = new Date().getHours();
  const userName = user.value?.profile.name ?? '--';

  if (hour >= 5 && hour < 12) {
    return t('dashboard.greeting.morning', { name: userName }) + ' 🌤️';
  }
  if (hour >= 12 && hour < 18) {
    return t('dashboard.greeting.afternoon', { name: userName }) + ' ⛅️';
  }
  return t('dashboard.greeting.evening', { name: userName }) + ' 🌙';
}


async function fetchData<T>({
  serviceMethod,
  loadingFlag,
  registeredList,
  countVar,
  errorMessage
}: FetchDataParams<T>): Promise<void> {
  loadingFlag.value = true;

  try {
    const response = await serviceMethod();
    registeredList.value = response.data.slice(0, 6);
    countVar.value = response.data.length;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000
    });
  } finally {
    loadingFlag.value = false;
  }
}

async function fetchRegisteredProperties(): Promise<void> {
  await fetchData({
    serviceMethod: PropertyService.getPropertiesSmall,
    loadingFlag: loadingProperties,
    registeredList: registeredProperties,
    countVar: propertiesCount,
    errorMessage: 'Error fetching properties'
  });
}

async function fetchRegisteredAreas(): Promise<void> {
  await fetchData({
    serviceMethod: AreaService.getAreas,
    loadingFlag: loadingAreas,
    registeredList: registeredAreas,
    countVar: areasCount,
    errorMessage: 'Error fetching areas'
  });
}

async function fetchRegisteredDevices(): Promise<void> {
  await fetchData({
    serviceMethod: DeviceService.getRegisteredDevices,
    loadingFlag: loadingDevices,
    registeredList: registeredDevices,
    countVar: devicesCount,
    errorMessage: 'Error fetching areas'
  });
}

async function fetchRegisteredEvents() {
  try {
    loading.value = true;
    const res = await EventService.getEvents(1);
    events.value = res.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error fetching events',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div className="card">
    <div class="font-semibold text-xl">{{ getGreeting() }}</div>
  </div>

  <div class="grid grid-cols-12 gap-8">
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">{{ $t('dashboard.cards.propertiesTitle') }}</span>
            <ProgressSpinner v-if="loadingProperties" style="width: 30px; height: 50px" fill="transparent" />
            <div v-else class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ propertiesCount || '--' }}
            </div>
          </div>
          <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">{{ $t('dashboard.cards.areasTitle') }}</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ areasCount || '--' }}</div>
          </div>
          <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-dollar text-orange-500 !text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">{{ $t('dashboard.cards.devicesTitle') }}</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ devicesCount || '--' }}</div>
          </div>
          <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-users text-cyan-500 !text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">{{ $t('dashboard.cards.planTitle') }}: Free</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$0 {{ $t('dashboard.cards.month') }}
            </div>
          </div>
          <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-comment text-purple-500 !text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Left Column -->
    <div class="col-span-12 xl:col-span-6">
      <!-- Devices Card-->
      <div class="card">
        <div class="font-semibold text-xl mb-4">{{ $t('dashboard.devices.title') }}</div>
        <DataTable :value="registeredDevices" dataKey="id" :paginator="true" :rows="5" :loading="loading"
          responsiveLayout="scroll">
          <Column style="width: 15%" :header="$t('dashboard.devices.table.columns.image')">
            <template #body="slotProps">
              <img :src="slotProps.data.device.imageUrl" :alt="slotProps.data.device.name" width="50" class="shadow" />
            </template>
          </Column>
          <Column field="device.name" :header="$t('dashboard.devices.table.columns.deviceName')" :sortable="true"
            style="width: 35%"></Column>
          <Column field="device.type" :header="$t('dashboard.devices.table.columns.type')" :sortable="true"
            style="width: 35%">
          </Column>
          <Column field="device.location" :header="$t('dashboard.devices.table.columns.location')" :sortable="true"
            style="width: 35%">
            <template #body="slotProps">
              <div>{{ slotProps.data.area.name }}</div>
              <small>{{ slotProps.data.area.property.name }}</small>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Chart Card-->
      <div class="card">
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
      </div>
    </div>

    <!-- Right Column -->
    <div class="col-span-12 xl:col-span-6">
      <!-- Events Card-->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <div class="font-semibold text-xl">{{ $t('dashboard.events.title') }}</div>
        </div>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
          <li class="flex items-center py-2 border-b border-surface">
            <div
              class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
              <i class="pi pi-dollar !text-xl text-blue-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal">Richard Jones
              <span class="text-surface-700 dark:text-surface-100">has purchased a blue t-shirt for <span
                  class="text-primary font-bold">$79.00</span></span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
