import type { IProperty } from "./properties";

export interface IArea {
  id: number;
  name: string;
  icon: string;
  color: string;
  property: IProperty;
  registeredAt: string;
}

export interface IRegisterAreaRequestDto {
  name: string;
  icon: string;
  color: string;
}
