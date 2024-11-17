import { httpClient } from '@/config/httpClient';
import type { IApiResponse } from '@/interfaces/common';
import type { IDeviceEvent, IRegisterEventRequestDto } from '@/interfaces/events';

const serviceName = '/events';

export const EventService = {
  async getEvents(userId: number): Promise<IApiResponse<IDeviceEvent[]>> {
    const response = await httpClient.get<IApiResponse<IDeviceEvent[]>>(
      `${serviceName}/user/${userId}`
    );
    return response.data;
  },

  async getEventsByPropertyId(propertyId: number): Promise<IApiResponse<IDeviceEvent[]>> {
    const response = await httpClient.get<IApiResponse<IDeviceEvent[]>>(
      `${serviceName}/all/${propertyId}`
    );
    return response.data;
  },

  async createEvent(request: IRegisterEventRequestDto): Promise<IApiResponse> {
    const response = await httpClient.post<IApiResponse>(`${serviceName}/create`, request);
    return response.data;
  }
};
