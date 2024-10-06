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
const propertyDialog = ref(false);
const submitted = ref(false);
const addressVisibility = ref({});
const toast = useToast();
const fileupload = ref();

const picklistProperties = ref(null);
const orderlistProperties = ref(null);
const options = ref(['grid', 'list']);
const layout = ref('grid');
const selectedFile = ref<File | null>(null);

onMounted(() => {
  loadProperties();
});

function loadProperties() {
  PropertyService.getPropertiesSmall().then((data) => {
    properties.value = data.slice(0, 6);
    picklistProperties.value = [data, []];
    orderlistProperties.value = data;
  });
}

function viewMoreAreas(propertyId) {
  router.push(`/my-properties/${propertyId}/my-areas`);
}

function toggleAddressVisibility(propertyId) {
  addressVisibility.value[propertyId] = !addressVisibility.value[propertyId];
}

function openNew() {
  property.value = { name: '', address: '', user_id: 'abc123', image_url: '' };
  submitted.value = false;
  propertyDialog.value = true;
}

function hideDialog() {
  propertyDialog.value = false;
  submitted.value = false;
}

async function saveProperty() {
  submitted.value = true;

  if (!property.value.name || !property.value.address) {
    return; // Validación básica de campos
  }

  if (selectedFile.value) {
    const imageName = await imageService.uploadImage(selectedFile.value);  // Subir la imagen a Firebase

    if (imageName) {
      property.value.image_url = imageName;  // Guardar solo el nombre de la imagen en la propiedad
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Image upload failed', life: 3000 });
      return; // Detener si no se pudo subir la imagen
    }
  }

  PropertyService.createProperty(property.value).then(() => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Property Created', life: 3000 });
    PropertyService.getPropertiesSmall().then((data) => {
      properties.value = data.slice(0, 6);
    });
    propertyDialog.value = false;
    property.value = { name: '', image_url: '', address: '', user_id: 'abc123' };
  }).catch(() => {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create property', life: 3000 });
  });
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]; // Guardar el archivo seleccionado
  }
}

/*function upload() {
  fileupload.value.upload();
}

function onUpload() {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}*/
</script>

<template>
  <div class="flex flex-col">
    <div class="card">
      <div class="font-semibold text-xl">My Properties</div>
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
                    :src="`${storageBaseUrl}${item.image_url}`"
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
                      <Button
                        icon="pi pi-plus"
                        label="View areas"
                        @click="viewMoreAreas(item.id)"
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
                      :src="`${storageBaseUrl}${item.image_url}`"
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
                    </div>
                  </div>
                  <div class="flex flex-col gap-6 mt-6">
                    <span class="text-2xl font-semibold">{{ item.name }}</span>
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
                    <div class="flex gap-2">
                      <Button
                        icon="pi pi-plus"
                        label="View areas"
                        @click="viewMoreAreas(item.id)"
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
      v-model:visible="propertyDialog"
      :style="{ width: '450px' }"
      header="Property Details"
      :modal="true"
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
            autofocus
            :invalid="submitted && !property.address"
            fluid
          />
          <small v-if="submitted && !property.address" class="text-red-500"
            >Address is required.</small
          >
        </div>
        <div>
          <label for="image" class="block font-bold mb-3">Image</label>
          <input type="file" id="image" accept="image/*" @change="onFileChange" />
        </div>
        <!--<div>
          <label for="image" class="block font-bold mb-3">Image</label>
          <FileUpload
            name="image[]"
            @uploader="onUpload"
            accept="image/*"
            :maxFileSize="1000000"
            autofocus
            :invalid="submitted && !property.image"
            fluid
          />
        </div>-->
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveProperty" />
      </template>
    </Dialog>
  </div>
</template>
