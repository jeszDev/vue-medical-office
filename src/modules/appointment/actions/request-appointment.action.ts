import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment } from '../interfaces/appointment.interface';
import type { TurnoPreferido } from '../helpers/appointment-shift.mapper';
import { getApiErrorMessage } from '@/helpers/api-error.helper';

export interface RequestAppointmentPayload {
  patient_id: number | string;
  fecha_preferida: string;
  turno_preferido: TurnoPreferido;
  motivo: string;
  observaciones?: string | null;
}

export const requestAppointmentAction = async (
  payload: RequestAppointmentPayload,
): Promise<Appointment> => {
  try {
    const { data } = await medicalOfficeApi.post<Appointment>(
      '/appointments/request',
      {
        paciente_id: Number(payload.patient_id),
        fecha_preferida: payload.fecha_preferida,
        turno_preferido: payload.turno_preferido,
        motivo: payload.motivo,
        observaciones: payload.observaciones,
      },
    );

    return data;
  } catch (error) {
    console.error('Error al enviar la solicitud de cita médica:', error);
    throw new Error(getApiErrorMessage(error, 'Error al enviar la solicitud de cita'));
  }
};

