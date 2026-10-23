export type TurnoPreferido = 'matutino' | 'vespertino' | 'indistinto';

export interface ShiftInfo {
  value: TurnoPreferido;
  label: string;
  badgeLabel: string;
  description: string;
  color: 'primary' | 'warning' | 'pending';
}

export const normalizeShift = (shift?: string | null): TurnoPreferido | null => {
  if (!shift) return null;
  const s = shift.toLowerCase().trim();
  if (s === 'matutino' || s === 'matituno') return 'matutino';
  if (s === 'vespertino') return 'vespertino';
  if (s === 'indistinto') return 'indistinto';
  return null;
};

export const SHIFT_OPTIONS: ShiftInfo[] = [
  {
    value: 'matutino',
    label: 'Turno Matutino',
    badgeLabel: 'Matutino',
    description: 'Preferencia por horario de mañana (08:00 - 14:00)',
    color: 'primary',
  },
  {
    value: 'vespertino',
    label: 'Turno Vespertino',
    badgeLabel: 'Vespertino',
    description: 'Preferencia por horario de tarde (14:00 - 20:00)',
    color: 'warning',
  },
  {
    value: 'indistinto',
    label: 'Horario Indistinto',
    badgeLabel: 'Indistinto',
    description: 'Cualquier horario disponible del día',
    color: 'pending',
  },
];

export const getShiftLabel = (shift?: string | null): string => {
  const normalized = normalizeShift(shift);
  if (!normalized) return shift ? String(shift) : 'Sin turno preferido';
  const found = SHIFT_OPTIONS.find((s) => s.value === normalized);
  return found ? found.label : String(shift);
};

export const getShiftBadgeLabel = (shift?: string | null): string => {
  const normalized = normalizeShift(shift);
  if (!normalized) return shift ? String(shift) : 'Sin turno';
  const found = SHIFT_OPTIONS.find((s) => s.value === normalized);
  return found ? found.badgeLabel : String(shift);
};

export const getShiftDescription = (shift?: string | null): string => {
  const normalized = normalizeShift(shift);
  if (!normalized) return '';
  const found = SHIFT_OPTIONS.find((s) => s.value === normalized);
  return found ? found.description : '';
};

export const getShiftBadgeColor = (
  shift?: string | null,
): 'primary' | 'warning' | 'pending' => {
  const normalized = normalizeShift(shift);
  if (!normalized) return 'pending';
  const found = SHIFT_OPTIONS.find((s) => s.value === normalized);
  return found ? found.color : 'pending';
};

