export const VALID_FLOORS: string[] = [
    'BASEMENT', 'SEMI_BASEMENT', 'GROUND_FLOOR', 'MEZZANINE',
    ...Array.from({ length: 50 }, (_, i) => `_${i + 1}`)
  ];
  