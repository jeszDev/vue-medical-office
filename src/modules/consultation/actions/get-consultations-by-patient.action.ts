import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Consultation } from '../interfaces/consultation.interface';

export const getConsultationsByPatientAction = async (
  patientId: number | string,
): Promise<Consultation[]> => {
  try {
    const { data } = await medicalOfficeApi.get<Consultation[] | { data: Consultation[] }>(
      `/patients/${patientId}/consultations`,
    );

    if (Array.isArray(data)) {
      return data;
    }

    if (data && Array.isArray((data as { data: Consultation[] }).data)) {
      return (data as { data: Consultation[] }).data;
    }

    return [];
  } catch (error) {
    console.error(`Error al obtener las consultas del paciente ${patientId}:`, error);
    return [];
  }
};
