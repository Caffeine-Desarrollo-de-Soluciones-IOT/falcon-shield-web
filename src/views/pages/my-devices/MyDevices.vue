<script setup lang="ts">
import {
  EDeviceType,
  type IArea,
  type IDevice,
  type IDeviceCatalog,
  type IProperty,
  type IRegisterDeviceRequestDto,
  type IRegisteredDevice
} from '@/interfaces/devices';
import { DeviceService } from '@/service/DeviceService';
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
const selectedDevice = ref<IDevice>();
const userProperties = ref<IProperty[]>([]);
const targetProperty = ref<IProperty>({} as IProperty);
const propertyAreas = ref<IArea[]>([]);
const loadingAreas = ref(false);
const loadingCatalog = ref(false);
const registeringDevice = ref(false);

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

      registerDialogVisible.value = false;
      newDevice.value = {} as IRegisterDeviceRequestDto;

      // refresh registered devices
      await fetchRegisteredDevices();
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message || 'Error registering device',
        life: 3000
      });
    } finally {
      registeringDevice.value = false;
    }
  }
}

function confirmDeleteDevice(dev: IDevice) {
  selectedDevice.value = dev;
  deleteDialogVisible.value = true;
}

function deleteDevice() {
  registeredDevices.value = registeredDevices.value.filter(
    (val) => val.id !== selectedDevice.value?.id
  );
  deleteDialogVisible.value = false;
  selectedDevice.value = {} as IDevice;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Device deleted', life: 3000 });
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
    const res = await DeviceService.getRegisteredDevices();
    registeredDevices.value = res.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error fetching registered devices',
      life: 3000
    });
  }
}

async function fetchUserProperties() {
  try {
    userProperties.value = await DeviceService.getUserProperties();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error fetching user properties',
      life: 3000
    });
  }
}

async function getAreas(propertyId: string) {
  try {
    loadingAreas.value = true;
    const data = await DeviceService.getAreasByProperty(propertyId);
    propertyAreas.value = data;
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
    <div class="font-semibold text-xl mb-4">My devices</div>
    <p>Add or manage your devices</p>

    <DataTable
      class="mt-6"
      ref="dt"
      :value="registeredDevices"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} registered devices"
    >
      <!-- HEADER -->
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <Button label="Register a device" icon="pi pi-plus" @click="openNew" raised />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </IconField>
        </div>
      </template>

      <!-- COLUMNS -->
      <Column field="device.name" header="Device Name" style="min-width: 10rem"></Column>
      <Column header="Image">
        <template #body="slotProps">
          <img
            :src="slotProps.data.device.imageUrl"
            :alt="slotProps.data.device.name"
            class="rounded"
            style="width: 64px"
          />
        </template>
      </Column>
      <Column field="device.brand" header="Brand" style="min-width: 10rem"></Column>
      <Column field="device.model" header="Model" style="min-width: 10rem"></Column>
      <Column field="device.type" header="Type" style="min-width: 10rem">
        <template #body="slotProps">
          <Tag :value="slotProps.data.device.type" :severity="getStatusLabel(slotProps.data.device.type)" />
        </template>
      </Column>
      <Column field="registeredAt" header="Registered At" style="min-width: 10rem">
        <template #body="slotProps">
          {{ new Date(slotProps.data.registeredAt).toLocaleString() }}
        </template> 
      </Column>
      <!-- <Column field="area.name" header="Area" style="min-width: 10rem"></Column> -->
      <Column header="Actions" style="min-width: 10rem">
        <template #body="slotProps">
          <!-- <Button
            icon="pi pi-eye"
            outlined
            rounded
            class="mr-2"
            @click="showDeviceDetails(slotProps.data)"
          /> -->
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
    header="Register a new device"
    :modal="true"
  >
    <Stepper value="1">
      <!-- STEP 1 -->
      <StepItem value="1">
        <Step>Select the device type</Step>
        <StepPanel v-slot="{ activateCallback }">
          <label for="deviceSelect" class="block font-bold mb-3">Device</label>
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
            :placeholder="loadingCatalog ? 'Loading device catalog...' : 'Select a Device'"
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
            >Choose a device</small
          >

          <div class="py-6">
            <Button label="Next" @click="activateCallback('2')" />
          </div>
        </StepPanel>
      </StepItem>

      <!-- STEP 2 -->
      <StepItem value="2">
        <Step>Enter the registration code</Step>
        <StepPanel v-slot="{ activateCallback }">
          <label for="name" class="block font-bold mb-3">Registration Code</label>
          <InputText
            id="name"
            v-model.trim="newDevice.registrationCode"
            required="true"
            autofocus
            :invalid="submitted && !newDevice?.registrationCode"
            fluid
          />
          <small v-if="submitted && !newDevice?.registrationCode" class="text-red-500">Registration Code is required</small>
          <div class="flex py-6 gap-2">
            <Button label="Back" severity="secondary" @click="activateCallback('1')" />
            <Button label="Next" @click="activateCallback('3')" />
          </div>
        </StepPanel>
      </StepItem>

      <!-- STEP 3 -->
      <StepItem value="3">
        <Step>Assign to a property & area</Step>
        <StepPanel v-slot="{ activateCallback }">
          <div class="flex flex-col gap-6">
            <div>
              <label for="propertySelect" class="block font-bold mb-3">Select a Property</label>
              <Select
                id="propertySelect"
                v-model="targetProperty.id"
                :options="userProperties"
                option-label="name"
                option-value="id"
                placeholder="Select a Property"
                :show-clear="true"
                fluid
                @change="getAreas(targetProperty.id)"
              ></Select>
            </div>

            <div>
              <label for="areaSelect" class="block font-bold mb-3">Select an Area</label>
              <Select
                id="areaSelect"
                v-model="newDevice.areaId"
                :options="propertyAreas"
                optionLabel="name"
                optionValue="id"
                fluid
                :placeholder="loadingAreas ? 'Loading areas...' : 'Select an Area'"
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
            <Button label="Back" severity="secondary" @click="activateCallback('2')" />
          </div>
        </StepPanel>
      </StepItem>
    </Stepper>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button 
        icon="pi pi-check"
        :label="registeringDevice ? 'Registering...' : 'Register'"
        :loading="registeringDevice" 
        :disabled="registeringDevice"
        @click="handleRegisterDevice" />
    </template>
  </Dialog>

  <!-- DIALOG DELETE -->
  <Dialog
    v-model:visible="deleteDialogVisible"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="selectedDevice"
        >Are you sure you want to delete <b>{{ selectedDevice.name }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteDialogVisible = false" />
      <Button label="Yes" icon="pi pi-check" @click="deleteDevice" />
    </template>
  </Dialog>
</template>
