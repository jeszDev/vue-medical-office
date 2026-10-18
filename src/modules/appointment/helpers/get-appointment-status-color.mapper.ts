import type { Appointment, AppointmentStatusObject } from '../interfaces/appointment.interface';

export type BadgeColor = 'primary' | 'warning' | 'success' | 'danger' | 'pending';

export const getAppointmentStatusName = (
  status: AppointmentStatusObject | string | undefined | null,
): string => {
  if (!status) return '';
  return typeof status === 'string' ? status : status.nombre ?? '';
};

export const getAppointmentDoctorName = (
  appointment: Appointment | undefined | null,
): string => {
  if (!appointment) return '';
  return (
    appointment.doctor?.nombre_completo ??
    (typeof appointment.medico === 'string'
      ? appointment.medico
      : appointment.medico?.nombre_completo) ??
    ''
  );
};

const STATUS_COLOR_MAP: Record<string, BadgeColor> = {
  confirmada: 'success',
  cancelada: 'danger',
  pendiente: 'pending',
  atendida: 'primary',
};

export const getAppointmentStatusColor = (
  status: AppointmentStatusObject | string | undefined | null,
): BadgeColor => {
  const name = getAppointmentStatusName(status).toLowerCase();
  return STATUS_COLOR_MAP[name] ?? 'primary';
};
