import { httpClient } from '@/config/httpClient';

import type { IDevice } from '@/interfaces/devices';
import type { IArea, IDevice, IDeviceCatalog, IProperty } from '@/interfaces/devices';

export const getAvailableDevices = async (): Promise<IDeviceCatalog[]> => {
  // const res = await httpClient.get<IDevice[]>("/devices");
  // return res.data;

  return Promise.resolve([
    {
      categoryName: 'Cameras',
      categoryIcon: 'pi pi-fw pi-video',
      devices: [
        {
          id: '1',
          name: 'Camera 1',
          description: 'Description 1',
          imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg`',
          brand: 'Brand 1',
          model: 'Model 1',
          specs: {
            power: 'Power 1',
            connectivity: 'Connectivity 1',
            compatibility: 'Compatibility 1',
            warranty: 'Warranty 1'
          },
          type: 'SENSOR'
        },
        {
          id: '2',
          name: 'Camera 2',
          description: 'Description 2',
          imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg`',
          brand: 'Brand 2',
          model: 'Model 2',
          specs: {
            power: 'Power 2',
            connectivity: 'Connectivity 2',
            compatibility: 'Compatibility 2',
            warranty: 'Warranty 2'
          },
          type: 'SENSOR'
        },
        {
          id: '3',
          name: 'Camera 3',
          description: 'Description 3',
          imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg`',
          brand: 'Brand 3',
          model: 'Model 3',
          specs: {
            power: 'Power 3',
            connectivity: 'Connectivity 3',
            compatibility: 'Compatibility 3',
            warranty: 'Warranty 3'
          },
          type: 'SENSOR'
        }
      ]
    },
    {
      categoryName: 'External Security',
      categoryIcon: 'pi pi-fw pi-shield',
      devices: [
        {
          id: '7',
          name: 'Device 7',
          description: 'Description 7',
          imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg`',
          brand: 'Brand 7',
          model: 'Model 7',
          specs: {
            power: 'Power 7',
            connectivity: 'Connectivity 7',
            compatibility: 'Compatibility 7',
            warranty: 'Warranty 7'
          },
          type: 'ACTUATOR'
        },
        {
          id: '8',
          name: 'Device 8',
          description: 'Description 8',
          imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg`',
          brand: 'Brand 8',
          model: 'Model 8',
          specs: {
            power: 'Power 8',
            connectivity: 'Connectivity 8',
            compatibility: 'Compatibility 8',
            warranty: 'Warranty 8'
          },
          type: 'ACTUATOR'
        },
        {
          id: '9',
          name: 'Device 9',
          description: 'Description 9',
          imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg`',
          brand: 'Brand 9',
          model: 'Model 9',
          specs: {
            power: 'Power 9',
            connectivity: 'Connectivity 9',
            compatibility: 'Compatibility 9',
            warranty: 'Warranty 9'
          },
          type: 'ACTUATOR'
        }
      ]
    }
  ]);
};

export const getRegisteredDevices = async (): Promise<IDevice[]> => {
  // const res = await httpClient.get<IDevice[]>("/devices/registered");
  // return res.data;

  return Promise.resolve([
    {
      id: '4',
      name: 'Device 4',
      description: 'Description 4',
      imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg`',
      brand: 'Brand 4',
      model: 'Model 4',
      specs: {
        power: 'Power 4',
        connectivity: 'Connectivity 4',
        compatibility: 'Compatibility 4',
        warranty: 'Warranty 4'
      },
      type: 'SENSOR'
    },
    {
      id: '5',
      name: 'Device 5',
      description: 'Description 5',
      imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg`',
      brand: 'Brand 5',
      model: 'Model 5',
      specs: {
        power: 'Power 5',
        connectivity: 'Connectivity 5',
        compatibility: 'Compatibility 5',
        warranty: 'Warranty 5'
      },
      type: 'ACTUATOR'
    },
    {
      id: '6',
      name: 'Device 6',
      description: 'Description 6',
      imageUrl: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg`',
      brand: 'Brand 6',
      model: 'Model 6',
      specs: {
        power: 'Power 6',
        connectivity: 'Connectivity 6',
        compatibility: 'Compatibility 6',
        warranty: 'Warranty 6'
      },
      type: 'SENSOR'
    }
  ]);
};

export const getUserProperties = async (): Promise<IProperty[]> => {
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
};

export const getAreasByProperty = async (propertyId: string): Promise<IArea[]> => {
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
};


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
