import { httpClient } from '@/config/httpClient';

const serviceName = '/devices';

export const DeviceService = {
  async getDevices() {
    const response = await httpClient.get(`${serviceName}`);
    return response.data;
  },

  async getDevicesByAreaId(areaId: string) {
    const response = await httpClient.get(`${serviceName}/?area_id=${areaId}`);
    return response.data;
  },

  async getDevicesMiniByAreaId(areaId: string) {
    const response = await httpClient.get(`${serviceName}/?area_id=${areaId}`);
    return response.data.slice(0, 5);
  },

  async getDevicesSmallByAreaId(areaId: string) {
    const response = await httpClient.get(`${serviceName}/?area_id=${areaId}`);
    return response.data.slice(0, 10);
  }
};
