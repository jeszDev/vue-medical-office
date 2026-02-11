import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { Appointment } from '../interfaces/appointment.interface';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import type { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';

interface ApiErrorResponse {
  message: string;
  code?: string;
}
const toast = useToast();
const authStore = useAuthStore();

export const createUpdateAppointmentAction = async (appointment: Partial<Appointment>) => {
  // const toast = useToast();

  try {
    if (appointment.id && appointment.id !== '') {
      return await updateappointment(appointment);
    }

    const { data } = await medicalOfficeApi.post<Appointment>(
      `/patients/${appointment.patientId}/appointments`,
      { ...appointment, medico_id: authStore.user!.id },
    );

    console.log(data);

    return data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;

    if (err.response?.status === 409 && err.response.data.code === 'APPOINTMENT_OVERLAP') {
      throw new Error(err.response.data.message);
      toast.error('Ya existe una cita con esa fecha y horario');
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
