export enum EEventType {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  LOW_BATTERY = 'LOW_BATTERY',
  ALERT = 'ALERT',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

export interface IDeviceEvent {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: keyof typeof EEventType;
}

export interface IRegisterEventRequestDto {
  title: string;
  description: string;
  type: keyof typeof EEventType;
  propertyId: number;
}
