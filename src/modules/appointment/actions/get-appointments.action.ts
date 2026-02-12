import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment } from '../interfaces/appointment.interface';

export const getAppointmentsAction = async (fromDate: null | string, toDate: null | string) => {
  try {
    // const today = new Date();
    // const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    // const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const { data } = await medicalOfficeApi.get<Appointment[]>(
      `/appointments?from_date=${fromDate}&to_date=${toDate}`,
    );

    // console.log(data.data);

    return data.data;
  } catch (error) {}
};
