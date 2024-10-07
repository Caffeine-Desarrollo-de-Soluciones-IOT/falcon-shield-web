<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PropertyService } from '@/service/PropertyService';
import { AreaService } from '@/service/AreaService';
import { EAreaType } from '@/interfaces/areas';
import { useToast } from 'primevue/usetoast';
import { IconService } from '../../../service/IconService';
import { storageBaseUrl } from '@/config/firebaseConfig';

const router = useRouter();
const route = useRoute();
const areas = ref(null);
const area = ref({ name: '', icon_id: '', property_id: '2' });
const propertyId = route.params.property_id;
const propertyName = ref('');
const areaDialog = ref(false);
const submitted = ref(false);
const toast = useToast();

const picklistAreas = ref(null);
const orderlistAreas = ref(null);
const options = ref(['grid', 'list']);
const layout = ref('grid');

// Para los íconos
const icons = ref([]);
const selectedIcon = ref(null);
const popoverRef = ref(null);

onMounted(() => {
  loadAreas();

  PropertyService.getPropertyById(propertyId).then((property) => {
    propertyName.value = property[0].name;
  });

  loadIcons();
});

function loadAreas() {
  AreaService.getAreasSmallByPropertyId(propertyId).then((data) => {
    areas.value = data.slice(0, 6);
    picklistAreas.value = [data, []];
    orderlistAreas.value = data;
  });
}

function loadIcons() {
  IconService.getIcons().then((data) => {
    icons.value = data;
  });
}

function getIconUrl(iconId) {
  console.log(`Buscando URL para Icon ID: ${iconId}`); // Verifica qué ID se está pasando
  const icon = icons.value.find((icon) => icon.id === iconId);
  const url = icon ? `${storageBaseUrl}${icon.icon_url}` : null;
  console.log(`Icon ID: ${iconId}, URL: ${url}`); // Verifica qué URL se genera
  return url;
}

function viewMoreDevices(areaId) {
  const propertyId = route.params.property_id;
  router.push(`/my-properties/${propertyId}/my-areas/${areaId}/devices`);
}

function openNew() {
  area.value = { name: '', icon_id: '', property_id: '2' };
  submitted.value = false;
  areaDialog.value = true;
}

function hideDialog() {
  areaDialog.value = false;
  submitted.value = false;
}

function saveArea() {
  submitted.value = true;

  if (!area.value.name) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Name is required', life: 3000 });
    return;
  }

  AreaService.createArea(area.value)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Area saved successfully',
        life: 3000
      });
      loadAreas();
      areaDialog.value = false;
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    });
}

function mapAreaTypeToName(typeId: number): EAreaType | undefined {
  switch (typeId) {
    case '1':
      return 'Kitchen';
    case '2':
      return 'Garage';
    case '3':
      return 'Living Room';
    case '4':
      return 'Dining Room';
    case '5':
      return 'Bedroom';
    default:
      return undefined;
  }
}

function selectIcon(icon) {
  selectedIcon.value = icon;
  area.value.icon_id = icon.id;
  popoverRef.value.hide();
}

function showIconPopover(event) {
  popoverRef.value.toggle(event);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="card">
      <div class="font-semibold text-xl">Areas for {{ propertyName }}</div>
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="New"
            icon="pi pi-plus"
            severity="secondary"
            class="mr-2"
            @click="openNew"
          />
        </template>

        <template #end>
          <SelectButton v-model="layout" :options="options" :allowEmpty="false">
            <template #option="{ option }">
              <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
            </template>
          </SelectButton>
        </template>
      </Toolbar>

      <DataView :value="areas" :layout="layout">
        <template #list="slotProps">
          <div class="flex flex-col">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <div
                class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                :class="{ 'border-t border-surface': index !== 0 }"
              >
                <div class="md:w-40 flex justify-center items-center">
                  <img
                    v-if="getIconUrl(item.icon_id)"
                    :src="getIconUrl(item.icon_id)"
                    alt="Area Icon"
                    class="area-icon"
                    style="height: 50px"
                  />
                </div>
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                  <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                      <div class="text-lg font-medium mt-2">{{ item.name }}</div>
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
                      v-if="getIconUrl(item.icon_id)"
                      :src="getIconUrl(item.icon_id)"
                      alt="Area Icon"
                      class="area-icon"
                      style="height: 50px"
                    />
                  </div>
                </div>
                <div class="pt-6">
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

    <Dialog
      v-model:visible="areaDialog"
      :style="{ width: '450px' }"
      header="Area Details"
      :modal="true"
      :draggable="false"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText
            id="name"
            v-model.trim="area.name"
            required="true"
            autofocus
            :invalid="submitted && !area.name"
            fluid
          />
          <small v-if="submitted && !area.name" class="text-red-500">Name is required.</small>
        </div>

        <div>
          <label for="icon" class="block font-bold mb-3">Icon</label>
          <Button
            type="button"
            :label="selectedIcon ? selectedIcon.name : 'Select Icon'"
            @click="showIconPopover"
            class="min-w-48"
          />

          <!-- Popover for Icon Selection -->
          <Popover ref="popoverRef">
            <div class="flex flex-col gap-4">
              <div>
                <span class="font-medium block mb-2">Available Icons</span>
                <ul class="list-none p-0 m-0 flex flex-col">
                  <li
                    v-for="icon in icons"
                    :key="icon.id"
                    class="flex items-center gap-2 px-2 py-3 hover:bg-emphasis cursor-pointer rounded-border"
                    @click="selectIcon(icon)"
                  >
                    <img :src="`${storageBaseUrl}${icon.icon_url}`" style="width: 32px" />
                    <div>
                      <span class="font-medium">{{ icon.name }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Popover>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveArea" />
      </template>
    </Dialog>
  </div>
</template>
