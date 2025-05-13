import { VALID_FLOORS } from '../constants/floor-types';

export const normalizeFloor = (floor: string | null | undefined): string | null => {
  const value = floor?.trim().toUpperCase();
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    const num = parseInt(value);
    if (num >= 1 && num <= 50) {
      return `_${num}`;
    }
  }

  return VALID_FLOORS.includes(value) ? value : null;
};
