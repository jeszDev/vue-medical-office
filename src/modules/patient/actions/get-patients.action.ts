import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { PatientPaginate } from '../interfaces/patient-paginate.interface';

export const getPatientsAction = async (
  page: number = 1,
  perPage: number = 10,
  search: string = '',
) => {
  try {
    const { data } = await medicalOfficeApi.get<PatientPaginate>(
      `/patients?page=${page}&per_page=${perPage}&search=${search}`,
    );

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener la lista de pacientes');
  }
};
