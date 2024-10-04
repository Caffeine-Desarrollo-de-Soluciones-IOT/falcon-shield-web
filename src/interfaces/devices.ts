export interface IDevice {
  id: string;
  name: string;
  description: string;
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
  CONTROLLER = 'CONTROLLER',
  DISPLAY = 'DISPLAY',
  CAMERA = 'CAMERA'
}
