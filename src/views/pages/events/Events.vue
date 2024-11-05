<script>
import { ref, onMounted } from 'vue';
import { AuthService } from '@/service/AuthService'; // Asegúrate de que la ruta sea correcta
import { EventService } from '@/service/EventService'; // Asegúrate de que la ruta sea correcta

export default {
  name: 'Events',
  setup() {
    const events = ref([]);
    const loading = ref(true); // Estado de carga

    onMounted(async () => {
      try {
        const user = await AuthService.getUser(); // Utiliza el servicio de autenticación

        if (user) {
          const userId = user.sub; // Obtiene el ID del usuario logueado
          const response = await EventService.getDeviceEvents(userId); // Cambia la llamada aquí
          events.value = response.data; // Asigna los datos de la respuesta
          console.log(events.value); // Agrega este log para verificar
        } else {
          console.error('No hay usuario logueado');
        }
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        loading.value = false; // Cambia el estado de carga cuando termina
      }
    });

    // Retornar los eventos
    return { events, loading };
  },
};
</script>

<template>
  <div className="card">
    <div class="font-semibold text-xl mb-4">Device Events</div>
    <p>Review the events of your devices</p>

    <div v-if="loading" class="text-center">Cargando eventos...</div> 
    <DataTable
      v-else
      class="mt-6"
      :value="events"
      dataKey="id"
      :paginator="true"
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} eventos"
    >
      <!-- COLUMNS -->
      <Column field="title" header="Título" style="min-width: 10rem"></Column>
      <Column field="description" header="Descripción" style="min-width: 15rem"></Column>
      <Column field="timestamp" header="Fecha y Hora" style="min-width: 10rem">
        <template #body="slotProps">
          {{ new Date(slotProps.data.timestamp).toLocaleString() }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
