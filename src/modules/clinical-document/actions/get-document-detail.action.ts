import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { ClinicalDocument } from '../interfaces/clinical-document.interface';

export const getDocumentDetailAction = async (
  consultationId: number | string,
  documentId: number | string,
): Promise<ClinicalDocument | null> => {
  try {
    const { data } = await medicalOfficeApi.get<ClinicalDocument | { data: ClinicalDocument }>(
      `/consultations/${consultationId}/documents/${documentId}`,
    );

    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: ClinicalDocument }).data;
    }

    return (data as ClinicalDocument) || null;
  } catch (error) {
    console.error('Error al obtener el detalle del documento:', error);
    return null;
  }
};
