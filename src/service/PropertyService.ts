import { httpClient } from '@/config/httpClient';
import { storage } from '@/config/firebaseConfig';
import { deleteObject, ref } from 'firebase/storage';
import { type IProperty } from '@/interfaces/properties';

const serviceName = '/properties';

export const PropertyService = {
  async getProperties(): Promise<IProperty[]> {
    const response = await httpClient.get<IProperty[]>(`${serviceName}`);
    return response.data;
  },

  async getPropertiesMini(): Promise<IProperty[]> {
    const response = await httpClient.get<IProperty[]>(`${serviceName}`);
    return response.data.slice(0, 5);
  },

  async getPropertiesSmall(): Promise<IProperty[]> {
    const response = await httpClient.get<IProperty[]>(`${serviceName}`);
    return response.data.slice(0, 10);
  },

  async getPropertyById(propertyId: string): Promise<IProperty[]> {
    const response = await httpClient.get<IProperty[]>(`${serviceName}/?id=${propertyId}`);
    return response.data;
  },

  async createProperty(property: IProperty): Promise<IProperty> {
    if (!property.image_url) {
      property.image_url =
        'icons%2Fimage-default.jpg?alt=media&token=ad9f427e-0e10-4921-84b1-def775f541e7'; // Ruta a la imagen por defecto
    }
    const response = await httpClient.post<IProperty>(`${serviceName}`, property);
    return response.data;
  },

  async updateProperty(propertyId: string, propertyData: IProperty): Promise<void> {
    const response = await httpClient.put<void>(`${serviceName}/${propertyId}`, propertyData);
    return response.data;
  },

  async deleteProperty(propertyId: string): Promise<void> {
    const properties = await this.getPropertyById(propertyId);
    const property = properties[0];

    if (property && property.image_url) {
      const imageRef = ref(storage, `images/${property.image_url?.split('?')[0]}`);
      await deleteObject(imageRef);
    }

    const response = await httpClient.delete<void>(`${serviceName}/${propertyId}`);
    return response.data;
  }
};
