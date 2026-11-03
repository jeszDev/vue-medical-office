export interface PatientGuardian {
  id: number;
  curp: string | null;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  nombre_completo: string;
  email: string | null;
  relacion: string;
  relacion_texto: string;
  es_contacto_principal: boolean;
}

export interface PatientGuardiansResponse {
  es_dependiente: boolean;
  tutores: PatientGuardian[];
}

