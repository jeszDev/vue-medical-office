import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { UserProfileData, ProfileDependent } from '../interfaces';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { getMyPatientsAction } from '@/modules/patient/actions';

export const getProfileAction = async (): Promise<UserProfileData> => {
  const authStore = useAuthStore();
  const currentUser = authStore.user;

  try {
    const { data } = await medicalOfficeApi.get<UserProfileData>('/profile');
    if (data && data.id) {
      return data;
    }
  } catch (error) {
    // Si el endpoint /profile general no está expuesto en el backend de Laravel,
    // consolidamos de forma estructurada con los endpoints especializados.
    console.warn('Endpoint /profile no disponible, consolidando datos del perfil:', error);
  }

  // Fallback estructurado con datos del usuario autenticado y /my-patients
  const roles = currentUser?.roles || [];
  const isDoctor = roles.some((r) => ['doctor', 'medico', 'médico'].includes(r.toLowerCase()));
  const isReceptionist = roles.some((r) => ['recepcionista', 'receptionist'].includes(r.toLowerCase()));
  const isPatient = roles.some((r) => ['paciente', 'patient'].includes(r.toLowerCase())) || !!currentUser?.patient;

  let tutelados: ProfileDependent[] = [];
  let esTutor = false;
  let titularPatient = currentUser?.patient;

  if (isPatient) {
    try {
      const myPatients = await getMyPatientsAction();
      if (myPatients && myPatients.length > 0) {
        // Identificar al paciente titular de la cuenta familiar
        const foundTitular =
          myPatients.find((p) => p.vinculo_familiar?.relacion === 'titular') ||
          myPatients.find((p) => !p.es_dependiente) ||
          myPatients[0];

        if (foundTitular) {
          titularPatient = {
            ...(titularPatient || {}),
            ...foundTitular,
          };
        }

        // Los tutelados / dependientes son todos aquellos que no son el titular
        const dependents = myPatients.filter(
          (p) =>
            p.id !== foundTitular?.id &&
            (p.es_dependiente || p.vinculo_familiar?.relacion !== 'titular'),
        );

        tutelados = dependents.map((p) => {
          let parentescoLabel =
            p.vinculo_familiar?.relacion_texto || p.vinculo_familiar?.relacion || 'Dependiente';
          const rel = (p.vinculo_familiar?.relacion || '').toLowerCase();
          if (rel === 'padre' || rel === 'madre') {
            parentescoLabel = 'Hijo/a (Menor tutelado)';
          } else if (rel === 'hijo' || rel === 'hija') {
            parentescoLabel = 'Madre / Padre (Adulto mayor)';
          } else if (rel === 'tutor') {
            parentescoLabel = 'Tutelado legal';
          } else if (rel === 'conyuge') {
            parentescoLabel = 'Cónyuge';
          }

          return {
            id: p.id,
            nombre_completo:
              p.nombre_completo ||
              `${p.nombre} ${p.primer_apellido || ''} ${p.segundo_apellido || ''}`.trim(),
            parentesco: parentescoLabel,
            edad: p.edad ?? null,
            curp: p.curp ?? null,
            folio_expediente: `#PAC-${String(p.id).padStart(5, '0')}`,
            fecha_nacimiento: p.fecha_nacimiento ?? null,
            alergias: p.observaciones ?? null,
          };
        });

        esTutor = tutelados.length > 0;
      }
    } catch (err) {
      console.warn('No se pudieron obtener los dependientes del usuario:', err);
    }
  }

  return {
    id: currentUser?.id || 1,
    name:
      currentUser?.nombre_completo ||
      titularPatient?.nombre_completo ||
      currentUser?.patient?.nombre_completo ||
      currentUser?.name ||
      'Usuario',
    email: currentUser?.email || '',
    telefono:
      currentUser?.doctor?.telefono_consultorio ||
      titularPatient?.telefono ||
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
      curp: titularPatient?.curp || currentUser?.patient?.curp || currentUser?.curp || '',
      folio_paciente: titularPatient?.id
        ? `#PAC-${String(titularPatient.id).padStart(5, '0')}`
        : currentUser?.patient?.id
          ? `#PAC-${String(currentUser.patient.id).padStart(5, '0')}`
          : currentUser?.id
            ? `#PAC-${String(currentUser.id).padStart(5, '0')}`
            : undefined,
      fecha_nacimiento: titularPatient?.fecha_nacimiento || currentUser?.patient?.fecha_nacimiento || '',
      edad: titularPatient?.edad || currentUser?.patient?.edad || undefined,
      direccion: currentUser?.doctor?.direccion_consultorio || '',
      contacto_emergencia_nombre: '',
      contacto_emergencia_telefono: '',
      es_tutor: esTutor,
      tutelados,
    }),
  };
};
