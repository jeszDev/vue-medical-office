export interface Link {
  url: string | null;
  label: string;
  page?: number | null;
  active: boolean;
}

export interface Pagination {
  currentPage: number;
  firstPageUrl: string;
  lastPage: number;
  lastPageUrl: string;
  links: Link[];
  nextPageUrl: string;
  perPage: number;
  prevPageUrl: string;
  total: number;
  to: number | null;
  from: number | null;
}
