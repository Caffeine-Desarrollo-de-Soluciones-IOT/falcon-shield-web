import { httpClient } from '@/config/httpClient';

const serviceName = '/icons';

export const IconService = {
  async getIcons() {
    const response = await httpClient.get(`${serviceName}`);
    return response.data;
  },

  async getIconById(iconId: string) {
    const response = await httpClient.get(`${serviceName}/?id=${iconId}`);
    return response.data;
  }
};
