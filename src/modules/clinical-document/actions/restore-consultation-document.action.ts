import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { ClinicalDocument } from '../interfaces/clinical-document.interface';

export const restoreConsultationDocumentAction = async (
  consultationId: number | string,
  documentId: number | string,
): Promise<ClinicalDocument | boolean> => {
  try {
    const { data } = await medicalOfficeApi.post<ClinicalDocument | { data: ClinicalDocument }>(
      `/consultations/${consultationId}/documents/${documentId}/restore`,
    );

    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: ClinicalDocument }).data;
    }

    return (data as ClinicalDocument) || true;
  } catch (error) {
    console.error('Error al restaurar el documento clínico:', error);
    throw error;
  }
};
