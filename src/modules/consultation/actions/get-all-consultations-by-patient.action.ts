import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Consultation, ConsultationListResponse } from '../interfaces/consultation.interface';

export const getAllConsultationsByPatientAction = async (
  patientId: number | string,
): Promise<Consultation[]> => {
  try {
    const { data } = await medicalOfficeApi.get<ConsultationListResponse>(
      `/patients/${patientId}/consultations?all=true`,
    );
    return data.data;
  } catch (error) {
    console.error(`Error al obtener todas las consultas del paciente ${patientId}:`, error);
    return [];
  }
};
