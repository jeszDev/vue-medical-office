import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment } from '../interfaces/appointment.interface';

export const cancelAppointmentAction = async (appointmentId: string) => {
  try {
    console.log(appointmentId);

    const { data } = await medicalOfficeApi.patch<Appointment>(
      `/appointments/${appointmentId}/cancel`,
    );

    // console.log(`se quiere cancelar cita ${appointmentId}`);
    console.log(data.data);

    return data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};
