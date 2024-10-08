import { storage } from '@/config/firebaseConfig'; // Importa la instancia de storage desde firebaseConfig
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const imageService = {
  async uploadImage(file: File) {
    const imageRef = ref(storage, `images/${uuidv4()}.${file.name.split('.').pop()}`);
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    const shortURL = downloadURL.split('%2F').pop();
    return shortURL;
  },

  async deleteImage(item: any): Promise<void> {
    if (item && item.image_url) {
      const imageRef = ref(storage, `images/${item.image_url?.split('?')[0]}`);
      await deleteObject(imageRef);
    }
  }
};
