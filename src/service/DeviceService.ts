import { httpClient } from '@/config/httpClient';
import type { IApiResponse } from '@/interfaces/common';
import type {
  IDeviceCatalog,
  IRegisterDeviceRequestDto,
  IRegisteredDevice
} from '@/interfaces/devices';

const serviceName = '/devices';

export const DeviceService = {
  //services using API
  async getDeviceCatalog(): Promise<IApiResponse<IDeviceCatalog[]>> {
    const res = await httpClient.get<IApiResponse<IDeviceCatalog[]>>(`${serviceName}/catalog`);
    return res.data;
  },
  async getRegisteredDevices(): Promise<IApiResponse<IRegisteredDevice[]>> {
    const res = await httpClient.get<IApiResponse<IRegisteredDevice[]>>(
      `${serviceName}/registered`
    );
    return res.data;
  },
  async getRegisteredDevicesForArea(areaId: number): Promise<IApiResponse<IRegisteredDevice[]>> {
    const res = await httpClient.get<IApiResponse<IRegisteredDevice[]>>(
      `${serviceName}/registered/${areaId}`
    );
    return res.data;
  },
  async registerDevice(data: IRegisterDeviceRequestDto): Promise<IApiResponse> {
    const res = await httpClient.post<IApiResponse>(`${serviceName}/register`, data);
    return res.data;
  },
  async unregisterDevice(registrationId: number): Promise<IApiResponse> {
    const res = await httpClient.delete<IApiResponse>(
      `${serviceName}/unregister/${registrationId}`
    );
    return res.data;
  }
};
