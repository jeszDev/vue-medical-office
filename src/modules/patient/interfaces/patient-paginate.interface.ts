import type { Patient } from './patient.interface';

export interface PaginateLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginateMetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginateMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginateMetaLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PatientPaginate {
  data: Patient[];
  links: PaginateLinks;
  meta: PaginateMeta;
}
