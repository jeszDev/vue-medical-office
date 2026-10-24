import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Patient } from '../interfaces/patient.interface';
import { getApiErrorMessage } from '@/helpers/api-error.helper';

export const createUpdatePatientAction = async (patient: Partial<Patient>) => {
  try {
    if (patient.id && (patient.id as unknown) !== '') {
      return await updatePatient(patient);
    }

    const { data } = await medicalOfficeApi.post<Patient>(`/patients`, patient);

    return data;
  } catch (error) {
    console.error('Error al crear o actualizar paciente:', error);
    throw new Error(getApiErrorMessage(error, 'Error al registrar al paciente'));
  }
};

const updatePatient = async (patient: Partial<Patient>) => {
  const patientId = patient.id;

  delete patient.id;
  delete patient.nombre_completo;
  delete patient.creado_el;
  delete patient.edad;
  delete patient.avatar;

  try {
    const { data } = await medicalOfficeApi.patch<Patient>(`/patients/${patientId}`, patient);
    return data;
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    throw new Error(getApiErrorMessage(error, 'Error al actualizar los datos del paciente'));
  }
};
