import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment, AppointmentListResponse } from '../interfaces/appointment.interface';

export const getAllAppointmentsByPatientAction = async (
  patientId: string | number,
): Promise<Appointment[]> => {
  try {
    const { data } = await medicalOfficeApi.get<AppointmentListResponse>(
      `/patients/${patientId}/appointments?all=true`,
    );
    return data.data;
  } catch (error) {
    console.error(`Error al obtener todas las citas del paciente ${patientId}:`, error);
    return [];
  }
};
