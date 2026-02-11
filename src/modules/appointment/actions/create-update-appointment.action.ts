import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment } from '../interfaces/appointment.interface';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useToast } from 'vue-toastification';

const toast = useToast();
const authStore = useAuthStore();

export const createUpdateAppointmentAction = async (appointment: Partial<Appointment>) => {
  try {
    if (appointment.id && appointment.id !== '') {
      return await updateappointment(appointment);
    }

    const { data } = await medicalOfficeApi.post<Appointment>(
      `/patients/${appointment.patient_id}/appointments`,
      { ...appointment, medico_id: authStore.user!.id },
    );

    console.log(data);

    return data;
  } catch (error) {
    if (
      error.response?.status === 409 &&
      error.response.data.code === 'APPOINTMENT_ALREADY_EXISTS'
    ) {
      toast.error('Ya existe una cita programada en esa fecha y hora');
      throw new Error(error.response.data.message);
    }
  }
};

const updateappointment = async (appointment: Partial<Appointment>) => {
  const appointmentId = appointment.id;

  delete appointment.id;
  // delete appointment.nombre_completo;
  // delete appointment.creado_el;

  try {
    const { data } = await medicalOfficeApi.patch<Appointment>(
      `/appointments/${appointmentId}`,
      appointment,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error updating appointment');
  }
};
