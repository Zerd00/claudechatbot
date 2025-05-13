export enum HeatingType {
    CENTRAL = 'CENTRAL',
    NO_HEATING = 'NO_HEATING',
    AUTONOMOUS = 'AUTONOMOUS',
    SELF_USE = 'SELF_USE',
  }
  
  export const VALID_HEATING_TYPES: string[] = Object.values(HeatingType);
  