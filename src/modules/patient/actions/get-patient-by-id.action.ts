import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Patient, PatientSingleResponse } from '../interfaces/patient.interface';

export const getPatientByIdAction = async (patientId: string): Promise<Patient> => {
  if (patientId === 'create') {
    return {
      id: 0,
      curp: '',
      nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      fecha_nacimiento: '',
      edad: null,
      telefono: '',
      correo_electronico: '',
      observaciones: '',
      creado_el: '',
      nombre_completo: '',
    };
  }

  try {
    const { data } = await medicalOfficeApi.get<PatientSingleResponse>(`/patients/${patientId}`);
    return data.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el paciente con ID ${patientId}`);
  }
};
