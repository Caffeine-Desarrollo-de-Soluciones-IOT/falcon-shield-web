<script setup lang="ts">
import type { IArea } from '@/interfaces/areas';
import {
  EDeviceType,
  type IDeviceCatalog,
  type IRegisterDeviceRequestDto,
  type IRegisteredDevice
} from '@/interfaces/devices';
import type { IProperty } from '@/interfaces/properties';
import { AreaService } from '@/service/AreaService';
import { DeviceService } from '@/service/DeviceService';
import { PropertyService } from '@/service/PropertyService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

//states
const toast = useToast();
const dt = ref();
const registerDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const deviceCatalog = ref<IDeviceCatalog[]>([]);
const registeredDevices = ref<IRegisteredDevice[]>([]);
const newDevice = ref<IRegisterDeviceRequestDto>({} as IRegisterDeviceRequestDto);
const selectedDeviceRegistration = ref<IRegisteredDevice>();
const userProperties = ref<IProperty[]>([]);
const targetProperty = ref<IProperty>({} as IProperty);
const propertyAreas = ref<IArea[]>([]);
const loadingAreas = ref(false);
const loadingCatalog = ref(false);
const loading = ref(false);
const registeringDevice = ref(false);
const unregisteringDevice = ref(false);

//lifecycle
onMounted(async () => {
  await fetchRegisteredDevices();
});

function openNew() {
  fetchDeviceCatalog();
  fetchUserProperties();
  newDevice.value = {} as IRegisterDeviceRequestDto;
  submitted.value = false;
  registerDialogVisible.value = true;
}

function hideDialog() {
  registerDialogVisible.value = false;
  submitted.value = false;
  newDevice.value = {} as IRegisterDeviceRequestDto;
  targetProperty.value = {} as IProperty;
}

async function handleRegisterDevice() {
  submitted.value = true;

  if (newDevice.value.deviceId && newDevice.value.registrationCode && newDevice.value.areaId) {
    try {
      registeringDevice.value = true;
      await DeviceService.registerDevice(newDevice.value);
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Device registered',
        life: 3000
      });

      hideDialog();

      // refresh registered devices
      await fetchRegisteredDevices();
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
        life: 3000
      });
    } finally {
      registeringDevice.value = false;
    }
  }
}

function confirmDeleteDevice(deviceRegistrationId: IRegisteredDevice) {
  selectedDeviceRegistration.value = deviceRegistrationId;
  deleteDialogVisible.value = true;
}

async function deleteDevice() {
  try {
    unregisteringDevice.value = true;
    await DeviceService.unregisterDevice(selectedDeviceRegistration.value!.id);

    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Device unregistered',
      life: 3000
    });
    deleteDialogVisible.value = false;
    selectedDeviceRegistration.value = {} as IRegisteredDevice;

    // refresh registered devices
    await fetchRegisteredDevices();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as Error).message,
      life: 3000
    });
  } finally {
    unregisteringDevice.value = false;
  }
}

async function fetchDeviceCatalog() {
  try {
    loadingCatalog.value = true;
    const res = await DeviceService.getDeviceCatalog();
    deviceCatalog.value = res.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error fetching device catalog',
      life: 3000
    });
  } finally {
    loadingCatalog.value = false;
  }
}

async function fetchRegisteredDevices() {
  try {
    loading.value = true;
    const res = await DeviceService.getRegisteredDevices();
    registeredDevices.value = res.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error fetching registered devices',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
}

async function fetchUserProperties() {
  try {
    const res = await PropertyService.getProperties();
    userProperties.value = res.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error fetching user properties',
      life: 3000
    });
  }
}

async function getAreas(propertyId: number) {
  try {
    loadingAreas.value = true;
    const res = await AreaService.getAreasByPropertyId(propertyId);
    propertyAreas.value = res.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error fetching areas',
      life: 3000
    });
  } finally {
    loadingAreas.value = false;
  }
}

function getStatusLabel(type: EDeviceType) {
  switch (type) {
    case EDeviceType.ACTUATOR:
      return 'success';
    case EDeviceType.SENSOR:
      return 'info';
    default:
      return 'secondary';
  }
}
</script>

<template>
  <div className="card">
    <div class="font-semibold text-xl mb-4">{{ $t('myDevices.title') }}</div>
    <p>{{ $t('myDevices.subtitle') }}</p>

    <Menubar class="mt-6">
      <template #start>
        <Button :label="$t('myDevices.registerDevice')" icon="pi pi-plus" @click="openNew" />
      </template>

      <template #end>
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters['global'].value" :placeholder="$t('myDevices.searchPlaceholder')" />
        </IconField>
      </template>
    </Menubar>

    <DataTable
      class="mt-6"
      ref="dt"
      :value="registeredDevices"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :filters="filters"
      :loading="loading"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      :currentPageReportTemplate="$t('myDevices.table.fotter', { first: '{first}', last: '{last}', totalRecords: '{totalRecords}' })"
    >
      <template #empty> {{ $t('myDevices.table.noDevices')}} </template>
      <template #loading> {{ $t('myDevices.table.loading')}} </template>

      <!-- COLUMNS -->
      <Column field="device.name" :header="$t('myDevices.table.deviceName')" style="min-width: 10rem"></Column>
      <Column :header="$t('myDevices.table.image')">
        <template #body="slotProps">
          <img
            :src="slotProps.data.device.imageUrl"
            :alt="slotProps.data.device.name"
            class="rounded"
            style="width: 64px"
          />
        </template>
      </Column>
      <Column field="device.brand" :header="$t('myDevices.table.brand')" style="min-width: 10rem"></Column>
      <Column field="device.model" :header="$t('myDevices.table.model')" style="min-width: 10rem"></Column>
      <Column :header="$t('myDevices.table.location')" style="min-width: 10rem">
        <template #body="slotProps">
          <div>{{ slotProps.data.area.name }}</div>
          <small>{{ slotProps.data.area.property.name }}</small>
        </template>
      </Column>
      <Column field="device.type" :header="$t('myDevices.table.type')" style="min-width: 10rem">
        <template #body="slotProps">
          <Tag :value="slotProps.data.device.type" :severity="getStatusLabel(slotProps.data.device.type)" />
        </template>
      </Column>
      <Column field="registeredAt" :header="$t('myDevices.table.registeredAt')" style="min-width: 10rem">
        <template #body="slotProps">
          {{ new Date(slotProps.data.registeredAt).toLocaleString() }}
        </template>
      </Column>
      <Column :header="$t('myDevices.table.actions')" style="min-width: 10rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDeleteDevice(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- DIALOG REGISTER -->
  <Dialog
    v-model:visible="registerDialogVisible"
    :style="{ width: '450px' }"
    :header="$t('myDevices.dialogs.register.title')"
    :modal="true"
  >
    <Stepper value="1">
      <!-- STEP 1 -->
      <StepItem value="1">
        <Step>{{ $t('myDevices.dialogs.register.step1') }}</Step>
        <StepPanel v-slot="{ activateCallback }">
          <label for="deviceSelect" class="block font-bold mb-3">{{ $t('myDevices.dialogs.register.labels.device') }}</label>
          <Select
            id="deviceSelect"
            v-model="newDevice.deviceId"
            :options="deviceCatalog"
            optionGroupLabel="name"
            optionGroupChildren="devices"
            optionLabel="name"
            optionValue="id"
            :show-clear="true"
            fluid
            :invalid="submitted && !newDevice?.deviceId"
            :placeholder="loadingCatalog ? $t('myDevices.dialogs.register.placeholders.loadingDeviceCatalog') : $t('myDevices.dialogs.register.placeholders.selectDevice')"
            :loading="loadingCatalog"
            :disabled="loadingCatalog"
          >
            <template #optiongroup="slotProps">
              <div class="flex items-center">
                <i :class="`mr-2 ${slotProps.option.icon}`" />
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Select>
          <small v-if="submitted && !newDevice?.deviceId" class="text-red-500"
            >{{ $t('myDevices.dialogs.register.errors.requiredDevice') }}</small
          >

          <div class="py-6">
            <Button :label="$t('myDevices.dialogs.register.buttons.next')" @click="activateCallback('2')" />
          </div>
        </StepPanel>
      </StepItem>

      <!-- STEP 2 -->
      <StepItem value="2">
        <Step>{{ $t('myDevices.dialogs.register.step2') }}</Step>
        <StepPanel v-slot="{ activateCallback }">
          <label for="name" class="block font-bold mb-3">{{ $t('myDevices.dialogs.register.labels.registrationCode') }}</label>
          <InputText
            id="name"
            v-model.trim="newDevice.registrationCode"
            required="true"
            autofocus
            :invalid="submitted && !newDevice?.registrationCode"
            fluid
          />
          <small v-if="submitted && !newDevice?.registrationCode" class="text-red-500">{{ $t('myDevices.dialogs.register.errors.requiredRegistrationCode') }}</small>
          <div class="flex py-6 gap-2">
            <Button :label="$t('myDevices.dialogs.register.buttons.back')" severity="secondary" @click="activateCallback('1')" />
            <Button :label="$t('myDevices.dialogs.register.buttons.next')" @click="activateCallback('3')" />
          </div>
        </StepPanel>
      </StepItem>

      <!-- STEP 3 -->
      <StepItem value="3">
        <Step>{{ $t('myDevices.dialogs.register.step3') }}</Step>
        <StepPanel v-slot="{ activateCallback }">
          <div class="flex flex-col gap-6">
            <div>
              <label for="propertySelect" class="block font-bold mb-3">{{ $t('myDevices.dialogs.register.labels.property') }}</label>
              <Select
                id="propertySelect"
                v-model="targetProperty.id"
                :options="userProperties"
                option-label="name"
                option-value="id"
                :placeholder="$t('myDevices.dialogs.register.placeholders.selectProperty')"
                :show-clear="true"
                fluid
                @change="getAreas(targetProperty.id)"
              ></Select>
            </div>

            <div>
              <label for="areaSelect" class="block font-bold mb-3">{{ $t('myDevices.dialogs.register.labels.area') }}</label>
              <Select
                id="areaSelect"
                v-model="newDevice.areaId"
                :options="propertyAreas"
                optionLabel="name"
                optionValue="id"
                fluid
                :placeholder="loadingAreas ? $t('myDevices.dialogs.register.placeholders.loadingAreas') : $t('myDevices.dialogs.register.placeholders.selectArea')"
                :disabled="!targetProperty.id || loadingAreas"
                :loading="loadingAreas"
                >
                <template #empty>
                  <p>No areas available</p>
                </template>
              </Select>
            </div>
          </div>

          <div class="py-6">
            <Button :label="$t('myDevices.dialogs.register.buttons.back')" severity="secondary" @click="activateCallback('2')" />
          </div>
        </StepPanel>
      </StepItem>
    </Stepper>

    <template #footer>
      <Button :label="$t('myDevices.dialogs.register.buttons.cancel')" icon="pi pi-times" text @click="hideDialog" />
      <Button
        icon="pi pi-check"
        :label="registeringDevice ? $t('myDevices.dialogs.register.buttons.registering') : $t('myDevices.dialogs.register.buttons.register')"
        :loading="registeringDevice"
        :disabled="registeringDevice"
        @click="handleRegisterDevice" />
    </template>
  </Dialog>

  <!-- DIALOG DELETE -->
  <Dialog
    v-model:visible="deleteDialogVisible"
    :style="{ width: '450px' }"
    :header="$t('myDevices.dialogs.delete.title')"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="selectedDeviceRegistration">
        {{ $t('myDevices.dialogs.delete.message') }} <b>{{ selectedDeviceRegistration.device.name }}</b>?
      </span>
    </div>
    <template #footer>
      <Button :label="$t('myDevices.dialogs.delete.buttons.no')" icon="pi pi-times" severity="secondary" text @click="deleteDialogVisible = false" />
      <Button
        :label="unregisteringDevice ? $t('myDevices.dialogs.delete.buttons.unregistering') : $t('myDevices.dialogs.delete.buttons.yes')"
        icon="pi pi-check"
        severity="danger"
        :loading="unregisteringDevice"
        @click="deleteDevice()" />
    </template>
  </Dialog>
</template>
