<script setup lang="ts">
import { PropertyService } from '@/service/PropertyService';
import { ImageService } from '@/service/ImageService';
import { storageBaseUrl } from '@/config/firebaseConfig';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { type IProperty, type IRegisterPropertyRequestDto } from '@/interfaces/properties';
import type { MenuItem } from 'primevue/menuitem';

const toast = useToast();
const registerDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const submitted = ref(false);
const registeredProperties = ref<IProperty[]>([]);
const newProperty = ref<IRegisterPropertyRequestDto>({} as IRegisterPropertyRequestDto);
const selectedPropertyRegistration = ref<IProperty>();

const loadingList = ref(false);
const registeringProperty = ref(false);
const unregisteringProperty = ref(false);

const router = useRouter();
const addressVisibility = ref<any>({});
const selectedFile = ref<File | null>(null);
const src = ref<string | null>(null); // Para la vista previa de la imagen

const options = ref(['grid', 'list']);
const layout = ref<'grid' | 'list'>('grid');
const menu = ref<any>(null);

const menuItems = (item: IProperty): MenuItem[] => [
  {
    label: 'Delete',
    icon: 'pi pi-times',
    command: () => {
      confirmDelete(item);
    }
  }
];

onMounted(async () => {
  await loadProperties();
});

function openNew() {
  newProperty.value = {} as IRegisterPropertyRequestDto;
  submitted.value = false;
  registerDialogVisible.value = true;
  src.value = null; //reset image preview
}

function hideDialog() {
  registerDialogVisible.value = false;
  submitted.value = false;
  newProperty.value = {} as IRegisterPropertyRequestDto;
}

async function saveProperty() {
  submitted.value = true;

  if (newProperty.value.name && newProperty.value.address) {
    try {
      registeringProperty.value = true;

      //save image
      if (selectedFile.value) {
        const imageName = await ImageService.uploadImage(selectedFile.value);

        if (imageName) {
          newProperty.value.imageUrl = imageName;
        } else {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Image upload failed',
            life: 3000
          });
        }
      }

      //save property
      await PropertyService.createProperty(newProperty.value);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Property Created',
        life: 3000
      });

      hideDialog();

      //refresh
      await loadProperties();
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
        life: 3000
      });
    } finally {
      registeringProperty.value = false;
    }
  }
}

// function editProperty(item: IProperty) {
//   // Copiar la propiedad seleccionada y abrir el diálogo de edición
//   newProperty.value = { ...item };
//   registeringProperty.value = true; // Asegurarse de que solo se abre el diálogo de edición
//   src.value = `${storageBaseUrl}${item.imageUrl}`; // Mostrar la imagen actual en la vista previa
// }

function confirmDelete(propertyRegistrationId: IProperty) {
  selectedPropertyRegistration.value = propertyRegistrationId;
  deleteDialogVisible.value = true;
}

async function deleteProperty() {
  try {
    unregisteringProperty.value = true;
    await PropertyService.deleteProperty(selectedPropertyRegistration.value!.id);

    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Property deleted',
      life: 3000
    });
    deleteDialogVisible.value = false;
    selectedPropertyRegistration.value = {} as IProperty;

    await loadProperties();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as Error).message,
      life: 3000
    });
  } finally {
    unregisteringProperty.value = false;
  }
}

async function loadProperties() {
  try {
    loadingList.value = true;
    const response = await PropertyService.getPropertiesSmall();
    registeredProperties.value = response.data.slice(0, 6);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error fetching properties',
      life: 3000
    });
  } finally {
    loadingList.value = false;
  }
}

function viewMoreAreas(propertyId: number) {
  router.push(`/my-properties/${propertyId}/my-areas`);
}

function toggleAddressVisibility(propertyId: number) {
  addressVisibility.value[propertyId] = !addressVisibility.value[propertyId];
}

function onFileSelect(event: any) {
  selectedFile.value = event.files[0];

  const reader = new FileReader();
  reader.onload = (e) => {
    src.value = e.target?.result as string;
  };

  if (selectedFile.value) {
    reader.readAsDataURL(selectedFile.value);
  }
}

function toggleMenu(event: any, index: number) {
  menu.value[index].toggle(event);
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">My Properties</div>
    <p>Manage your properties & areas</p>

    <Toolbar class="mt-6">
      <template #start>
        <Button label="Register property" icon="pi pi-plus" @click="openNew" />
      </template>

      <template #end>
        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
          <template #option="{ option }">
            <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
            {{ option.charAt(0).toUpperCase() + option.slice(1) }}
          </template>
        </SelectButton>
      </template>
    </Toolbar>

    <DataView class="mt-6" :value="registeredProperties" :layout="layout" paginator :rows="5" data-key="id">
      <!-- GRID VIEW -->
      <template #grid="slotProps">
        <div class="grid grid-cols-12 gap-4">
          <div v-for="(item, index) in slotProps.items" :key="index"
            class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
            <div v-if="item"
              class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
              <div class="bg-surface-50 flex justify-center rounded p-4">
                <div class="relative mx-auto">
                  <img class="rounded w-full" :src="`${storageBaseUrl}${item.imageUrl}`" :alt="item.name"
                    style="max-width: 300px" />
                </div>
              </div>
              <div class="pt-6">
                <div class="flex flex-row justify-between items-start gap-2">
                  <div>
                    <!-- name -->
                    <div class="text-lg font-medium mt-1">{{ item.name }}</div>

                    <!-- address -->
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm"
                      v-if="addressVisibility[item.id]">
                      {{ item.address }}
                    </span>
                  </div>

                  <Button @click="toggleAddressVisibility(item.id)" class="p-button-link flex items-center">
                    {{ addressVisibility[item.id] ? 'Hide address' : 'Show address' }}
                    <i :class="addressVisibility[item.id] ? 'pi pi-eye-slash' : 'pi pi-eye'" />
                  </Button>
                </div>

                <div class="flex flex-col gap-6 mt-6">
                  <div class="flex gap-2">
                    <Button icon="pi pi-th-large" label="View areas" class="flex-auto whitespace-nowrap"
                      @click="viewMoreAreas(item.id)"></Button>

                    <!-- MENU BUTTON -->
                    <Menu ref="menu" :model="menuItems(item)" :popup="true" />
                    <Button type="button" icon="pi pi-ellipsis-v" @click="toggleMenu($event, index)" outlined />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- LIST VIEW -->
      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <div v-if="item" class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
              :class="{ 'border-t border-surface': index !== 0 }">
              <div class="md:w-40 relative">
                <img class="block xl:block mx-auto rounded w-full" :src="`${storageBaseUrl}${item.imageUrl}`"
                  :alt="item.name" />
              </div>

              <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                  <div>
                    <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm"
                      v-if="addressVisibility[item.id]">{{ item.address }}</span>
                  </div>
                </div>
                <div class="flex flex-col md:items-end gap-8">
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <Button @click="toggleAddressVisibility(item.id)" class="p-button-link flex items-center">
                      {{ addressVisibility[item.id] ? 'Hide address' : 'Show address' }}
                      <i :class="addressVisibility[item.id] ? 'pi pi-eye-slash' : 'pi pi-eye'" />
                    </Button>

                    <Button icon="pi pi-th-large" label="View areas" class="flex-auto whitespace-nowrap"
                      @click="viewMoreAreas(item.id)"></Button>

                    <!-- MENU BUTTON -->
                    <Menu ref="menu" :model="menuItems(item)" :popup="true" />
                    <Button type="button" icon="pi pi-ellipsis-v" @click="toggleMenu($event, index)" outlined />
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
  <Dialog v-model:visible="registerDialogVisible" :style="{ width: '450px' }" header="Property Details" modal
    :draggable="false">
    <div class="flex flex-col gap-6">
      <div>
        <label for="name" class="block font-bold mb-3">Name</label>
        <InputText id="name" v-model.trim="newProperty.name" required="true" autofocus
          :invalid="submitted && !newProperty.name" fluid />
        <small v-if="submitted && !newProperty.name" class="text-red-500">Name is required.</small>
      </div>
      <div>
        <label for="address" class="block font-bold mb-3">Address</label>
        <InputText id="address" v-model.trim="newProperty.address" required="true"
          :invalid="submitted && !newProperty.address" fluid />
        <small v-if="submitted && !newProperty.address" class="text-red-500">Address is required.</small>
      </div>
      <div>
        <label for="image" class="block font-bold mb-3">Image</label>
        <div class="card flex flex-col items-center gap-6">
          <FileUpload mode="basic" accept="image/*" @select="onFileSelect" customUpload auto severity="secondary"
            class="p-button-outlined" />
          <img v-if="src" :src="src" alt="image" class="shadow-md rounded-xl w-full sm:w-64" />
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button icon="pi pi-check" :label="registeringProperty ? 'Registering...' : 'Register'"
        :loading="registeringProperty" :disabled="registeringProperty" @click="saveProperty" />
    </template>
  </Dialog>

  <!-- Diálogo para confirmar eliminación -->
  <Dialog v-model:visible="deleteDialogVisible" :style="{ width: '450px' }" header="Confirm" modal :draggable="false">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="selectedPropertyRegistration">Are you sure you want to delete <b>{{ selectedPropertyRegistration.name
          }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" severity="secondary" text @click="deleteDialogVisible = false" />
      <Button :label="unregisteringProperty ? 'Unregistering...' : 'Yes'" icon="pi pi-check" severity="danger"
        :loading="unregisteringProperty" @click="deleteProperty()" autoFocus />
    </template>
  </Dialog>
</template>
