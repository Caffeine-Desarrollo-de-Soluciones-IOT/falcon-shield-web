export interface IProperty {
  id: string;
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
