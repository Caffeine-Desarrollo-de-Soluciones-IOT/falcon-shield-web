import type { IArea } from "./areas";

export interface IDevice {
  id: number;
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
  id: number;
  name: string;
  icon: string;
  devices: IDevice[];
}

export interface IRegisteredDevice {
  id: number;
  registeredAt: string;
  device: IDevice;
  area: IArea;
}

export interface IRegisterDeviceRequestDto {
  deviceId: number;
  registrationCode: string;
  areaId: number;
}
