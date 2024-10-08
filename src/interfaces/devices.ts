export interface IDevice {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  brand: string;
  model: string;
  specs: IDeviceSpecs;
  type: keyof typeof EDeviceType;
}

export interface IDeviceSpecs {
  power: string;
  connectivity: string;
  compatibility: string;
  warranty: string;
}

export enum EDeviceType {
  SENSOR = 'SENSOR',
  ACTUATOR = 'ACTUATOR',
}

export interface IDeviceCatalog {
  categoryName: string;
  categoryIcon: string;
  devices: IDevice[];
}

export interface IRegisterDeviceRequestDto {
  deviceId: string;
  code: string;
  areaId: string;
}

export interface IProperty {
  id: string;
  name: string;
  imageUrl: string;
  userId: string;
}

export interface IArea {
  id: string;
  name: string;
  propertyId: string;
}