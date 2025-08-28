import { medicalOfficeApi } from '@/api/medicalOfficeApi'
import type { PatientPaginate } from '../interfaces/patient-paginate.interface'

export const getChainsCustodyAction = async (
  page: number = 1,
  perPage: number = 10,
  search: string = '',
) => {
  try {
    const { data } = await medicalOfficeApi.get<PatientPaginate>(
      `/patients?page=${page}&per_page=${perPage}&search=${search}`,
    )

    // console.log(data);

    return data
  } catch (error) {
    console.log(error)
    throw new Error('Error getting chains of custody')
  }
}
