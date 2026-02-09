import type { Patient } from '@/modules/patient/interfaces/patient.interface';

export interface Appointment {
  id: number;
  fecha_hora_inicio: string;
  fecha_hora_termino: string;
  motivo: string;
  observaciones_cita: string;
  // medico_id: number;
  // cita_estatus_id: number;
  pacientes: Patient[];

  patient_id: string;
}
