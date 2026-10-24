import type {
  DocumentType,
  DocumentTypeOption,
} from '../interfaces/clinical-document.interface';

export const DOCUMENT_TYPE_OPTIONS: DocumentTypeOption[] = [
  {
    value: 'radiografia',
    label: 'Radiografía (Rayos X)',
    description: 'Placas radiográficas simples o contrastadas',
    badgeColor: 'primary',
  },
  {
    value: 'ultrasonido',
    label: 'Ultrasonido / Ecografía',
    description: 'Imágenes ecográficas o doppler',
    badgeColor: 'secondary',
  },
  {
    value: 'laboratorio',
    label: 'Laboratorio Clínico',
    description: 'Biometría, química sanguínea, uroanálisis, etc.',
    badgeColor: 'success',
  },
  {
    value: 'fotografia_clinica',
    label: 'Fotografía Clínica',
    description: 'Seguimiento de lesiones, heridas o dermatología',
    badgeColor: 'warning',
  },
  {
    value: 'estudio_gabinete',
    label: 'Estudio de Gabinete',
    description: 'Electrocardiogramas, espirometrías, TAC o RM',
    badgeColor: 'pending',
  },
  {
    value: 'otro',
    label: 'Otro Documento',
    description: 'Consentimientos, valoraciones previas o notas externas',
    badgeColor: 'secondary',
  },
];

export const getDocumentTypeLabel = (type: DocumentType | string): string => {
  const found = DOCUMENT_TYPE_OPTIONS.find((opt) => opt.value === type);
  return found ? found.label : type;
};

export const getDocumentTypeBadgeColor = (
  type: DocumentType | string,
): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'pending' => {
  const found = DOCUMENT_TYPE_OPTIONS.find((opt) => opt.value === type);
  return found ? found.badgeColor : 'secondary';
};

export const isImageMimeType = (mimeType?: string | null): boolean => {
  if (!mimeType) return false;
  return mimeType.startsWith('image/');
};

export const isPdfMimeType = (mimeType?: string | null): boolean => {
  if (!mimeType) return false;
  return mimeType === 'application/pdf';
};
