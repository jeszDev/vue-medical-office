import type { Patient } from '@/modules/patient/interfaces/patient.interface';

export interface Appointment {
  id: number;
  fecha_hora_inicio: string;
  fecha_hora_termino: string;
  motivo: string;
  observaciones_cita: string;
  medico: string;
  estatus: 'Pendiente' | 'Cancelada' | 'Atendida' | 'No asistió';
  pacientes: Patient[];

  fecha_inicio: string;
  fecha_termino: string;
  hora_inicio: string;
  hora_termino: string;

  patient_id?: string;
}
