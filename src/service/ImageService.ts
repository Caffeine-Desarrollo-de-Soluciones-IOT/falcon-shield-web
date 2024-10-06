import { storage } from '@/config/firebaseConfig'; // Importa la instancia de storage desde firebaseConfig
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const imageService = {
  async uploadImage(file: File) {
    const imageRef = ref(storage, `images/${uuidv4()}.${file.name.split('.').pop()}`);
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    const shortURL = downloadURL.split('%2F').pop();
    return shortURL;
  }
};
