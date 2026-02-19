type BadgeColor = 'primary' | 'warning' | 'success' | 'danger' | 'pending';
type AppointmentStatus = 'Confirmada' | 'Cancelada' | 'Pendiente';

const STATUS_COLOR_MAP: Record<AppointmentStatus, BadgeColor> = {
  Confirmada: 'success',
  Cancelada: 'danger',
  Pendiente: 'pending',
};

export const getAppointmentStatusColor = (status: AppointmentStatus): BadgeColor =>
  STATUS_COLOR_MAP[status] ?? 'primary';
