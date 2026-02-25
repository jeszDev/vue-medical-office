export interface Consultation {
  id: number;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  notas?: string;

  peso?: number;
  altura?: number;
  temperatura?: number;
  presion_arterial?: string;
  frecuencia_cardiaca?: number;
  frecuencia_respiratoria?: number;

  cita_id?: number;
  paciente_id: number;
  medico_id: number;
}
