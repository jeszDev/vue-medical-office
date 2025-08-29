import { medicalOfficeApi } from '@/api/medicalOfficeApi'
import type { Patient } from '../interfaces/patient'

export const createUpdatePatientAction = async (patient: Partial<Patient>) => {
  try {
    if (patient.id && patient.id !== '') {
      return await updatePatient(patient)
    }
  } catch (error) {}
}

const updatePatient = async (patient: Partial<Patient>) => {
  const patientId = patient.id
  delete patient.id
  // TODO: delete user_id
  // delete chainCustody.user_id;
  delete patient.created_at
  delete patient.updated_at

  try {
    const { data } = await medicalOfficeApi.patch<Patient>(
      `/chains/${patientId}`,
      patient,
    )

    return data
  } catch (error) {
    console.log(error)
    throw new Error('Error updating chain custody')
  }
}
