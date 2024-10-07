import { httpClient } from '@/config/httpClient';
import { type IProperty } from '@/interfaces/properties';

const serviceName = '/properties';

export const PropertyService = {
  async getProperties(): Promise<IProperty[]> {
    const response = await httpClient.get(`${serviceName}`);
    return response.data;
  },

  async getPropertiesMini() {
    const response = await httpClient.get(`${serviceName}`);
    return response.data.slice(0, 5);
  },

  async getPropertiesSmall() {
    const response = await httpClient.get(`${serviceName}`);
    return response.data.slice(0, 10);
  },

  async getPropertyById(propertyId: string) {
    const response = await httpClient.get(`${serviceName}/?id=${propertyId}`);
    return response.data;
  },

  async createProperty(property: IProperty): Promise<IProperty> {
    const response = await httpClient.post(`${serviceName}`, property);
    return response.data;
  }
};