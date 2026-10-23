import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { ClinicalDocument } from '../interfaces/clinical-document.interface';

export const getConsultationDocumentsAction = async (
  consultationId: number | string,
): Promise<ClinicalDocument[]> => {
  try {
    const { data } = await medicalOfficeApi.get<ClinicalDocument[] | { data: ClinicalDocument[] }>(
      `/consultations/${consultationId}/documents`,
    );

    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error('Error al obtener los documentos de la consulta:', error);
    return [];
  }
};
