import { httpClient } from '@/config/httpClient';
import {
  type IProperty,
  type IRegisterPropertyRequestDto
} from '@/interfaces/properties';
import type { IApiResponse } from '@/interfaces/common';

const serviceName = '/properties';

export const PropertyService = {
  async getProperties(): Promise<IApiResponse<IProperty[]>> {
    const response = await httpClient.get<IApiResponse<IProperty[]>>(
      `${serviceName}/registered`
    );
    return response.data;
  },

  async getPropertiesMini(): Promise<IApiResponse<IProperty[]>> {
    const response = await httpClient.get<IApiResponse<IProperty[]>>(
      `${serviceName}/registered`
    );
    const dataArray = Object.values(response.data.data);
    return {
      ...response.data,
      data: dataArray.slice(0, 5)
    };
  },

  async getPropertiesSmall(): Promise<IApiResponse<IProperty[]>> {
    const response = await httpClient.get<IApiResponse<IProperty[]>>(
      `${serviceName}/registered`
    );
    const dataArray = Object.values(response.data.data);
    return {
      ...response.data,
      data: dataArray.slice(0, 10)
    };
  },

  async createProperty(property: IRegisterPropertyRequestDto): Promise<IApiResponse> {
    if (!property.imageUrl) {
      property.imageUrl =
        'icons%2Fimage-default.jpg?alt=media&token=ad9f427e-0e10-4921-84b1-def775f541e7';
    }
    const response = await httpClient.post<IApiResponse>(`${serviceName}/register`, property);
    return response.data;
  },

  async deleteProperty(propertyId: string): Promise<IApiResponse> {
    /* Obtener todas las áreas asociadas a la propiedad
    const areas = await AreaService.getAreasByPropertyId(propertyId);

    // Eliminar cada área
    if (areas.length > 0) {
      await Promise.all(
        areas.map(async (area) => {
          await AreaService.deleteArea(area.id);
        })
      );
    }

    // Eliminar imagen de propiedad de firebase
    const properties = await this.getPropertyById(propertyId);
    const property = properties[0];
    ImageService.deleteImage(property);*/

    const response = await httpClient.delete<IApiResponse>(
      `${serviceName}/unregister/${propertyId}`
    );
    return response.data;
  },

  // TODO: use API
  async getPropertyById(propertyId: string): Promise<IProperty[]> {
    const response = await httpClient.get<IProperty[]>(`${serviceName}/?id=${propertyId}`);
    return response.data;
  },

  async updateProperty(propertyId: string, propertyData: IProperty): Promise<void> {
    // TODO: If the image is edited, the previous image must be deleted

    const response = await httpClient.put<void>(`${serviceName}/${propertyId}`, propertyData);
    return response.data;
  }
};
