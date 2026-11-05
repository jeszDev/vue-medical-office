export interface DoctorSpecialty {
  id: number;
  nombre: string;
  descripcion?: string | null;
  cedula_especialidad?: string | null;
  universidad_especialidad?: string | null;
  es_principal: boolean;
}

export interface DoctorProfile {
  id: number;
  cedula_profesional: string;
  universidad?: string | null;
  telefono_consultorio?: string | null;
  direccion_consultorio?: string | null;
  firma_digital_path?: string | null;
  especialidades: DoctorSpecialty[];
}

export interface FamilyBond {
  relacion: string;
  relacion_texto: string;
  es_contacto_principal: boolean;
}

export interface PatientProfile {
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
  es_dependiente: boolean;
  vinculo_familiar?: FamilyBond | null;
}

export interface User {
  id: number;
  name?: string;
  nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  nombre_completo?: string;
  curp?: string;
  avatar?: string;
  email: string;

  roles: string[];
  permissions: string[];

  doctor?: DoctorProfile | null;
  patient?: PatientProfile | null;
}
