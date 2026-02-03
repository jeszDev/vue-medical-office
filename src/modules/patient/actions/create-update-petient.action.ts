import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Patient } from '../interfaces/patient.interface';
import { useToast } from 'vue-toastification';

export const createUpdatePatientAction = async (patient: Partial<Patient>) => {
  // const toast = useToast();

  try {
    if (patient.id && patient.id !== '') {
      return await updatePatient(patient);
    }

    const { data } = await medicalOfficeApi.post<Patient>(`/patients`, patient);

    return data;
  } catch (error) {}
};

const updatePatient = async (patient: Partial<Patient>) => {
  const patientId = patient.id;

  delete patient.id;
  delete patient.nombre_completo;
  delete patient.creado_el;

  try {
    const { data } = await medicalOfficeApi.patch<Patient>(`/patients/${patientId}`, patient);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error updating patient');
  }
};
