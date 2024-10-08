<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PropertyService } from '@/service/PropertyService';
import { AreaService } from '@/service/AreaService';
import { useToast } from 'primevue/usetoast';
import { IconService } from '@/service/IconService';
import { storageBaseUrl } from '@/config/firebaseConfig';
import { IArea } from '@/interfaces/areas';

const route = useRoute();
const router = useRouter();
const areas = ref<IArea[]>([]);
const propertyId = route.params.property_id;
const area = ref<IArea>({ name: '', icon_id: '', property_id: propertyId });
const propertyName = ref('');
const areaToDelete = ref<IArea | null>(null);
const areaDialog = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);
const toast = useToast();

const options = ref(['grid', 'list']);
const layout = ref('grid');
const picklistAreas = ref(null);
const orderlistAreas = ref(null);

// Para los íconos
const icons = ref([]);
const selectedIcon = ref(null);
const popoverRef = ref(null);

const items = (item) => [
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      editArea(item);
    }
  },
  {
    label: 'Delete',
    icon: 'pi pi-times',
    command: () => {
      confirmDelete(item);
    }
  }
];

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
  const icon = icons.value.find((icon) => icon.id === iconId);
  const url = icon ? `${storageBaseUrl}${icon.icon_url}` : null;
  return url;
}

function viewMoreDevices(areaId) {
  const propertyId = route.params.property_id;
  router.push(`/my-properties/${propertyId}/my-areas/${areaId}/devices`);
}

function openNew() {
  area.value = { name: '', icon_id: '', property_id: propertyId };
  selectedIcon.value = null;
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
    return; // Validación básica
  }

  if (area.value.id) {
    // Si existe un id, actualiza el area
    AreaService.updateArea(area.value.id, area.value)
      .then(() => {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Area updated',
          life: 3000
        });
        loadAreas();
        areaDialog.value = false;
        openNew();
      })
      .catch(() => {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update area',
          life: 3000
        });
      });
  } else {
    // Si no hay id, crea una nueva area
    AreaService.createArea(area.value)
      .then(() => {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Area created',
          life: 3000
        });
        loadAreas();
        areaDialog.value = false;
        openNew();
      })
      .catch(() => {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create area',
          life: 3000
        });
      });
  }
}

function editArea(item) {
  // Copiar el area seleccionada y abrir el diálogo de edición
  area.value = { ...item };
  areaDialog.value = true; // Asegurarse de que solo se abre el diálogo de edición
}

function deleteArea() {
  if (areaToDelete.value) {
    AreaService.deleteArea(areaToDelete.value.id) // Asumiendo que tienes este método en el servicio
      .then(() => {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Area deleted', life: 3000 });
        loadAreas(); // Recargar areas
        deleteDialog.value = false; // Cerrar diálogo de eliminación
      })
      .catch(() => {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete area',
          life: 3000
        });
      });
  }
}

function confirmDelete(item) {
  areaToDelete.value = item; // Guardar la area a eliminar
  deleteDialog.value = true; // Abrir diálogo de confirmación
}

function mapAreaTypeToName(iconId: string) {
  switch (iconId) {
    case '1':
      return 'Undefined';
    case '2':
      return 'Kitchen';
    case '3':
      return 'Garage';
    case '4':
      return 'Living Room';
    case '5':
      return 'Dining Room';
    case '6':
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
  if (popoverRef.value) {
    popoverRef.value.toggle(event);
  } else {
    console.error('popoverRef is null');
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="card">
      <div class="font-semibold text-xl mb-6">Areas for {{ propertyName }}</div>
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
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{
                      mapAreaTypeToName(item.type_id)
                    }}</span>
                    <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <!-- <Button icon="pi pi-heart" outlined></Button> -->
                      <SplitButton
                        label="View devices"
                        dropdownIcon="pi pi-chevron-down"
                        @click="viewMoreDevices(item.id)"
                        class="flex-auto md:flex-initial whitespace-nowrap"
                        :model="items(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="grid grid-cols-12 gap-4">
            <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
              <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
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
                  <div class="flex flex-row justify-between items-start gap-2">
                    <div>
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{
                        mapAreaTypeToName(item.icon_id)
                      }}</span>
                      <div class="text-lg font-medium mt-1">{{ item.name }}</div>
                    </div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <!-- <Button icon="pi pi-heart" outlined></Button> -->
                      <SplitButton
                        label="View devices"
                        dropdownIcon="pi pi-chevron-down"
                        @click="viewMoreDevices(item.id)"
                        class="flex-auto md:flex-initial whitespace-nowrap"
                        :model="items(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>

    <!-- Diálogo para crear/editar area -->
    <Dialog
      v-model:visible="areaDialog"
      :style="{ width: '450px' }"
      header="Area Details"
      modal
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
          <Popover ref="popoverRef">
            <div class="flex flex-col gap-4">
              <div>
                <span class="font-medium block mb-2">Icons</span>
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
        <Button label="Save" icon="pi pi-check" text @click="saveArea" />
      </template>
    </Dialog>

    <!-- Diálogo para confirmar eliminación -->
    <Dialog
      header="Confirm"
      v-model:visible="deleteDialog"
      modal
      :draggable="false"
      footer="footer"
      :style="{ width: '450px' }"
    >
      <div>
        Are you sure you want to delete <b>{{ areaToDelete?.name }}</b
        >?
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="deleteDialog = false"
          class="p-button-text"
        />
        <Button label="Yes" icon="pi pi-check" @click="deleteArea" autoFocus />
      </template>
    </Dialog>
  </div>
</template>
