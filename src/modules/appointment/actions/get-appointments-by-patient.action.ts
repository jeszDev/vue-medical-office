import { medicalOfficeApi } from '@/api/medicalOfficeApi';

export const getAppointmentsByPatientAction = async (patientId: string) => {
  try {
    const { data } = await medicalOfficeApi.get(`/patients/${patientId}/appointments`);

    console.log(data.data);

    return data.data;
  } catch (error) {}
};
