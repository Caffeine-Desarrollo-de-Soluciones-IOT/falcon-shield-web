<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PropertyService } from '@/service/PropertyService';
import { AreaService } from '@/service/AreaService';

const router = useRouter();
const route = useRoute();
const areas = ref([]);
const propertyId = route.params.property_id;
const propertyName = ref('');
const picklistAreas = ref(null);
const orderlistAreas = ref(null);
const options = ref(['grid', 'list']);
const layout = ref('grid');

onMounted(() => {
  AreaService.getAreasSmallByPropertyId(propertyId).then((data) => {
    areas.value = data.slice(0, 6);
    picklistAreas.value = [data, []];
    orderlistAreas.value = data;
  });

  PropertyService.getPropertyById(propertyId).then((property) => {
    propertyName.value = property[0].name;
  });
});

function viewMoreDevices(areaId) {
  const propertyId = route.params.property_id;
  router.push(`/my-properties/${propertyId}/my-areas/${areaId}/devices`);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="card">
      <div class="font-semibold text-xl">Areas for {{ propertyName }}</div>
      <DataView :value="areas" :layout="layout">
        <template #header>
          <div class="flex justify-end">
            <SelectButton v-model="layout" :options="options" :allowEmpty="false">
              <template #option="{ option }">
                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
              </template>
            </SelectButton>
          </div>
        </template>

        <template #list="slotProps">
          <div class="flex flex-col">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <div
                class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                :class="{ 'border-t border-surface': index !== 0 }"
              >
                <div class="md:w-40 relative">
                  <img
                    class="block xl:block mx-auto rounded w-full"
                    :src="`https://primefaces.org/cdn/primevue/images/product/${item.image_url}`"
                    :alt="item.name"
                  />
                </div>
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                  <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                    <div>
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{
                        item.type
                      }}</span>
                      <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                      <span class="text-surface-900 font-medium text-sm">{{ item.address }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <Button icon="pi pi-heart" outlined></Button>
                      <Button
                        icon="pi pi-plus"
                        label="View devices"
                        @click="viewMoreDevices(item.id)"
                        class="flex-auto md:flex-initial whitespace-nowrap"
                      ></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="grid grid-cols-12 gap-4">
            <div
              v-for="(item, index) in slotProps.items"
              :key="index"
              class="col-span-12 sm:col-span-6 lg:col-span-4 p-2"
            >
              <div
                class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col"
              >
                <div class="bg-surface-50 flex justify-center rounded p-4">
                  <div class="relative mx-auto">
                    <img
                      class="rounded w-full"
                      :src="`https://primefaces.org/cdn/primevue/images/product/${item.image_url}`"
                      :alt="item.name"
                      style="max-width: 300px"
                    />
                  </div>
                </div>
                <div class="pt-6">
                  <div class="flex flex-row justify-between items-start gap-2">
                    <div>
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{
                        item.type
                      }}</span>
                      <div class="text-lg font-medium mt-1">{{ item.address }}</div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-6 mt-6">
                    <span class="text-2xl font-semibold">{{ item.name }}</span>
                    <div class="flex gap-2">
                      <Button
                        icon="pi pi-plus"
                        label="View devices"
                        @click="viewMoreDevices(item.id)"
                        class="flex-auto whitespace-nowrap"
                      ></Button>
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
</template>
