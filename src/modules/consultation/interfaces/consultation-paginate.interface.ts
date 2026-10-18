import type {
  PaginateLinks,
  PaginateMeta,
} from '@/modules/patient/interfaces/patient-paginate.interface';
import type { Consultation } from './consultation.interface';

export interface ConsultationPaginate {
  data: Consultation[];
  links: PaginateLinks;
  meta: PaginateMeta;
}
