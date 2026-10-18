import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment } from '../interfaces/appointment.interface';

export const getAppointmentsAction = async (fromDate: null | string, toDate: null | string) => {
  try {
    console.log({ fromDate, toDate });

    const { data } = await medicalOfficeApi.get<Appointment[]>(
      `/appointments?from_date=${fromDate}&to_date=${toDate}`,
    );

  } catch {
    return [];
  }

};
