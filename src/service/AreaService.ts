import { httpClient } from '@/config/httpClient';
import type { IArea } from '@/interfaces/areas';

const serviceName = '/areas';

export const AreaService = {
  async getAreas(): Promise<IArea[]> {
    const response = await httpClient.get<IArea[]>(`${serviceName}`);
    return response.data;
  },

  async getAreasMiniByPropertyId(propertyId: string): Promise<IArea[]> {
    const response = await httpClient.get<IArea[]>(`${serviceName}/?property_id=${propertyId}`);
    return response.data.slice(0, 5);
  },

  async getAreasSmallByPropertyId(propertyId: string): Promise<IArea[]> {
    const response = await httpClient.get<IArea[]>(`${serviceName}/?property_id=${propertyId}`);
    return response.data.slice(0, 10);
  },

  async getAreaById(areaId: string): Promise<IArea> {
    const response = await httpClient.get<IArea>(`${serviceName}/?id=${areaId}`);
    return response.data;
  },

  async getAreasByPropertyId(propertyId: string): Promise<IArea[]> {
    const response = await httpClient.get<IArea[]>(`${serviceName}/?property_id=${propertyId}`);
    return response.data;
  },

  async createArea(area: IArea): Promise<IArea> {
    if (!area.icon_id) {
      area.icon_id = '1';
    }
    const response = await httpClient.post<IArea>(`${serviceName}`, area);
    return response.data;
  },

  async updateArea(areaId: string, areaData: IArea): Promise<void> {
    const response = await httpClient.put<void>(`${serviceName}/${areaId}`, areaData);
    return response.data;
  },

  async deleteArea(areaId: string): Promise<void> {
    const response = await httpClient.delete<void>(`${serviceName}/${areaId}`);
    return response.data;
  }
};
