import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { ClinicalDocument } from '../interfaces/clinical-document.interface';

export const getPatientDocumentsAction = async (
  patientId: number | string,
): Promise<ClinicalDocument[]> => {
  try {
    const { data } = await medicalOfficeApi.get<ClinicalDocument[] | { data: ClinicalDocument[] }>(
      `/patients/${patientId}/documents`,
    );

    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error('Error al obtener los documentos del expediente del paciente:', error);
    return [];
  }
};
