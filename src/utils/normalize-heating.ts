import { VALID_HEATING_TYPES } from '../constants/heating-types';

const heatingMapping: Record<string, string> = {
  'central': 'CENTRAL',
  'central heating': 'CENTRAL',
  'no heating': 'NO_HEATING',
  'none': 'NO_HEATING',
  'autonomous': 'AUTONOMOUS',
  'self use': 'SELF_USE',
  'self-use': 'SELF_USE',
  'self_use': 'SELF_USE',
};

export const normalizeHeating = (values: string[] = []) =>
  values
    .map(v =>
      heatingMapping[v.trim().toLowerCase()] ?? v.toUpperCase()
    )
    .filter(v => VALID_HEATING_TYPES.includes(v));
