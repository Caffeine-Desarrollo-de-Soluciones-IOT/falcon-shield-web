import { httpClient } from '@/config/httpClient';
import type { IArea, IRegisterAreaRequestDto } from '@/interfaces/areas';
import type { IApiResponse } from '../interfaces/common';

const serviceName = '/areas';

export const AreaService = {
  async getRegisteredAreas(): Promise<IApiResponse<IArea[]>> {
    const response = await httpClient.get<IApiResponse<IArea[]>>(`${serviceName}/all`);
    return response.data;
  },

  async getAreasByPropertyId(propertyId: number): Promise<IApiResponse<IArea[]>> {
    const response = await httpClient.get<IApiResponse<IArea[]>>(
      `${serviceName}/all/${propertyId}`
    );
    return response.data;
  },

  async getAreaById(areaId: number): Promise<IApiResponse<IArea>> {
    const response = await httpClient.get<IApiResponse<IArea>>(`${serviceName}/${areaId}`);
    return response.data;
  },

  async createArea(propertyId: number, request: IRegisterAreaRequestDto): Promise<IApiResponse> {
    if (!request.icon) {
      request.icon = '1';
    }
    const response = await httpClient.post<IApiResponse>(
      `${serviceName}/register/${propertyId}`,
      request
    );
    return response.data;
  },

  async deleteArea(areaId: number): Promise<IApiResponse> {
    const response = await httpClient.delete<IApiResponse>(`${serviceName}/unregister/${areaId}`);
    return response.data;
  }
};
