import { ref, readonly } from 'vue';
import type { BreadcrumbItem } from '../interfaces/breadcrumb.interface';

const breadcrumbs = ref<BreadcrumbItem[]>([]);

export const useBreadcrumb = () => {
  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    breadcrumbs.value = [...items];
  };

  const addBreadcrumb = (item: BreadcrumbItem) => {
    breadcrumbs.value.push(item);
  };

  const clearBreadcrumbs = () => {
    breadcrumbs.value = [];
  };

  return {
    breadcrumbs: readonly(breadcrumbs),
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs,
  };
};
