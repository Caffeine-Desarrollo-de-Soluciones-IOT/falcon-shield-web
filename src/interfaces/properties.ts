export interface IProperty {
  id: number;
  name: string;
  address: string;
  imageUrl?: string;
  registeredAt: string;
}

export interface IRegisterPropertyRequestDto {
  name: string;
  imageUrl: string;
  address: string;
}
