import type { RouteParamsRaw, LocationQueryRaw } from 'vue-router';

export interface BreadcrumbItem {
  title: string;
  routeName?: string;
  params?: RouteParamsRaw;
  query?: LocationQueryRaw;
}

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumbs?: BreadcrumbItem[];
  }
}
