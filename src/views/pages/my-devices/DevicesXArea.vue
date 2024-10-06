<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { AreaService } from '@/service/AreaService';
  import { DeviceService } from '@/service/DeviceService';
  
  const route = useRoute();
  const devices = ref([]);
  const visible = ref(false);
  const selectedDevice = ref(null);
  const areaId = route.params.area_id;
  const areaName = ref('');
  const picklistAreas = ref(null);
  const orderlistAreas = ref(null);
  const layout = ref('grid');
  
  onMounted(() => {
    DeviceService.getDevicesByAreaId(areaId).then((data) => {
      devices.value = data.slice(0, 6);
      picklistAreas.value = [data, []];
      orderlistAreas.value = data;
    });
    AreaService.getAreaById(areaId).then((area) => {
        areaName.value = area[0].name;
    });
  });

  function showDeviceSpecs(device) {
  selectedDevice.value = device;
  visible.value = true;
}
  </script>

<template>
    <div class="flex flex-col">
      <div class="card">
        <div class="font-semibold text-xl">Devices for {{ areaName }}</div>
        <DataView :value="devices" :layout="layout">
          <template #header></template>  
          
          <template #grid="slotProps">
            <div class="grid grid-cols-12 gap-4">
              <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                  <div class="pt-6">
                    <div class="flex flex-row justify-between items-start gap-2">
                      <div>
                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.brand }}</span>
                        <div class="text-lg font-medium mt-1">{{ item.name }}</div>
                      </div>
                    </div>
                    <div class="flex flex-col gap-6 mt-6">
                      <p class="text-s font-light">{{ item.description }}</p>
                      <div class="flex gap-2">
                        <Button icon="pi pi-plus" label="View more" @click="showDeviceSpecs(item)" class="flex-auto whitespace-nowrap"></Button>
                        <Button icon="pi pi-heart" outlined></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>

    <Dialog v-model:visible="visible" modal header="Device Specifications" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :draggable="false"> 
    <div v-if="selectedDevice">
      <p><strong>Description:</strong> {{ selectedDevice.description }}</p>
      <p><strong>Brand:</strong> {{ selectedDevice.brand }}</p>
      <p><strong>Model:</strong> {{ selectedDevice.model }}</p>
      <p><strong>Power:</strong> {{ selectedDevice.specs.power }}</p>
      <p><strong>Connectivity:</strong> {{ selectedDevice.specs.connectivity }}</p>
      <p><strong>Compatibility:</strong> {{ selectedDevice.specs.compatibility }}</p>
      <p><strong>Warranty:</strong> {{ selectedDevice.specs.warranty }}</p>
    </div>
    <Button label="Close" @click="visible = false" class="mt-3" />
  </Dialog>
  </template>  