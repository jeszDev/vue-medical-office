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
    name: currentUser?.name || 'Usuario',
    email: currentUser?.email || '',
    telefono: '',
    avatar: undefined,
    roles,
    permissions: currentUser?.permissions || [],

    // Valores para Doctor (cuando el endpoint no provee aún datos extendidos)
    ...(isDoctor && {
      especialidad: 'Medicina General',
      cedula_profesional: '',
      consultorio: 'Consultorio Central',
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
      curp: '',
      folio_paciente: currentUser?.id ? `#PAC-${String(currentUser.id).padStart(5, '0')}` : undefined,
      fecha_nacimiento: '',
      edad: undefined,
      direccion: '',
      contacto_emergencia_nombre: '',
      contacto_emergencia_telefono: '',
      es_tutor: false,
      tutelados: [],
    }),
  };
};
