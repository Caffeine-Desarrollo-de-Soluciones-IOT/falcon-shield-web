import { httpClient } from '@/config/httpClient';
import type { IDevice } from '@/interfaces/devices';

const serviceName = '/devices';

export const DeviceService = {
  async getDevices(): Promise<IDevice[]> {
    const response = await httpClient.get<IDevice[]>(`${serviceName}`);
    return response.data;
  },

  async getDevicesByAreaId_PropertyId(areaId: string, propertyId: string): Promise<IDevice[]> {
    const response = await httpClient.get<IDevice[]>(
      `${serviceName}/?area_id=${areaId}&property_id=${propertyId}`
    );
    return response.data;
  },

  async createDevice(device: IDevice): Promise<IDevice> {
    const response = await httpClient.post<IDevice>(`${serviceName}`, device);
    return response.data;
  },

  async updateDevice(deviceId: string, deviceData: IDevice): Promise<void> {
    const response = await httpClient.put<void>(`${serviceName}/${deviceId}`, deviceData);
    return response.data;
  },

  async deleteDevice(deviceId: string): Promise<void> {
    const response = await httpClient.delete<void>(`${serviceName}/${deviceId}`);
    return response.data;
  }
};
