import { httpClient } from '@/config/httpClient';
import type { IApiResponse } from '@/interfaces/common';
import type { IUserProfile, IUserProfileRequestDto } from '@/interfaces/userProfile';

const serviceName = '/profile';

export const UserProfileService = {
  async getUserProfile(): Promise<IApiResponse<IUserProfile>> {
    const response = await httpClient.get<IApiResponse<IUserProfile>>(`${serviceName}`);
    return response.data;
  },
  async createUserProfile(request: IUserProfileRequestDto): Promise<IApiResponse> {
    const response = await httpClient.post<IApiResponse>(`${serviceName}/create`, request);
    return response.data;
  },
  async isUserProfileCreated(): Promise<boolean> {
    try {
      await this.getUserProfile();
      return true;
    } catch (error) {
      return false;
    }
  }
};
