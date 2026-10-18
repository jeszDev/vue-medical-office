import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Patient, PatientListResponse } from '../interfaces/patient.interface';

export const getAllPatientsAction = async (): Promise<Patient[]> => {
  try {
    const { data } = await medicalOfficeApi.get<PatientListResponse>('/patients?all=true');
    return data.data;
  } catch (error) {
    console.error('Error al obtener todos los pacientes:', error);
    return [];
  }
};
