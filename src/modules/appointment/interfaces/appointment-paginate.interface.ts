import type {
  PaginateLinks,
  PaginateMeta,
} from '@/modules/patient/interfaces/patient-paginate.interface';
import type { Appointment } from './appointment.interface';

export interface AppointmentPaginate {
  data: Appointment[];
  links: PaginateLinks;
  meta: PaginateMeta;
}
