import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment } from '../interfaces/appointment.interface';

export const getAppointmentByIdAction = async (appointmentId: string): Promise<Appointment> => {
  if (appointmentId === 'create') {
    return {
      id: 0,
      fecha_hora_inicio: '',
      fecha_hora_termino: '',
      motivo: '',
      observaciones_cita: '',
      observaciones: '',
      estatus: 'Pendiente',
      fecha_inicio: '',
      fecha_termino: '',
      hora_inicio: '',
      hora_termino: '',
    };
  }

  try {
    const { data } = await medicalOfficeApi.get<Appointment>(`/appointments/${appointmentId}`);
    return data.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error getting chain by id ${appointmentId}`);
  }
};

