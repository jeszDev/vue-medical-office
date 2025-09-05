import { medicalOfficeApi } from '@/api/medicalOfficeApi'
import type { Patient } from '../interfaces/patient.interface'

export const getPatientByIdAction = async (patientId: string): Promise<Patient> => {
  if (patientId === 'create') {
    return {
      id: '',
      nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      fecha_nacimiento: '',
      telefono: '',
      correo_electronico: '',
      observaciones: '',
      created_at: '',
      updated_at: '',
    }
  }

  try {
    console.log('Se va a realizar la peticion patient by id: ' + patientId)

    const { data } = await medicalOfficeApi.get<Patient>(`/patients/${patientId}`)

    console.log(data)

    return data
  } catch (error) {
    console.log(error)
    throw new Error(`Error getting chain by id ${patientId}`)
  }
}
