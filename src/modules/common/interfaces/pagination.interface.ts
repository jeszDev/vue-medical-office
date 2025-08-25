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
  to: number;
  from: number;
}

interface Link {
  url: string;
  label: string;
  active: boolean;
}
