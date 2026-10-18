import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Consultation } from '../interfaces/consultation.interface';

export const createUpdateConsultationAction = async (
  consultation: Partial<Consultation>,
): Promise<Consultation> => {
  try {
    const { data } = await medicalOfficeApi.post<Consultation>(
      `/appointments/${consultation.cita_id}/consultations`,
      consultation,
    );
    return data;
  } catch (error) {
    console.error('Error al guardar la consulta:', error);
    throw error;
  }
};

