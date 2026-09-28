import type { AppointmentDetail } from '@/modules/appointment/interfaces/appointment-detail.interface';

export interface Patient {
  id: number;
  curp?: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  nombre_completo: string;
  fecha_nacimiento: string | null;
  telefono: string | null;
  correo_electronico: string | null;
  observaciones: string | null;
  creado_el: string;

  detalle_cita?: AppointmentDetail;
}
