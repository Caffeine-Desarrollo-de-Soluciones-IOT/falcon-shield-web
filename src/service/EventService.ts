import { httpClient } from '@/config/httpClient';
import type { IApiResponse } from '@/interfaces/common';
import type { IDeviceEvent } from '@/interfaces/events';

const serviceName = '/events';

export const EventService = {
  // Servicio para obtener eventos de dispositivos para un usuario específico
  async getDeviceEvents(userId: number): Promise<IApiResponse<IDeviceEvent[]>> {
    // Simulando datos de eventos
    const mockData: IDeviceEvent[] = [
        {
          id: 1,
          title: "Temperatura alta en sala de estar",
          description: "La temperatura ha superado los 30°C en la sala de estar.",
          timestamp: new Date(Date.now() - 86400000).toISOString(), // Hace 1 día
          eventType: "Alerta de temperatura",
          deviceId: 101,
        },
        {
          id: 2,
          title: "Movimiento detectado en el jardín",
          description: "Se ha detectado movimiento en el jardín a las 2:30 AM.",
          timestamp: new Date(Date.now() - 7200000).toISOString(), // Hace 2 horas
          eventType: "Alerta de seguridad",
          deviceId: 102,
        },
        {
          id: 3,
          title: "Fuga de agua en la cocina",
          description: "Se ha detectado una fuga de agua en la cocina.",
          timestamp: new Date(Date.now() - 3600000).toISOString(), // Hace 1 hora
          eventType: "Alerta de fuga",
          deviceId: 103,
        },
        {
          id: 4,
          title: "Puerta principal abierta",
          description: "La puerta principal ha estado abierta durante más de 5 minutos.",
          timestamp: new Date(Date.now() - 300000).toISOString(), // Hace 5 minutos
          eventType: "Alerta de seguridad",
          deviceId: 104,
        },
        {
          id: 5,
          title: "Sensor de humo activado",
          description: "El sensor de humo se ha activado en la planta superior.",
          timestamp: new Date().toISOString(), // Ahora
          eventType: "Alerta de incendios",
          deviceId: 105,
        },
      ];
      
    // Devolviendo un objeto que cumple con la interfaz IApiResponse
    return {
      success: true,
      message: "Eventos obtenidos correctamente",
      data: mockData,
    };
  },

  // Puedes agregar más métodos aquí según sea necesario
};
