export interface IDevice {
  id: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  specs: IDeviceSpecs;
}

export interface IDeviceSpecs {
  power: string;
  connectivity: string;
  compatibility: string;
  warranty: string;
}
