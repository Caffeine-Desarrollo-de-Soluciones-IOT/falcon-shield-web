<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { EventService } from '@/service/EventService';
import { EEventType, type IDeviceEvent } from '@/interfaces/events';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from '@primevue/core/api';
import type { IProperty } from '@/interfaces/properties';
import { PropertyService } from '@/service/PropertyService';

const events = ref<IDeviceEvent[]>([]);
const loading = ref(false);
const loadingProperties = ref(false);
const targetProperty = ref<IProperty>({} as IProperty);
const userProperties = ref<IProperty[]>([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const dt = ref();
const toast = useToast();

onMounted(async () => {
  await fetchUserProperties();
});

async function fetchEventsByPropertyId(propertyId: number) {
  try {
    loading.value = true;
    const res = await EventService.getEventsByPropertyId(propertyId);
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

async function fetchUserProperties() {
  try {
    loadingProperties.value = true;
    const res = await PropertyService.getProperties();
    userProperties.value = res.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error fetching user properties',
      life: 3000
    });
  } finally {
    loadingProperties.value = false;
  }
}

function getStatusLabel(type: EEventType) {
  switch (type) {
    case EEventType.ONLINE:
      return 'success';
    case EEventType.ALERT:
      return 'info';
    case EEventType.OFFLINE:
      return 'secondary';
    case EEventType.ERROR:
      return 'danger';
    case EEventType.WARNING:
      return 'warning';
    default:
      return 'secondary';
  }
}

function exportCSV() {
  dt.value.exportCSV();
}
</script>

<template>
  <div className="card">
    <div class="font-semibold text-xl mb-4">Device Events</div>
    <p>Review the events of your devices</p>

    <Menubar class="mt-6">
      <template #start>
        <Button
          label="Export to .csv"
          icon="pi pi-fw pi-file-excel"
          class="p-button-primary"
          @click="exportCSV"
        />

        <Select
        class="ml-4"
          id="propertySelect"
          v-model="targetProperty.id"
          :options="userProperties"
          option-label="name"
          option-value="id"
          placeholder="Select a Property"
          fluid
          @change="fetchEventsByPropertyId(targetProperty.id)"
        ></Select>
      </template>

      <template #end>
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters['global'].value" placeholder="Search..." />
        </IconField>
      </template>
    </Menubar>

    <DataTable
      class="mt-6"
      :value="events"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :filters="filters"
      :loading="loading"
      ref="dt"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} eventos"
    >
      <template #empty> No events found </template>
      <template #loading> Loading events data. Please wait... </template>

      <!-- COLUMNS -->
      <Column field="title" header="Title" style="min-width: 10rem"></Column>
      <Column field="description" header="Description" style="min-width: 15rem"></Column>
      <Column field="status" header="Type" style="min-width: 10rem">
        <template #body="slotProps">
          <Tag :value="slotProps.data.type" :severity="getStatusLabel(slotProps.data.type)" />
        </template>
      </Column>
      <Column field="timestamp" header="Timestamp" style="min-width: 10rem">
        <template #body="slotProps">
          {{ new Date(slotProps.data.timestamp).toLocaleString() }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
