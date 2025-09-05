import type { Patient } from "@/modules/patient/interfaces/patient.interface";

export interface Appointment {
  id: number;
  fecha: string;        // "2025-09-25"
  hora_inicio: string;  // "19:34:13"
  hora_fin: string;     // "20:04:13"
  motivo: string;
  observaciones: string;
  medico_id: number;
  cita_estatus_id: number;
  pacientes: Patient[];
}
