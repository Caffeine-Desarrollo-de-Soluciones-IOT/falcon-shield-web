import { httpClient } from '@/config/httpClient';
import type { IApiResponse } from '@/interfaces/common';
import type { IArea, IDevice, IDeviceCatalog, IProperty, IRegisterDeviceRequestDto, IRegisteredDevice } from '@/interfaces/devices';

const serviceName = '/devices';

export const DeviceService = {
  //services using API
  async getDeviceCatalog(): Promise<IApiResponse<IDeviceCatalog[]>> {
    const res = await httpClient.get<IApiResponse<IDeviceCatalog[]>>(`${serviceName}/catalog`);
    return res.data;
  },
  async getRegisteredDevices(): Promise<IApiResponse<IRegisteredDevice[]>> {
    const res = await httpClient.get<IApiResponse<IRegisteredDevice[]>>(`${serviceName}/registered`);
    return res.data;
  },
  async registerDevice(data: IRegisterDeviceRequestDto): Promise<IApiResponse> {
    const res = await httpClient.post<IApiResponse>(`${serviceName}/register`, data);
    return res.data;
  },
  //todo: implement the rest of the services
  async getUserProperties(): Promise<IProperty[]> {
    return Promise.resolve([
      {
        id: '1',
        name: 'Property 1',
        imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg',
        userId: '1'
      },
      {
        id: '2',
        name: 'Property 2',
        imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg',
        userId: '1'
      }
    ]);
  },
  async getAreasByProperty(propertyId: string): Promise<IArea[]> {
    if (propertyId === '2') {
      return Promise.resolve([
        {
          id: '4',
          name: 'Area 4',
          propertyId: '2'
        },
        {
          id: '5',
          name: 'Area 5',
          propertyId: '2'
        },
        {
          id: '6',
          name: 'Area 6',
          propertyId: '2'
        }
      ]);
    } else if (propertyId === '1') {
      return Promise.resolve([
        {
          id: '1',
          name: 'Area 1',
          propertyId: '1'
        },
        {
          id: '2',
          name: 'Area 2',
          propertyId: '1'
        },
        {
          id: '3',
          name: 'Area 3',
          propertyId: '1'
        }
      ]);
    } else {
      return Promise.resolve([]);  
    }
  },

  //services using Fake API (Elvia A.)
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
