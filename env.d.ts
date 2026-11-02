/// <reference types="vite/client" />

interface Window {
  tailwind?: {
    Modal: {
      getOrCreateInstance: (el: HTMLElement | Element | null) => {
        show: () => void;
        hide: () => void;
        toggle: () => void;
      };
      getInstance: (el: HTMLElement | Element | null) => {
        show: () => void;
        hide: () => void;
        toggle: () => void;
      } | null;
    };
    Tab?: any;
    Accordion?: any;
  };
}

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumbs?: import('@/modules/common/interfaces/breadcrumb.interface').BreadcrumbItem[];
    permission?: import('@/modules/auth/constants/permissions.constant').Permission;
    permissions?: import('@/modules/auth/constants/permissions.constant').Permission[];
    roles?: string[];
    matchMode?: 'any' | 'all';
    requiresAuth?: boolean;
  }
}

