<script setup lang="ts">
import { PropertyService } from '@/service/PropertyService';
import { imageService } from '@/service/ImageService';
import { storageBaseUrl } from '@/config/firebaseConfig';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const properties = ref(null);
const property = ref({ name: '', address: '', user_id: 'abc123', image_url: '' });
const propertyToDelete = ref(null);
const propertyDialog = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);
const addressVisibility = ref({});
const toast = useToast();
const selectedFile = ref<File | null>(null);
const src = ref(null); // Para la vista previa de la imagen

const options = ref(['grid', 'list']);
const layout = ref('grid');
const picklistAreas = ref(null);
const orderlistAreas = ref(null);

const items = (item) => [
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      editProperty(item);
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
  loadProperties();
});

function loadProperties() {
  PropertyService.getPropertiesSmall().then((data) => {
    properties.value = data.slice(0, 6);
    picklistAreas.value = [data, []];
    orderlistAreas.value = data;
  });
}

function viewMoreAreas(propertyId) {
  router.push(`/my-properties/${propertyId}/my-areas`);
}

function toggleAddressVisibility(propertyId) {
  addressVisibility.value[propertyId] = !addressVisibility.value[propertyId];
}

function openNew() {
  // Reiniciar el objeto de propiedad y abrir el diálogo para nueva propiedad
  property.value = { name: '', address: '', user_id: 'abc123', image_url: '' };
  submitted.value = false;
  propertyDialog.value = true;
  src.value = null; // Reiniciar vista previa al abrir el diálogo
}

function hideDialog() {
  propertyDialog.value = false;
  submitted.value = false;
}

async function saveProperty() {
  submitted.value = true;

  if (!property.value.name || !property.value.address) {
    return; // Validación básica
  }

  if (selectedFile.value) {
    const imageName = await imageService.uploadImage(selectedFile.value); // Subir la imagen a Firebase

    if (imageName) {
      property.value.image_url = imageName; // Guardar solo el nombre de la imagen en la propiedad
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Image upload failed', life: 3000 });
      return;
    }
  }

  if (property.value.id) {
    // Si existe un id, actualiza la propiedad
    PropertyService.updateProperty(property.value.id, property.value)
      .then(() => {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Property Updated',
          life: 3000
        });
        loadProperties();
        propertyDialog.value = false;
        property.value = { id: '', name: '', image_url: '', address: '', user_id: 'abc123' };
      })
      .catch(() => {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update property',
          life: 3000
        });
      });
  } else {
    // Si no hay id, crea una nueva propiedad
    PropertyService.createProperty(property.value)
      .then(() => {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Property Created',
          life: 3000
        });
        loadProperties();
        propertyDialog.value = false;
        property.value = { name: '', image_url: '', address: '', user_id: 'abc123' };
      })
      .catch(() => {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create property',
          life: 3000
        });
      });
  }
}

function editProperty(item) {
  // Copiar la propiedad seleccionada y abrir el diálogo de edición
  property.value = { ...item };
  propertyDialog.value = true; // Asegurarse de que solo se abre el diálogo de edición
  src.value = `${storageBaseUrl}${item.image_url}`; // Mostrar la imagen actual en la vista previa
}

function deleteProperty() {
  if (propertyToDelete.value) {
    PropertyService.deleteProperty(propertyToDelete.value.id) // Asumiendo que tienes este método en el servicio
      .then(() => {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Property Deleted', life: 3000 });
        loadProperties(); // Recargar propiedades
        deleteDialog.value = false; // Cerrar diálogo de eliminación
      })
      .catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete property', life: 3000 });
      });
  }
}

function confirmDelete(item) {
  propertyToDelete.value = item; // Guardar la propiedad a eliminar
  deleteDialog.value = true; // Abrir diálogo de confirmación
}

function onFileSelect(event) {
  selectedFile.value = event.files[0];

  const reader = new FileReader();
  reader.onload = (e) => {
    src.value = e.target.result;
  };
  reader.readAsDataURL(selectedFile.value);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="card">
      <div class="font-semibold text-xl mb-6">My Properties</div>
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

      <DataView :value="properties" :layout="layout">
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
                  <img
                    class="rounded w-full"
                    :src="`${storageBaseUrl}${item.image_url}`"
                    :alt="item.name"
                    style="height: 150px"
                  />
                </div>
                <div class="pt-6">
                  <div class="flex flex-row justify-between items-start gap-2">
                    <div>
                      <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                      <div class="font-medium text-sm flex items-center gap-2">
                        <span v-if="addressVisibility[item.id]">{{ item.address }}</span>
                        <Button @click="toggleAddressVisibility(item.id)" class="p-button-link">
                          {{ addressVisibility[item.id] ? 'Hide address' : 'Show address' }}
                          <i
                            :class="addressVisibility[item.id] ? 'pi pi-eye-slash' : 'pi pi-eye'"
                            class="ml-2"
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <Button icon="pi pi-heart" outlined></Button>
                      <SplitButton
                        label="View areas"
                        dropdownIcon="pi pi-chevron-down"
                        @click="viewMoreAreas(item.id)"
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

        <template #list="slotProps">
          <div class="flex flex-col">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <div
                class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                :class="{ 'border-t border-surface': index !== 0 }"
              >
                <div class="md:w-40 relative">
                  <img
                    class="rounded w-full"
                    :src="`${storageBaseUrl}${item.image_url}`"
                    :alt="item.name"
                    style="max-width: 300px"
                  />
                </div>
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                  <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                    <div>
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{
                        item.type
                      }}</span>
                      <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                      <div class="text-surface-900 font-medium text-sm flex items-center gap-2">
                        <span v-if="addressVisibility[item.id]">{{ item.address }}</span>
                        <Button @click="toggleAddressVisibility(item.id)" class="p-button-link">
                          {{ addressVisibility[item.id] ? 'Hide address' : 'Show address' }}
                          <i
                            :class="addressVisibility[item.id] ? 'pi pi-eye-slash' : 'pi pi-eye'"
                            class="ml-2"
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <Button icon="pi pi-heart" outlined></Button>
                      <SplitButton
                        label="View areas"
                        dropdownIcon="pi pi-chevron-down"
                        @click="viewMoreAreas(item.id)"
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

    <!-- Diálogo para crear/editar propiedad -->
    <Dialog
      v-model:visible="propertyDialog"
      :style="{ width: '450px' }"
      header="Property Details"
      modal
      :draggable="false"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText
            id="name"
            v-model.trim="property.name"
            required="true"
            autofocus
            :invalid="submitted && !property.name"
            fluid
          />
          <small v-if="submitted && !property.name" class="text-red-500">Name is required.</small>
        </div>
        <div>
          <label for="address" class="block font-bold mb-3">Address</label>
          <InputText
            id="address"
            v-model.trim="property.address"
            required="true"
            :invalid="submitted && !property.address"
            fluid
          />
          <small v-if="submitted && !property.address" class="text-red-500"
            >Address is required.</small
          >
        </div>
        <div>
          <label for="image" class="block font-bold mb-3">Image</label>
          <div class="card flex flex-col items-center gap-6">
            <FileUpload
              mode="basic"
              accept="image/*"
              @select="onFileSelect"
              customUpload
              auto
              severity="secondary"
              class="p-button-outlined"
            />
            <img v-if="src" :src="src" alt="image" class="shadow-md rounded-xl w-full sm:w-64" />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" text @click="saveProperty" />
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
      <div>Are you sure you want to delete <b>{{ propertyToDelete?.name }}</b>?</div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="deleteDialog = false" class="p-button-text" />
        <Button label="Yes" icon="pi pi-check" @click="deleteProperty" autoFocus />
      </template>
    </Dialog>
  </div>
</template>