<template>
  <template v-if="hasAccess">
    <slot :disabled="false" :has-access="true" />
  </template>
  <template v-else-if="behavior === 'disable'">
    <slot
      :disabled="true"
      :has-access="false"
      :tooltip="tooltip || 'No tienes permisos suficientes para realizar esta acción'"
    />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePermissions } from '@/modules/auth/composables/usePermissions';
import type { Permission } from '@/modules/auth/constants/permissions.constant';

interface Props {
  permission?: Permission;
  permissions?: Permission[];
  matchMode?: 'any' | 'all';
  roles?: string | string[];
  behavior?: 'hide' | 'disable';
  tooltip?: string;
}

const props = withDefaults(defineProps<Props>(), {
  matchMode: 'any',
  behavior: 'hide',
});

const { can, canAny, canAll, hasRole } = usePermissions();

const hasAccess = computed<boolean>(() => {
  if (props.roles && !hasRole(props.roles)) {
    return false;
  }

  if (props.permission && !can(props.permission)) {
    return false;
  }

  if (props.permissions && props.permissions.length > 0) {
    const isAllowed =
      props.matchMode === 'all' ? canAll(props.permissions) : canAny(props.permissions);

    if (!isAllowed) {
      return false;
    }
  }

  return true;
});
</script>
