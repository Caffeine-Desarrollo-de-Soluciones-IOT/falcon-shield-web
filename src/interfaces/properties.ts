export interface IProperty {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
  user_id: string;
}

export interface IRegisteredProperty {
  id: number;
  registeredAt: string;
  property: IProperty;
  //areaId: string;
}

export interface IRegisterPropertyRequestDto {
  name: string;
  imageUrl: string;
  address: string;
}
