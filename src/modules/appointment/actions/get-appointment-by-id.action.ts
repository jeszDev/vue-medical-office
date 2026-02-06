import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment } from '../interfaces/appointment.interface';
import type { Patient } from '@/modules/patient/interfaces/patient.interface';

export const getAppointmentByIdAction = async (appointmentId: string): Promise<Appointment> => {
  if (appointmentId === 'create') {
    return {
      id: 0,
      fecha_hora_inicio: '',
      fecha_hora_termino: '',
      motivo: '',
      observaciones_cita: '',
      medico_id: 0,
      cita_estatus_id: 0,
      // pacientes: Patient[],
    };
  }

  try {
    const { data } = await medicalOfficeApi.get<Appointment>(`/appointments/${appointmentId}`);
    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Error getting chain by id ${appointmentId}`);
  }
};
