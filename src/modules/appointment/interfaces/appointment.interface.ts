import type { Patient } from '@/modules/patient/interfaces/patient.interface';

export interface AppointmentDoctor {
  id: number;
  nombre_completo: string;
}

export interface AppointmentStatusObject {
  id: number;
  nombre: string;
}

export interface VitalSigns {
  peso: string | number | null;
  altura: string | number | null;
  temperatura: string | number | null;
  presion_arterial: string | null;
  frecuencia_cardiaca: number | null;
  frecuencia_respiratoria: number | null;
}

export interface AppointmentConsultation {
  id: number;
  motivo: string | null;
  exploracion_fisica: string | null;
  diagnostico: string | null;
  tratamiento: string | null;
  observaciones: string | null;
  notas: string | null;
  signos_vitales: VitalSigns | null;
  doctor?: AppointmentDoctor | null;
  paciente_id: number;
  cita_id: number;
  creado_el: string;
}

export interface Appointment {
  id: number;
  folio?: string;
  fecha_hora_inicio: string | null;
  fecha_hora_termino: string | null;
  fecha_preferida?: string | null;
  turno_preferido?: 'matutino' | 'vespertino' | 'indistinto' | null;
  motivo: string;
  observaciones?: string | null;
  observaciones_cita?: string | null;
  medico_id?: number;
  medico?: string;
  doctor?: AppointmentDoctor;
  cita_estatus_id?: number;
  estatus: AppointmentStatusObject | string;
  consulta?: AppointmentConsultation | null;
  pacientes?: Patient[];

  fecha_inicio?: string;
  fecha_termino?: string;
  hora_inicio?: string;
  hora_termino?: string;

  patient_id?: string | number;
  paciente?: Patient;
  created_at?: string;
  creado_el?: string;
}

export interface AppointmentListResponse {
  data: Appointment[];
}
