export interface ProfileDependent {
  id: number;
  nombre_completo: string;
  parentesco: string; // ej. Hijo(a), Tutelado(a), Padre/Madre
  edad?: number | null;
  curp?: string | null;
  folio_expediente?: string | null;
  fecha_nacimiento?: string | null;
  alergias?: string | null;
}

export interface UserProfileData {
  id: number;
  name: string;
  email: string;
  telefono?: string | null;
  avatar?: string | null;
  roles: string[];
  permissions?: string[];

  // Campos específicos de Médico
  especialidad?: string | null;
  cedula_profesional?: string | null;
  consultorio?: string | null;
  horario_atencion?: string | null;
  total_consultas?: number;
  citas_hoy?: number;

  // Campos específicos de Recepción
  turno?: string | null; // Matutino, Vespertino, Mixto
  area?: string | null;
  citas_gestionadas_hoy?: number;
  solicitudes_pendientes?: number;

  // Campos específicos de Paciente
  curp?: string | null;
  folio_paciente?: string | null;
  fecha_nacimiento?: string | null;
  edad?: number | null;
  direccion?: string | null;
  contacto_emergencia_nombre?: string | null;
  contacto_emergencia_telefono?: string | null;
  es_tutor?: boolean;
  tutelados?: ProfileDependent[];
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  telefono?: string | null;
  direccion?: string | null;
  especialidad?: string | null;
  cedula_profesional?: string | null;
  consultorio?: string | null;
  horario_atencion?: string | null;
  turno?: string | null;
  contacto_emergencia_nombre?: string | null;
  contacto_emergencia_telefono?: string | null;
}

export interface ChangePasswordPayload {
  current_password?: string;
  new_password: string;
  new_password_confirmation: string;
}

export type ProfileTabType = 'overview' | 'edit' | 'security' | 'dependents';
