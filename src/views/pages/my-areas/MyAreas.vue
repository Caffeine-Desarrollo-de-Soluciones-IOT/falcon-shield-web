<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { AreaService } from '@/service/AreaService';
import { PropertyService } from '@/service/PropertyService';
import { DeviceService } from '@/service/DeviceService';
import { useToast } from 'primevue/usetoast';
import { IconService } from '@/service/IconService';
import { storageBaseUrl } from '@/config/firebaseConfig';
import type { IArea } from '@/interfaces/areas';
import type { MenuItem } from 'primevue/menuitem';
import type { IIcon } from '@/interfaces/common';
import type { IRegisteredDevice } from '@/interfaces/devices';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const toast = useToast();

const areas = ref<IArea[]>([]);
const devices = ref<IRegisteredDevice[]>([]);
const propertyId = Number(route.params.property_id);
const area = ref<IArea>({} as IArea);
const propertyName = ref('--');
const areaDialog = ref(false);
const submitted = ref(false);
const creatingArea = ref(false);
const loadingDevices = ref(false);
const loadingAreas = ref(false);

//icons & popover
const icons = ref<IIcon[]>([]);
const selectedIcon = ref<IIcon | null>(null);
const popoverRef = ref<any>(null);
const popoverDevices = ref();
const menu = ref<any>(null);

const menuItems = (item: IArea): MenuItem[] => [
  {
    label: t('myAreas.menu.edit'),
    icon: 'pi pi-pencil',
    command: () => {
      editArea(item);
    }
  }
];

onMounted(async () => {
  getProperty();
  await loadAreas();
  loadIcons();
});

function getProperty() {
  PropertyService.getPropertyById(propertyId).then((res) => {
    propertyName.value = res.data.name;
  });
}

async function loadAreas() {
  try {
    loadingAreas.value = true;
    const res = await AreaService.getAreasByPropertyId(propertyId);
    areas.value = res.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('myAreas.toast.error'),
      detail: t('myAreas.toast.errorFetchingAreas'),
      life: 3000
    });
  } finally {
    loadingAreas.value = false;
  }
}

function loadIcons() {
  icons.value = IconService.getIcons();
}

function getIconUrl(iconId: string) {
  const icon = IconService.getIconById(iconId);
  return `${storageBaseUrl}${icon!.icon_url}`;
}

async function loadDevicesForArea(areaId: number) {
  try {
    loadingDevices.value = true;
    const res = await DeviceService.getRegisteredDevicesForArea(areaId);
    devices.value = res.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('myAreas.toast.error'),
      detail: t('myAreas.toast.errorFetchingDevices'),
      life: 3000
    });
  } finally {
    loadingDevices.value = false;
  }
}

function openNew() {
  area.value = {} as IArea;
  selectedIcon.value = null;
  submitted.value = false;
  areaDialog.value = true;
}

function hideDialog() {
  areaDialog.value = false;
  submitted.value = false;
}

async function saveArea() {
  submitted.value = true;

  if (!area.value.name) {
    return;
  }

  if (area.value.id) {
    // Si existe un id, actualiza el area
    // AreaService.updateArea(area.value.id, area.value)
    //   .then(() => {
    //     toast.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Area updated',
    //       life: 3000
    //     });
    //     loadAreas();
    //     openNew();
    //     areaDialog.value = false;
    //   })
    //   .catch(() => {
    //     toast.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Failed to update area',
    //       life: 3000
    //     });
    //   });
  } else {
    try {
      creatingArea.value = true;
      await AreaService.createArea(propertyId, area.value);
      toast.add({
        severity: 'success',
        summary: t('myAreas.toast.success'),
        detail: t('myAreas.toast.areaCreated'),
        life: 3000
      });
      loadAreas();
      openNew();
      areaDialog.value = false;
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message || t('myAreas.toast.failedCreated'),
        life: 3000
      });
    } finally {
      creatingArea.value = false;
    }
  }
}

function editArea(item: IArea) {
  area.value = { ...item };
  areaDialog.value = true;
}

function mapAreaTypeToName(iconId: string) {
  const iconKeys: Record<string, string> = {
    "1": "myAreas.icons.default",
    "2": "myAreas.icons.kitchen",
    "3": "myAreas.icons.garage",
    "4": "myAreas.icons.livingRoom",
    "5": "myAreas.icons.diningRoom",
    "6": "myAreas.icons.bedroom"
  };

  return iconKeys[iconId] ? t(iconKeys[iconId]) : t('myAreas.icons.default');
}


function selectIcon(icon: any) {
  selectedIcon.value = icon;
  area.value.icon = icon.id;
  popoverRef.value?.hide();
}

function showIconPopover(event: any) {
  if (popoverRef.value) {
    popoverRef.value.toggle(event);
  }
}

function showDevicesPopover(event: any, index: number, areaId: number) {
  if (popoverDevices.value) {
    popoverDevices.value[index].toggle(event);
    loadDevicesForArea(areaId);
  }
}

function closeDevicesPopover() {
  devices.value = [];
}

function toggleMenu(event: any, index: number) {
  menu.value[index].toggle(event);
}

function redirectToDevicesList() {
  router.push(`/my-devices`);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="card">
      <div class="font-semibold text-xl mb-4">{{ $t('myAreas.title') }} {{ propertyName }}</div>
      <p>{{ $t('myAreas.description') }}</p>

      <Toolbar class="mt-6">
        <template #start>
          <Button :label="$t('myAreas.registerArea')" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
        </template>

        <template #end>
          <Button :label="$t('myAreas.viewAllDevicesButton')" icon="pi pi-external-link" severity="secondary" class="mr-2"
            @click="redirectToDevicesList" />
        </template>
      </Toolbar>

      <div v-if="loadingAreas" class="mt-6 text-center">{{ $t('myAreas.loading') }}</div>
      <DataView v-else class="mt-6" :value="areas" data-key="id" paginator :rows="5">
        <template #list="slotProps">
          <div class="flex flex-col">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                :class="{ 'border-t border-surface': index !== 0 }">
                <div class="md:w-40 flex justify-center items-center">
                  <img v-if="getIconUrl(item.icon)" :src="getIconUrl(item.icon)" alt="Area Icon" class="area-icon"
                    style="height: 50px" />
                </div>
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                  <div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{
                      mapAreaTypeToName(item.icon)
                    }}</span>
                    <div class="text-lg font-medium mt-1">{{ item.name }}</div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <!-- POPOVER FOR DEVICES -->
                      <Button icon="pi pi-fw pi-mobile" :label="$t('myAreas.viewDeviceButton')" class="flex-auto whitespace-nowrap"
                        @click="showDevicesPopover($event, index, item.id)"></Button>
                      <Popover ref="popoverDevices" @hide="closeDevicesPopover">
                        <div class="flex flex-col gap-4 w-[25rem]">
                          <div>
                            <span class="font-medium block mb-2">Registered devices</span>
                            <div v-if="loadingDevices" class="text-center">Loading...</div>
                            <div v-else-if="devices.length === 0" class="text-center">No devices registered</div>
                            <ul v-else class="list-none p-0 m-0 flex flex-col gap-4">
                              <li v-for="device in devices" :key="device.id" class="flex items-center gap-2">
                                <img :src="device.device.imageUrl" style="width: 32px" />
                                <div>
                                  <span class="font-medium">{{ device.device.name }}</span>
                                  <div class="text-sm text-surface-500 dark:text-surface-400">
                                    {{ device.device.brand }} {{ device.device.model }}
                                  </div>
                                </div>
                                <div
                                  class="flex items-center gap-2 text-surface-500 dark:text-surface-400 ml-auto text-sm">
                                  <span>{{ device.device.type }}</span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </Popover>

                      <Menu ref="menu" :model="menuItems(item)" :popup="true" />
                      <Button type="button" icon="pi pi-ellipsis-v" outlined @click="toggleMenu($event, index)" />
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
    <Dialog v-model:visible="areaDialog" :style="{ width: '450px' }" :header="$t('myAreas.popoverAdd.title')" modal :draggable="false">
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">{{ $t('myAreas.popoverAdd.name') }}</label>
          <InputText id="name" v-model.trim="area.name" required="true" autofocus :invalid="submitted && !area.name"
            fluid />
          <small v-if="submitted && !area.name" class="text-red-500">{{ $t('myAreas.popoverAdd.nameRequired') }}</small>
        </div>

        <div>
          <label for="icon" class="block font-bold mb-3">{{ $t('myAreas.popoverAdd.icon') }}</label>
          <Button type="button" :label="selectedIcon ? selectedIcon.name : $t('myAreas.popoverAdd.selectIcon')" @click="showIconPopover"
            class="min-w-48" />
          <Popover ref="popoverRef">
            <div class="flex flex-col gap-4">
              <div>
                <span class="font-medium block mb-2">{{ $t('myAreas.popoverAdd.icons') }}</span>
                <ul class="list-none p-0 m-0 flex flex-col">
                  <li v-for="icon in icons" :key="icon.id"
                    class="flex items-center gap-2 px-2 py-3 hover:bg-emphasis cursor-pointer rounded-border"
                    @click="selectIcon(icon)">
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
        <Button :label="creatingArea ? 'Creating...' : 'Create'" icon="pi pi-check" text @click="saveArea"
          :loading="creatingArea" />
      </template>
    </Dialog>
  </div>
</template>
