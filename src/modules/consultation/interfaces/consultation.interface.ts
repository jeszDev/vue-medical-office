import type {
  Appointment,
  AppointmentDoctor,
  VitalSigns,
} from '@/modules/appointment/interfaces/appointment.interface';

export interface ConsultationDoctor {
  id?: number;
  nombre?: string;
  primer_apellido?: string;
  nombre_completo?: string;
  especialidad?: string;
}

export interface Consultation {
  id: number;
  motivo: string;
  exploracion_fisica?: string | null;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string | null;
  notas?: string | null;

  signos_vitales?: VitalSigns | null;
  doctor?: AppointmentDoctor | null;
  cita?: Appointment | null;

  peso?: number | string | null;
  altura?: number | string | null;
  temperatura?: number | string | null;
  presion_arterial?: string | null;
  frecuencia_cardiaca?: number | null;
  frecuencia_respiratoria?: number | null;

  cita_id?: number;
  paciente_id: number;
  medico_id?: number;

  medico?: ConsultationDoctor | string;
  created_at?: string;
  creado_el?: string;
  fecha?: string;
}

export interface ConsultationListResponse {
  data: Consultation[];
}
