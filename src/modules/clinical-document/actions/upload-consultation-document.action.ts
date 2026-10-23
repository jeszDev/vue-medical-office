import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type {
  ClinicalDocument,
  UploadDocumentPayload,
} from '../interfaces/clinical-document.interface';

export const uploadConsultationDocumentAction = async (
  consultationId: number | string,
  payload: UploadDocumentPayload,
): Promise<ClinicalDocument> => {
  try {
    const formData = new FormData();
    formData.append('archivo', payload.archivo);
    formData.append('tipo_documento', payload.tipo_documento);
    formData.append('titulo', payload.titulo);

    if (payload.descripcion && payload.descripcion.trim()) {
      formData.append('descripcion', payload.descripcion.trim());
    }

    const { data } = await medicalOfficeApi.post<ClinicalDocument | { data: ClinicalDocument }>(
      `/consultations/${consultationId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    // Si la respuesta viene envuelta en { data: ... }
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: ClinicalDocument }).data;
    }

    return data as ClinicalDocument;
  } catch (error) {
    console.error('Error al subir el documento de la consulta:', error);
    throw error;
  }
};
