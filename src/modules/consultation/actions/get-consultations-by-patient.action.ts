import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { ConsultationPaginate } from '../interfaces/consultation-paginate.interface';

export const getConsultationsByPatientAction = async (
  patientId: number | string,
  page: number = 1,
  perPage: number = 10,
  search: string = '',
): Promise<ConsultationPaginate> => {
  try {
    const url = `/patients/${patientId}/consultations?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`;
    const { data } = await medicalOfficeApi.get<ConsultationPaginate>(url);
    return data;
  } catch (error) {
    console.error(`Error al obtener las consultas del paciente ${patientId}:`, error);
    throw new Error(`Error al obtener las consultas del paciente ${patientId}`);
  }
};
