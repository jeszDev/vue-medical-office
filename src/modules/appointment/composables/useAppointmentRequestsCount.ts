import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getAppointmentRequestsAction } from '../actions/get-appointment-requests.action';
import type { Appointment } from '../interfaces/appointment.interface';

export function useAppointmentRequestsCount(options?: {
  enabled?: MaybeRefOrGetter<boolean>;
}) {
  const isEnabled = computed(() =>
    options?.enabled !== undefined ? Boolean(toValue(options.enabled)) : true,
  );

  const { data: rawRequests, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ['appointment-requests'],
    queryFn: getAppointmentRequestsAction,
    enabled: isEnabled,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const count = computed(() => rawRequests.value?.length ?? 0);

  return {
    count,
    isLoading,
    error,
  };
}
