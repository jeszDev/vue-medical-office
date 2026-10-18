import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { AppointmentPaginate } from '../interfaces/appointment-paginate.interface';

export const getAppointmentsByPatientAction = async (
  patientId: string | number,
  page: number = 1,
  perPage: number = 10,
  search: string = '',
): Promise<AppointmentPaginate> => {
  try {
    const url = `/patients/${patientId}/appointments?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`;
    const { data } = await medicalOfficeApi.get<AppointmentPaginate>(url);
    return data;
  } catch (error) {
    console.error(`Error al obtener las citas del paciente ${patientId}:`, error);
    throw new Error(`Error al obtener las citas del paciente ${patientId}`);
  }
};
