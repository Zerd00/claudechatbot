// src/utils/normalize-states.ts
const stateMapping: Record<string, string> = {
    'sale': 'SALE',
    'for sale': 'SALE',
    'rent': 'RENT',
    'for rent': 'RENT',
    'sold': 'SOLD',
    'already sold': 'SOLD',
    'rented': 'RENTED',
    'already rented': 'RENTED',
    'unavailable': 'UNAVAILABLE',
    'taken': 'TAKEN',
    'booked': 'TAKEN',
    'reserved': 'TAKEN',
    'under construction': 'UNDER_CONSTRUCTION',
    'under-construction': 'UNDER_CONSTRUCTION',
    'construction': 'UNDER_CONSTRUCTION',
    'under maintenance': 'UNDER_MAINTENANCE',
    'under-maintenance': 'UNDER_MAINTENANCE',
    'maintenance': 'UNDER_MAINTENANCE',
  };
  
  const VALID_STATES = [
    'SALE', 'RENT', 'SOLD', 'RENTED',
    'UNAVAILABLE', 'TAKEN', 'UNDER_CONSTRUCTION', 'UNDER_MAINTENANCE'
  ];
  
  export const normalizeStates = (states: string[] = []): string[] =>
    states
      .map(s =>
        stateMapping[s.trim().toLowerCase().replace(/[-_]/g, ' ')] ?? s.toUpperCase()
      )
      .filter(s => VALID_STATES.includes(s));
  