import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCgptmNwt8VGM-eYUp13PMCfPL5QStcaTM',
  authDomain: 'verysafe-db940.firebaseapp.com',
  projectId: 'verysafe-db940',
  storageBucket: 'verysafe-db940.appspot.com',
  messagingSenderId: '1077035881860',
  appId: '1:1077035881860:web:7d9851e5db42182c1279d1',
  measurementId: 'G-YCMFJ188LY'
};

// Inicializa la aplicación de Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Exporta el servicio de almacenamiento de Firebase
export const storage = getStorage(firebaseApp);

export const storageBaseUrl =
  'https://firebasestorage.googleapis.com/v0/b/verysafe-db940.appspot.com/o/images%2F';
