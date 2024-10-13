import { httpClient } from '@/config/httpClient';
import { type IProperty } from '@/interfaces/properties';
import { ImageService } from '@/service/ImageService';
import { AreaService } from './AreaService';

const serviceName = '/properties';

export const PropertyService = {
  async getProperties(): Promise<IProperty[]> {
    const response = await httpClient.get<IProperty[]>(`${serviceName}`);
    return response.data;
  },

  async getPropertiesMini(): Promise<IProperty[]> {
    const response = await httpClient.get<IProperty[]>(`${serviceName}`);
    return response.data.slice(0, 5);
  },

  async getPropertiesSmall(): Promise<IProperty[]> {
    const response = await httpClient.get<IProperty[]>(`${serviceName}`);
    return response.data.slice(0, 10);
  },

  async getPropertyById(propertyId: string): Promise<IProperty> {
    const response = await httpClient.get<IProperty>(`${serviceName}/?id=${propertyId}`);
    return response.data;
  },

  async createProperty(property: IProperty): Promise<IProperty> {
    if (!property.image_url) {
      property.image_url =
        'icons%2Fimage-default.jpg?alt=media&token=ad9f427e-0e10-4921-84b1-def775f541e7'; // Ruta a la imagen por defecto
    }
    const response = await httpClient.post<IProperty>(`${serviceName}`, property);
    return response.data;
  },

  async updateProperty(propertyId: string, propertyData: IProperty): Promise<void> {
    // TODO: If the image is edited, the previous image must be deleted

    const response = await httpClient.put<void>(`${serviceName}/${propertyId}`, propertyData);
    return response.data;
  },

  async deleteProperty(propertyId: string): Promise<void> {
    // Obtener todas las áreas asociadas a la propiedad
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
    ImageService.deleteImage(property);

    const response = await httpClient.delete<void>(`${serviceName}/${propertyId}`);
    return response.data;
  }
};
