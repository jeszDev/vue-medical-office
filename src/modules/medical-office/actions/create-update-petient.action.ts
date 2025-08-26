import { medicalOfficeApi } from '@/api/medicalOfficeApi'
import type { Patient } from '../interfaces/patient'

export const createUpdatePatientAction = async (patient: Partial<Patient>) => {
  try {
    if (patient.id && patient.id !== '') {
      return await updatePatient(patient)
    }
  } catch (error) {}
}

const updateChainCusody = async (chainCustody: Partial<ChainCustody>) => {
  const chainCustodyId = chainCustody.id
  delete chainCustody.id
  // TODO: delete user_id
  // delete chainCustody.user_id;
  delete chainCustody.created_at
  delete chainCustody.updated_at

  try {
    const { data } = await medicalOfficeApi.patch<ChainCustody>(
      `/chains/${chainCustodyId}`,
      chainCustody,
    )

    return data
  } catch (error) {
    console.log(error)
    throw new Error('Error updating chain custody')
  }
}
