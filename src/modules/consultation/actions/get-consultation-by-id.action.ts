import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Consultation } from '../interfaces/consultation.interface';

export const getConsultationByIdAction = async (id: number | string): Promise<Consultation | null> => {
  try {
    const { data } = await medicalOfficeApi.get<Consultation>(`/consultations/${id}`);
    return data;
  } catch (error) {
    console.error('Error al obtener la consulta:', error);
    return null;
  }
};
