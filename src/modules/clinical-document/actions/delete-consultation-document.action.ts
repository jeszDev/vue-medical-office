import { medicalOfficeApi } from '@/api/medicalOfficeApi';

export const deleteConsultationDocumentAction = async (
  consultationId: number | string,
  documentId: number | string,
): Promise<boolean> => {
  try {
    await medicalOfficeApi.delete(`/consultations/${consultationId}/documents/${documentId}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar el documento clínico:', error);
    throw error;
  }
};
