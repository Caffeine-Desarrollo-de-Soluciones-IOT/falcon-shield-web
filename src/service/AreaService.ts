import { httpClient } from '@/config/httpClient';
import type { IArea } from '@/interfaces/areas';

const serviceName = '/areas';

export const AreaService = {
  async getAreas() {
    const response = await httpClient.get(`${serviceName}`);
    return response.data;
  },

  async getAreaById(areaId: string) {
    const response = await httpClient.get(`${serviceName}/?id=${areaId}`);
    return response.data;
  },

  async getAreasByPropertyId(propertyId: string) {
    const response = await httpClient.get(`${serviceName}/?property_id=${propertyId}`);
    return response.data;
  },

  async getAreasMiniByPropertyId(propertyId: string) {
    const response = await httpClient.get(`${serviceName}/?property_id=${propertyId}`);
    return response.data.slice(0, 5);
  },

  async getAreasSmallByPropertyId(propertyId: string) {
    const response = await httpClient.get(`${serviceName}/?property_id=${propertyId}`);
    return response.data.slice(0, 10);
  },

  async createArea(area: IArea): Promise<IArea> {
    const response = await httpClient.post(`${serviceName}`, area);
    return response.data;
  }
};
