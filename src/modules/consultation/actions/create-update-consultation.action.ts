import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Consultation } from '../interfaces/consultation.interface';

export const createUpdateConsultationAction = (consultation: Partial<Consultation>) => {
  try {
    const {} = medicalOfficeApi.post<Consultation>(
      `/appointments/${consultation.cita_id}/consultations`,
      consultation,
    );
  } catch (error) {}
};
