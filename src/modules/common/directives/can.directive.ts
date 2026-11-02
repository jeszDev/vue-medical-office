import type { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

function checkPermission(binding: DirectiveBinding): boolean {
  const { value } = binding;
  if (!value) return true;

  const authStore = useAuthStore();
  if (!authStore.user) return false;

  const userRoles = (authStore.user.roles || []).map((r) => String(r).toLowerCase().trim());
  if (userRoles.includes('admin') || userRoles.includes('administrador')) {
    return true;
  }

  const userPermissions = (authStore.user.permissions || []).map((p) =>
    String(p).toLowerCase().trim(),
  );

  if (Array.isArray(value)) {
    return binding.modifiers.all
      ? value.every((p) => userPermissions.includes(String(p).toLowerCase().trim()))
      : value.some((p) => userPermissions.includes(String(p).toLowerCase().trim()));
  }

  return userPermissions.includes(String(value).toLowerCase().trim());
}

export const vCan: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (!checkPermission(binding)) {
      el.parentNode?.removeChild(el);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (!checkPermission(binding)) {
      el.parentNode?.removeChild(el);
    }
  },
};
