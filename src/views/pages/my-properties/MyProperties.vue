<script setup lang="ts">
import { PropertyService } from '@/service/PropertyService';
import { storageBaseUrl } from '@/config/firebaseConfig';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { type IProperty, type IRegisterPropertyRequestDto } from '@/interfaces/properties';
import type { MenuItem } from 'primevue/menuitem';
import PropertyDialog from './components/PropertyDialog.vue';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const registerDialogVisible = ref(false);
const registeredProperties = ref<IProperty[]>([]);
const currentProperty = ref<IRegisterPropertyRequestDto>({ name: '', address: '', imageUrl: '' });
const isEditing = ref(false);
const loadingList = ref(false);
const addressVisibility = ref<any>({});

const router = useRouter();
const { t } = useI18n();

const options = ref(['grid', 'list']);
const layout = ref<'grid' | 'list'>('grid');
const menu = ref<any>(null);

const menuItems = (item: IProperty): MenuItem[] => [
  {
    label: t('myProperties.menu.edit'),
    icon: 'pi pi-pencil',
    command: () => editProperty(item)
  }
];

onMounted(async () => {
  await loadProperties();
});

function openNew() {
  isEditing.value = false;
  currentProperty.value = { name: '', address: '', imageUrl: '' };
  registerDialogVisible.value = true;
}

function editProperty(property: any) {
  isEditing.value = true;
  currentProperty.value = { ...property };
  registerDialogVisible.value = true;
}

async function loadProperties() {
  try {
    loadingList.value = true;
    const response = await PropertyService.getPropertiesSmall();
    registeredProperties.value = response.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('myProperties.toast.error.summary'),
      detail: t('myProperties.toast.error.detail'),
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

function toggleMenu(event: any, index: number) {
  menu.value[index].toggle(event);
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">{{ $t('myProperties.title') }}</div>
    <p>{{ $t('myProperties.description') }}</p>

    <Toolbar class="mt-6">
      <template #start>
        <Button :label="$t('myProperties.registerProperty')" icon="pi pi-plus" @click="openNew" />
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

    <div v-if="loadingList" class="mt-6 text-center">{{ $t('myProperties.loading') }}</div>
    <DataView v-else class="mt-6" :value="registeredProperties" :layout="layout" paginator :rows="5" data-key="id">
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
                    {{ addressVisibility[item.id] ? $t('myProperties.hideAddress') : $t('myProperties.showAddress') }}
                    <i :class="addressVisibility[item.id] ? 'pi pi-eye-slash' : 'pi pi-eye'" />
                  </Button>
                </div>

                <div class="flex flex-col gap-6 mt-6">
                  <div class="flex gap-2">
                    <Button icon="pi pi-th-large" :label="$t('myProperties.viewAreas')" class="flex-auto whitespace-nowrap"
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
                      {{ addressVisibility[item.id] ? $t('myProperties.hideAddress') : $t('myProperties.showAddress') }}
                      <i :class="addressVisibility[item.id] ? 'pi pi-eye-slash' : 'pi pi-eye'" />
                    </Button>

                    <Button icon="pi pi-th-large" :label="$t('myProperties.viewAreas')" class="flex-auto whitespace-nowrap"
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

  <!-- DIALOG FOR REGISTER/EDIT PROPERTY -->
  <PropertyDialog
    :visible="registerDialogVisible"
    :property="currentProperty"
    :isEditing="isEditing"
    @update:visible="registerDialogVisible = $event"
    @refresh="loadProperties"
  />
</template>
