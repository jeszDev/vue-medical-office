import { medicalOfficeApi } from '@/api/medicalOfficeApi'

export const getAppointmentsByPatient = async (patientId: string) => {
  try {
    const { data } = await medicalOfficeApi.get(`/patients/${patientId}/appointments`)

    console.log(data.data)

    return data.data
  } catch (error) {}
}
