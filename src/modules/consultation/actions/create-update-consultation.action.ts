import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Consultation } from '../interfaces/consultation.interface';

export const createUpdateConsultationAction = async (
  consultation: Partial<Consultation>,
): Promise<Consultation> => {
  try {
    // 1. Si ya tiene ID -> Actualización (PUT /consultations/{id})
    if (consultation.id) {
      const { data } = await medicalOfficeApi.put<Consultation>(
        `/consultations/${consultation.id}`,
        consultation,
      );
      return data;
    }

    // 2. Si surge de una cita -> Creación derivada de cita (POST /appointments/{cita_id}/consultations)
    if (consultation.cita_id) {
      const { data } = await medicalOfficeApi.post<Consultation>(
        `/appointments/${consultation.cita_id}/consultations`,
        consultation,
      );
      return data;
    }

    // 3. Si no hay cita pero hay paciente -> Creación directa (POST /patients/{paciente_id}/consultations)
    if (consultation.paciente_id) {
      const { data } = await medicalOfficeApi.post<Consultation>(
        `/patients/${consultation.paciente_id}/consultations`,
        consultation,
      );
      return data;
    }

    throw new Error('No se proporcionaron identificadores válidos para guardar la consulta');
  } catch (error) {
    console.error('Error al guardar o actualizar la consulta:', error);
    throw error;
  }
};
