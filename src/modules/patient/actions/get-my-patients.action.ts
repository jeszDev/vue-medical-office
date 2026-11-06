import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Patient } from '../interfaces/patient.interface';

export const getMyPatientsAction = async (): Promise<Patient[]> => {
  try {
    const { data } = await medicalOfficeApi.get<{ data?: Patient[] } | Patient[]>('/my-patients');
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.warn('Error al obtener pacientes vinculados del usuario (/my-patients):', error);
    return [];
  }
};

