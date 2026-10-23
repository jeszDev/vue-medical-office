export type DocumentType =
  | 'radiografia'
  | 'ultrasonido'
  | 'laboratorio'
  | 'fotografia_clinica'
  | 'estudio_gabinete'
  | 'otro';

export interface ClinicalDocument {
  id: number;
  consulta_id: number;
  paciente_id: number;
  medico_id?: number | null;
  tipo_documento: DocumentType;
  titulo: string;
  descripcion?: string | null;
  nombre_archivo_original: string;
  ruta_archivo: string;
  disk: string;
  mime_type: string;
  peso_bytes: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  // URLs temporales o de descarga devueltas por la API
  url?: string;
  temporary_url?: string;
  download_url?: string;

  // Relaciones opcionales cargadas por el backend
  medico?: {
    id: number;
    nombre_completo?: string;
    nombre?: string;
    primer_apellido?: string;
  } | null;
  consulta?: {
    id: number;
    fecha?: string;
    motivo?: string;
  } | null;
}

export interface UploadDocumentPayload {
  archivo: File;
  tipo_documento: DocumentType;
  titulo: string;
  descripcion?: string | null;
}

export interface QueuedDocument {
  id: string;
  file: File;
  tipo_documento: DocumentType;
  titulo: string;
  descripcion?: string;
  previewUrl?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export interface DocumentTypeOption {
  value: DocumentType;
  label: string;
  description: string;
  badgeColor: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'pending';
}
