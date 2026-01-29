import type { AppointmentDetail } from "@/modules/appointment/interfaces/appointment-detail.interface";

export interface Patient {
  id: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  fecha_nacimiento: string | null;
  telefono: string | null;
  correo_electronico: string | null;
  observaciones: string | null;
  creado_el: string;
  nombre_completo: string;

  detalle_cita?: AppointmentDetail;
}
