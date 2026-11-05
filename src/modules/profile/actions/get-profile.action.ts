import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { UserProfileData } from '../interfaces';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

export const getProfileAction = async (): Promise<UserProfileData> => {
  const authStore = useAuthStore();
  const currentUser = authStore.user;

  try {
    const { data } = await medicalOfficeApi.get<UserProfileData>('/profile');
    if (data && data.id) {
      return data;
    }
  } catch (error) {
    // Si el endpoint /profile aún no está expuesto en el backend de Laravel,
    // consolidamos de forma segura la información con el usuario autenticado actual.
    console.warn('Endpoint /profile no disponible, usando datos de sesión local:', error);
  }

  // Fallback con datos del usuario autenticado
  const roles = currentUser?.roles || [];
  const isDoctor = roles.some((r) => ['doctor', 'medico', 'médico'].includes(r.toLowerCase()));
  const isReceptionist = roles.some((r) => ['recepcionista', 'receptionist'].includes(r.toLowerCase()));
  const isPatient = roles.some((r) => ['paciente', 'patient'].includes(r.toLowerCase()));

  return {
    id: currentUser?.id || 1,
    name:
      currentUser?.nombre_completo ||
      currentUser?.patient?.nombre_completo ||
      currentUser?.name ||
      'Usuario',
    email: currentUser?.email || '',
    telefono:
      currentUser?.doctor?.telefono_consultorio ||
      currentUser?.patient?.telefono ||
      '',
    avatar: currentUser?.avatar || undefined,
    roles,
    permissions: currentUser?.permissions || [],

    // Valores para Doctor
    ...(isDoctor && {
      especialidad:
        currentUser?.doctor?.especialidades?.find((e) => e.es_principal)?.nombre ||
        currentUser?.doctor?.especialidades?.[0]?.nombre ||
        'Medicina General',
      cedula_profesional: currentUser?.doctor?.cedula_profesional || '',
      consultorio:
        currentUser?.doctor?.direccion_consultorio || 'Consultorio Central',
      horario_atencion: 'Lunes a Viernes',
      total_consultas: 0,
      citas_hoy: 0,
    }),

    // Valores para Recepcionista
    ...(isReceptionist && {
      turno: 'General',
      area: 'Recepción Central',
      citas_gestionadas_hoy: 0,
      solicitudes_pendientes: 0,
    }),

    // Valores para Paciente
    ...(isPatient && {
      curp: currentUser?.patient?.curp || currentUser?.curp || '',
      folio_paciente: currentUser?.patient?.id
        ? `#PAC-${String(currentUser.patient.id).padStart(5, '0')}`
        : currentUser?.id
          ? `#PAC-${String(currentUser.id).padStart(5, '0')}`
          : undefined,
      fecha_nacimiento: currentUser?.patient?.fecha_nacimiento || '',
      edad: currentUser?.patient?.edad || undefined,
      direccion: currentUser?.doctor?.direccion_consultorio || '',
      contacto_emergencia_nombre: '',
      contacto_emergencia_telefono: '',
      es_tutor: false,
      tutelados: [],
    }),
  };
};
