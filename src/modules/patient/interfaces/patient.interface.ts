export interface Patient {
  id: number;
  curp: string | null;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  nombre_completo: string;
  fecha_nacimiento: string | null;
  edad: number | null;
  telefono: string | null;
  correo_electronico: string | null;
  observaciones: string | null;
  creado_el: string;
  avatar?: string | null;
}

export interface PatientSingleResponse {
  data: Patient;
}

export type PatientResponse = PatientSingleResponse;
