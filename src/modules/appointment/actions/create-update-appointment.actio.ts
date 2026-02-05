import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment } from '../interfaces/appointment.interface';

export const createUpdateappointmentAction = async (appointment: Partial<Appointment>) => {
  // const toast = useToast();

  try {
    if (appointment.id && appointment.id !== '') {
      return await updateappointment(appointment);
    }

    const { data } = await medicalOfficeApi.post<Appointment>(`/appointments`, appointment);

    return data;
  } catch (error) {}
};

const updateappointment = async (appointment: Partial<Appointment>) => {
  const appointmentId = appointment.id;

  delete appointment.id;
  // delete appointment.nombre_completo;
  // delete appointment.creado_el;

  try {
    const { data } = await medicalOfficeApi.patch<Appointment>(
      `/appointments/${appointmentId}`,
      appointment,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error updating appointment');
  }
};
