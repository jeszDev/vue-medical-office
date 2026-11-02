export const PERMISSIONS = {
  // Pacientes
  PATIENTS_VIEW: 'patients.view',
  PATIENTS_CREATE: 'patients.create',
  PATIENTS_UPDATE: 'patients.update',
  PATIENTS_DELETE: 'patients.delete',

  // Citas
  APPOINTMENTS_VIEW: 'appointments.view',
  APPOINTMENTS_CREATE: 'appointments.create',
  APPOINTMENTS_UPDATE: 'appointments.update',
  APPOINTMENTS_CANCEL: 'appointments.cancel',
  APPOINTMENTS_CONFIRM: 'appointments.confirm',
  APPOINTMENTS_COMPLETE: 'appointments.complete',
  APPOINTMENTS_DELETE: 'appointments.delete',

  // Consultas
  CONSULTATIONS_VIEW: 'consultations.view',
  CONSULTATIONS_CREATE: 'consultations.create',
  CONSULTATIONS_UPDATE: 'consultations.update',
  CONSULTATIONS_DELETE: 'consultations.delete',

  // Documentos Clínicos (sugeridos para backend)
  DOCUMENTS_VIEW: 'documents.view',
  DOCUMENTS_CREATE: 'documents.create',
  DOCUMENTS_DELETE: 'documents.delete',
  DOCUMENTS_RESTORE: 'documents.restore',

  // Roles y Administración (sugeridos para backend)
  ROLES_VIEW: 'roles.view',
  ROLES_MANAGE: 'roles.manage',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type Permission = (typeof PERMISSIONS)[PermissionKey] | string;
