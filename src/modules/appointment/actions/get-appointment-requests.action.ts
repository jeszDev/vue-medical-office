import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment, AppointmentListResponse } from '../interfaces/appointment.interface';

export const getAppointmentRequestsAction = async (): Promise<Appointment[]> => {
  try {
    let rawData: unknown;
    try {
      const response = await medicalOfficeApi.get<AppointmentListResponse | Appointment[]>(
        '/appointments?pendientes_asignacion=true',
      );
      rawData = response.data;
    } catch {
      // Si el parámetro pendientes_asignacion falla, llamar al endpoint base
      const response = await medicalOfficeApi.get<AppointmentListResponse | Appointment[]>(
        '/appointments',
      );
      rawData = response.data;
    }

    let list: Appointment[] = [];
    if (Array.isArray(rawData)) {
      list = rawData;
    } else if (
      rawData &&
      typeof rawData === 'object' &&
      'data' in rawData &&
      Array.isArray((rawData as AppointmentListResponse).data)
    ) {
      list = (rawData as AppointmentListResponse).data;
    }

    // Retornar solo las solicitudes pendientes de asignación (sin fecha_hora_inicio)
    // y que no estén canceladas
    return list.filter((item) => {
      const hasNoStart = !item.fecha_hora_inicio;
      const statusName =
        typeof item.estatus === 'object' && item.estatus !== null
          ? item.estatus.nombre
          : String(item.estatus || '');
      const isNotCancelled = statusName.toLowerCase() !== 'cancelada';
      return hasNoStart && isNotCancelled;
    });
  } catch (error) {
    console.error('Error al obtener las solicitudes de citas pendientes:', error);
    return [];
  }
};

