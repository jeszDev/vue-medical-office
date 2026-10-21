import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment, AppointmentListResponse } from '../interfaces/appointment.interface';

export const getAppointmentsAction = async (
  fromDate: null | string,
  toDate: null | string,
): Promise<Appointment[]> => {
  try {
    const fromParam = fromDate && !fromDate.includes(' ') ? `${fromDate} 00:00:00` : fromDate;
    const toParam = toDate && !toDate.includes(' ') ? `${toDate} 23:59:59` : toDate;

    const { data } = await medicalOfficeApi.get<AppointmentListResponse | Appointment[]>(
      `/appointments?from_date=${fromParam}&to_date=${toParam}`,
    );

    if (Array.isArray(data)) {
      return data;
    }

    if (data && Array.isArray((data as AppointmentListResponse).data)) {
      return (data as AppointmentListResponse).data;
    }

    return [];
  } catch (error) {
    console.error('Error al obtener las citas para el calendario:', error);
    return [];
  }
};
