<script setup lang="ts">
import { ref, watch } from 'vue';
import { PropertyService } from '@/service/PropertyService';
import { ImageService } from '@/service/ImageService';
import type { IRegisterPropertyRequestDto } from '@/interfaces/properties';
import { useToast } from 'primevue/usetoast';
import { storageBaseUrl } from '@/config/firebaseConfig';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t } = useI18n();

const props = defineProps({
  visible: Boolean,
  property: {
    type: Object as () => IRegisterPropertyRequestDto,
    required: true
  },
  isEditing: Boolean
});

//emits to parent component to refresh data
const emit = defineEmits(['update:visible', 'refresh']);

const localProperty = ref<IRegisterPropertyRequestDto>({ ...props.property });
const submitted = ref(false);
const isSaving = ref(false);
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

//sync local property with parent property
watch(
  () => props.property,
  (newProperty) => {
    localProperty.value = { ...newProperty };
    imagePreview.value = newProperty.imageUrl ? `${storageBaseUrl}${newProperty.imageUrl}` : null;
  },
  { immediate: true }
);

function closeDialog() {
  //reset local property and submitted state
  localProperty.value = { name: '', address: '', imageUrl: '' };
  submitted.value = false;
  selectedFile.value = null;
  emit('update:visible', false);
}

async function saveProperty() {
  submitted.value = true;

  if (!localProperty.value.name || !localProperty.value.address) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Name and Address are required',
      life: 3000
    });
    return;
  }

  try {
    isSaving.value = true;

    if (selectedFile.value) {
      const imageName = await ImageService.uploadImage(selectedFile.value);
      if (imageName) {
        localProperty.value.imageUrl = imageName;
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Image upload failed',
          life: 3000
        });
      }
    }

    if (props.isEditing) {
      await PropertyService.updateProperty(localProperty.value);
      toast.add({
        severity: 'success',
        summary: t('myProperties.toast.propertyEdited.summary'),
        detail: t('myProperties.toast.propertyEdited.detail'),
        life: 3000
      });
    } else {
      await PropertyService.createProperty(localProperty.value);
      toast.add({
        severity: 'success',
        summary: t('myProperties.toast.propertyCreated.summary'),
        detail: t('myProperties.toast.propertyCreated.detail'),
        life: 3000
      });
    }

    emit('refresh');
    closeDialog();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as Error).message,
      life: 3000
    });
  } finally {
    isSaving.value = false;
  }
}

function onFileSelect(event: any) {
  const file = event.files[0];

  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();

    //image preview
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    :style="{ width: '450px' }"
    :header="isEditing ? $t('myProperties.dialog.editHeader') : $t('myProperties.dialog.header')"
    modal
    :draggable="false"
    :closable="false"
    >
    <div class="flex flex-col gap-6">
      <div>
        <label for="name" class="block font-bold mb-3">{{
          $t('myProperties.dialog.name.label')
        }}</label>
        <InputText
          id="name"
          v-model.trim="localProperty.name"
          required="true"
          autofocus
          :invalid="submitted && !localProperty.name"
          fluid
        />
        <small v-if="submitted && !localProperty.name" class="text-red-500">{{
          $t('myProperties.dialog.name.requiredMessage')
        }}</small>
      </div>
      <div>
        <label for="address" class="block font-bold mb-3">{{
          $t('myProperties.dialog.address.label')
        }}</label>
        <InputText
          id="address"
          v-model.trim="localProperty.address"
          required="true"
          :invalid="submitted && !localProperty.address"
          fluid
        />
        <small v-if="submitted && !localProperty.address" class="text-red-500">{{
          $t('myProperties.dialog.address.requiredMessage')
        }}</small>
      </div>
      <div>
        <label for="image" class="block font-bold mb-3">{{
          $t('myProperties.dialog.image.label')
        }}</label>
        <div class="card flex flex-col items-center gap-6">
          <img
            v-if="imagePreview"
            :src="imagePreview"
            alt="image"
            class="shadow-md rounded-xl w-full sm:w-64"
          />

          <FileUpload
            mode="basic"
            accept="image/*"
            @select="onFileSelect"
            customUpload
            auto
            severity="secondary"
            :choose-label="$t('myProperties.dialog.image.button')"
            class="p-button-outlined"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        :label="$t('myProperties.dialog.cancel')"
        icon="pi pi-times"
        text
        @click="closeDialog"
      />
      <Button
        :label="
          //if is in edit mode, show edit button, else show register button
          isEditing
            ? $t('myProperties.dialog.edit.default')
            : $t('myProperties.dialog.register.default')
        "
        icon="pi pi-check"
        :loading="isSaving"
        :disabled="isSaving"
        @click="saveProperty"
      />
    </template>
  </Dialog>
</template>
