import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { cancelAppointmentAction } from '../actions/cancel-appointment.action';
import { useToast } from 'vue-toastification';

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    mutateAsync: functionCancelAppointment,
    // data: updatedAppointment,
    isPending: isPendingCancelAppointment,
    error: errorCancelAppointment,
  } = useMutation({
    mutationFn: cancelAppointmentAction,

    onSuccess: (/* updatedAppointment */) => {
      toast.success('Cita cancelada correctamente');

      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });

      // queryClient.invalidateQueries({
      //   queryKey: ['patient-appointments'],
      // });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    functionCancelAppointment,
    // updatedAppointment,
    isPendingCancelAppointment,
    errorCancelAppointment,
  };
};
