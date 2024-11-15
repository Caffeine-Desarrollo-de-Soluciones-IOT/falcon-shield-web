import { httpClient } from '@/config/httpClient';
import type { IApiResponse } from '../interfaces/common';

const serviceName = '/payments';

export const PaymentService = {
  async newSubscription(priceId: string): Promise<IApiResponse<string>> {
    const response = await httpClient.post<IApiResponse<string>>(`${serviceName}/subscription/new/${priceId}`);
    return response.data;
  },
  async getSubscriptionDetails(): Promise<IApiResponse<string>> {
    const response = await httpClient.get<IApiResponse<string>>(`${serviceName}/subscription/detail`);
    return response.data;
  }
}
