import { medicalOfficeApi } from '@/api/medicalOfficeApi';

export const getAppointmentsByPatientAction = async (patientId: string) => {
  try {
    const { data } = await medicalOfficeApi.get(`/patients/${patientId}/appointments`);
    return data.data;
  } catch (error) {
    console.error(`Error al obtener las citas del paciente ${patientId}:`, error);
    return [];
  }
};
