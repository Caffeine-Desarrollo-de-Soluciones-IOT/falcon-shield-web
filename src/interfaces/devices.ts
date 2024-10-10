export interface IDevice {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  brand: string;
  model: string;
  type: keyof typeof EDeviceType;
  specs: IDeviceSpecs;
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
  id: string;
  name: string;
  icon: string;
  devices: IDevice[];
}

export interface IRegisteredDevice {
  id: string;
  registeredAt: string;
  device: IDevice;
  //areaId: string;
}

export interface IRegisterDeviceRequestDto {
  deviceId: string;
  registrationCode: string;
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