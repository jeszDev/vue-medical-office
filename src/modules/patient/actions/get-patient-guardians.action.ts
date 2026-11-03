import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { PatientGuardiansResponse } from '../interfaces/patient-guardian.interface';

export const getPatientGuardiansAction = async (
  patientId: number | string,
): Promise<PatientGuardiansResponse> => {
  try {
    const { data } = await medicalOfficeApi.get<PatientGuardiansResponse>(
      `/patients/${patientId}/guardians`,
    );
    return data;
  } catch (error) {
    console.error(`Error al obtener los tutores del paciente ${patientId}:`, error);
    throw new Error('Error al cargar la información de tutores del paciente');
  }
};

