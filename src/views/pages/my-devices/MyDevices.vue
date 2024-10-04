<script setup lang="ts">
import { EDeviceType } from '@/interfaces/devices';
import { NodeService } from '@/service/NodeService';
import { getRegisteredDevices } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
  getRegisteredDevices().then((data) => {
    products.value = data;
  });

  NodeService.getTreeNodes().then((data) => (treeSelectNodes.value = data));
});

const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const product = ref({});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
  { label: 'INSTOCK', value: 'instock' },
  { label: 'LOWSTOCK', value: 'lowstock' },
  { label: 'OUTOFSTOCK', value: 'outofstock' }
]);
const selectedDevice = ref();
const groupedDevices = ref([
  {
    label: 'Cameras',
    icon: 'pi pi-fw pi-video',
    items: [
      { label: 'Camera 1', value: 'Camera 1' },
      { label: 'Camera 2', value: 'Camera 2' },
      { label: 'Camera 3', value: 'Camera 3' }
    ]
  },
  {
    label: 'Actuators',
    icon: 'pi pi-fw pi-cog',
    items: [
      { label: 'Actuator 1', value: 'Actuator 1' },
      { label: 'Actuator 2', value: 'Actuator 2' },
      { label: 'Actuator 3', value: 'Actuator 3' }
    ]
  },
  {
    label: 'Sensors',
    icon: 'pi pi-fw pi-chart-bar',
    items: [
      { label: 'Sensor 1', value: 'Sensor 1' },
      { label: 'Sensor 2', value: 'Sensor 2' },
      { label: 'Sensor 3', value: 'Sensor 3' }
    ]
  },
  {
    label: 'Controllers',
    icon: 'pi pi-fw pi-desktop',
    items: [
      { label: 'Controller 1', value: 'Controller 1' },
      { label: 'Controller 2', value: 'Controller 2' },
      { label: 'Controller 3', value: 'Controller 3' }
    ]
  },
  {
    label: 'Displays',
    icon: 'pi pi-fw pi-desktop',
    items: [
      { label: 'Display 1', value: 'Display 1' },
      { label: 'Display 2', value: 'Display 2' },
      { label: 'Display 3', value: 'Display 3' }
    ]
  }
]);

function openNew() {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
}

function hideDialog() {
  productDialog.value = false;
  submitted.value = false;
}

function saveProduct() {
  submitted.value = true;

  if (product?.value.name?.trim()) {
    if (product.value.id) {
      product.value.inventoryStatus = product.value.inventoryStatus.value
        ? product.value.inventoryStatus.value
        : product.value.inventoryStatus;
      products.value[findIndexById(product.value.id)] = product.value;
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Product Updated',
        life: 3000
      });
    } else {
      product.value.id = createId();
      product.value.code = createId();
      product.value.image = 'product-placeholder.svg';
      product.value.inventoryStatus = product.value.inventoryStatus
        ? product.value.inventoryStatus.value
        : 'INSTOCK';
      products.value.push(product.value);
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Product Created',
        life: 3000
      });
    }

    productDialog.value = false;
    product.value = {};
  }
}

function editProduct(prod) {
  product.value = { ...prod };
  productDialog.value = true;
}

function confirmDeleteProduct(prod) {
  product.value = prod;
  deleteProductDialog.value = true;
}

function deleteProduct() {
  products.value = products.value.filter((val) => val.id !== product.value.id);
  deleteProductDialog.value = false;
  product.value = {};
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
}

function findIndexById(id) {
  let index = -1;
  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
}

function createId() {
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function getStatusLabel(type: EDeviceType) {
  switch (type) {
    case EDeviceType.ACTUATOR:
      return 'success';
    case EDeviceType.SENSOR:
      return 'warn';
    case EDeviceType.CONTROLLER:
      return 'danger';
    case EDeviceType.CAMERA:
      return 'info';
    case EDeviceType.DISPLAY:
      return 'secondary';
    default:
      return 'primary';
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
      :value="products"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
    >
      <!-- HEADER -->
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <Button label="Add" icon="pi pi-plus" @click="openNew" raised />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </IconField>
        </div>
      </template>

      <!-- COLUMNS -->
      <Column field="name" header="Name" style="min-width: 16rem"></Column>
      <Column header="Image">
        <template #body="slotProps">
          <img
            :src="`https://primefaces.org/cdn/primevue/images/product/black-watch.jpg`"
            :alt="slotProps.data.image"
            class="rounded"
            style="width: 64px"
          />
        </template>
      </Column>
      <Column field="brand" header="Brand" style="min-width: 10rem"></Column>
      <Column field="model" header="Model" style="min-width: 10rem"></Column>
      <Column field="type" header="Type" style="min-width: 12rem">
        <template #body="slotProps">
          <Tag :value="slotProps.data.type" :severity="getStatusLabel(slotProps.data.type)" />
        </template>
      </Column>
      <Column header="Actions" style="min-width: 12rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            class="mr-2"
            @click="editProduct(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDeleteProduct(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <Dialog
    v-model:visible="productDialog"
    :style="{ width: '450px' }"
    header="Register a new device"
    :modal="true"
  >
    <Stepper value="1">
      <StepItem value="1">
        <Step>Select the device type</Step>
        <StepPanel v-slot="{ activateCallback }">
          <label for="deviceSelect" class="block font-bold mb-3">Device</label>
          <Select
          id="deviceSelect"
            v-model="selectedDevice"
            :options="groupedDevices"
            optionLabel="label"
            optionGroupLabel="label"
            optionGroupChildren="items"
            placeholder="Select a device"
            :show-clear="true"
            fluid
          >
            <template #optiongroup="slotProps">
              <div class="flex items-center">
                <i :class="`mr-2 ${slotProps.option.icon}`"/>
                <div>{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Select>
          <div class="py-6">
            <Button label="Next" @click="activateCallback('2')" />
          </div>
        </StepPanel>
      </StepItem>
      <StepItem value="2">
        <Step>Header II</Step>
        <StepPanel v-slot="{ activateCallback }">
          <div class="flex flex-col h-48">
            <div
              class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
            >
              Content II
            </div>
          </div>
          <div class="flex py-6 gap-2">
            <Button label="Back" severity="secondary" @click="activateCallback('1')" />
            <Button label="Next" @click="activateCallback('3')" />
          </div>
        </StepPanel>
      </StepItem>
      <StepItem value="3">
        <Step>Header III</Step>
        <StepPanel v-slot="{ activateCallback }">
          <div class="flex flex-col h-48">
            <div
              class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
            >
              Content III
            </div>
          </div>
          <div class="py-6">
            <Button label="Back" severity="secondary" @click="activateCallback('2')" />
          </div>
        </StepPanel>
      </StepItem>
    </Stepper>

    <div class="flex flex-col gap-6">
      <img
        v-if="product.image"
        :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"
        :alt="product.image"
        class="block m-auto pb-4"
      />
      <div>
        <label for="name" class="block font-bold mb-3">Name</label>
        <InputText
          id="name"
          v-model.trim="product.name"
          required="true"
          autofocus
          :invalid="submitted && !product.name"
          fluid
        />
        <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>
      </div>
      <div>
        <label for="description" class="block font-bold mb-3">Description</label>
        <Textarea
          id="description"
          v-model="product.description"
          required="true"
          rows="3"
          cols="20"
          fluid
        />
      </div>
      <div>
        <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
        <Select
          id="inventoryStatus"
          v-model="product.inventoryStatus"
          :options="statuses"
          optionLabel="label"
          placeholder="Select a Status"
          fluid
        ></Select>
      </div>

      <div>
        <span class="block font-bold mb-4">Category</span>
        <div class="grid grid-cols-12 gap-4">
          <div class="flex items-center gap-2 col-span-6">
            <RadioButton
              id="category1"
              v-model="product.category"
              name="category"
              value="Accessories"
            />
            <label for="category1">Accessories</label>
          </div>
          <div class="flex items-center gap-2 col-span-6">
            <RadioButton
              id="category2"
              v-model="product.category"
              name="category"
              value="Clothing"
            />
            <label for="category2">Clothing</label>
          </div>
          <div class="flex items-center gap-2 col-span-6">
            <RadioButton
              id="category3"
              v-model="product.category"
              name="category"
              value="Electronics"
            />
            <label for="category3">Electronics</label>
          </div>
          <div class="flex items-center gap-2 col-span-6">
            <RadioButton
              id="category4"
              v-model="product.category"
              name="category"
              value="Fitness"
            />
            <label for="category4">Fitness</label>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
          <label for="price" class="block font-bold mb-3">Price</label>
          <InputNumber
            id="price"
            v-model="product.price"
            mode="currency"
            currency="USD"
            locale="en-US"
            fluid
          />
        </div>
        <div class="col-span-6">
          <label for="quantity" class="block font-bold mb-3">Quantity</label>
          <InputNumber id="quantity" v-model="product.quantity" integeronly fluid />
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Save" icon="pi pi-check" @click="saveProduct" />
    </template>
  </Dialog>

  <Dialog
    v-model:visible="deleteProductDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="product"
        >Are you sure you want to delete <b>{{ product.name }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
      <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
    </template>
  </Dialog>
</template>
