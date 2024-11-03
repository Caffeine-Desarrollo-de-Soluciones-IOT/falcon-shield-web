export interface IArea {
  id: number;
  name: string;
  icon: string;
  color: string;
  registeredAt: string;
}

export interface IRegisterAreaRequestDto {
  name: string;
  icon: string;
  color: string;
}
